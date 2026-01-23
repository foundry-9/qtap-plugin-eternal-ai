import type {
  ImageGenProvider,
  ImageGenParams,
  ImageGenResponse,
} from './types';

const API_BASE_URL = 'https://open.eternalai.org';
const GENERATION_ENDPOINT = `${API_BASE_URL}/creative-ai/image`;
const POLLING_ENDPOINT = `${API_BASE_URL}/creative-ai/result/image`;
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 300; // 10 minutes max

interface EternalAIGenerationResponse {
  request_id: string;
  status: 'pending' | 'done' | 'failed';
  progress?: number;
}

interface EternalAIPollResponse {
  request_id: string;
  status: 'done' | 'processing' | 'failed';
  result_url?: string;
  result_image_url?: string;
  prompt?: string;
  magic_prompt?: string;
  model?: string;
  queue_info?: {
    position: number;
    wait_time: number;
  };
  error?: string;
}

export class EternalAIImageProvider implements ImageGenProvider {
  readonly provider = 'ETERNAL_AI';
  readonly supportedModels = [
    'black-forest-labs/FLUX.1-dev',
    'black-forest-labs/FLUX.1-schnell',
  ];

  async generateImage(
    params: ImageGenParams,
    apiKey: string
  ): Promise<ImageGenResponse> {
    // Build LoRA config from style if provided
    const loraConfig: Record<string, number> = {};
    if (params.style) {
      loraConfig[this.normalizeStyle(params.style)] = 1;
    }

    // Generate the image
    const generationResponse = await this.submitGenerationRequest(
      params.prompt,
      params.negativePrompt,
      apiKey,
      loraConfig
    );

    console.log('[EternalAI] Generation response:', JSON.stringify(generationResponse));

    // Poll for the result
    const result = await this.pollForResult(
      generationResponse.request_id,
      apiKey
    );

    console.log('[EternalAI] Poll result:', JSON.stringify(result));

    // Fetch the image from URL and convert to base64
    const imageUrl = result.result_url || result.result_image_url;
    if (!imageUrl) {
      throw new Error('No image URL in result');
    }

    console.log('[EternalAI] Fetching image from:', imageUrl);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Detect mime type from URL or default to png
    const mimeType = imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg')
      ? 'image/jpeg'
      : 'image/png';

    console.log('[EternalAI] Image fetched, size:', arrayBuffer.byteLength, 'bytes');

    return {
      images: [
        {
          data: base64Data,
          mimeType,
          revisedPrompt: result.magic_prompt || result.prompt,
        },
      ],
      raw: result,
    };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(GENERATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: [{ type: 'text', text: 'test' }]
          }],
          type: 'new',
        }),
      });

      // 200-299 or 400 (bad request) = API is responding, key might be valid
      // 401/403 = invalid key
      // 429 = rate limited (still valid key)
      if (response.status === 401 || response.status === 403) {
        return false;
      }

      return response.ok || response.status >= 400;
    } catch {
      return false;
    }
  }

  async getAvailableModels(_apiKey?: string): Promise<string[]> {
    return this.supportedModels;
  }

  private async submitGenerationRequest(
    prompt: string,
    negativePrompt: string | undefined,
    apiKey: string,
    loraConfig: Record<string, number>
  ): Promise<EternalAIGenerationResponse> {
    const requestBody: Record<string, unknown> = {
      messages: [{
        role: 'user',
        content: [{ type: 'text', text: prompt }]
      }],
      type: 'new',
    };

    if (negativePrompt) {
      requestBody.negative_prompt = negativePrompt;
    }

    if (Object.keys(loraConfig).length > 0) {
      requestBody.lora_config = loraConfig;
    }

    const response = await fetch(GENERATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Eternal AI API error: ${response.status} - ${errorBody}`
      );
    }

    return response.json();
  }

  private async pollForResult(
    requestId: string,
    apiKey: string
  ): Promise<EternalAIPollResponse> {
    let attempts = 0;

    while (attempts < MAX_POLL_ATTEMPTS) {
      await this.sleep(POLL_INTERVAL_MS);
      attempts++;

      const pollUrl = `${POLLING_ENDPOINT}?request_id=${requestId}`;
      console.log('[EternalAI] Polling URL:', pollUrl);

      const response = await fetch(pollUrl, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'accept': 'application/json',
        },
      });

      console.log('[EternalAI] Poll response status:', response.status);

      if (!response.ok) {
        const errorBody = await response.text();
        console.log('[EternalAI] Poll error body:', errorBody);
        throw new Error(`Polling failed: ${response.status} - ${errorBody}`);
      }

      const result: EternalAIPollResponse = await response.json();
      console.log('[EternalAI] Poll result:', JSON.stringify(result));

      // Check for completion - handle various status formats the API might return
      const status = (result.status || '').toLowerCase();
      const imageUrl = result.result_url || result.result_image_url;

      // If we have an image URL, we're done regardless of status field
      if (imageUrl) {
        console.log('[EternalAI] Image URL found, generation complete');
        result.result_url = imageUrl;
        return result;
      }

      if (status === 'done' || status === 'completed' || status === 'success') {
        // Completed but no URL - this shouldn't happen
        throw new Error('Generation completed but no result URL provided');
      }

      if (status === 'failed' || status === 'error') {
        throw new Error(
          `Image generation failed: ${result.error || 'Unknown error'}`
        );
      }

      // Status is 'processing', 'pending', 'queued', etc. - continue polling
      if (result.queue_info) {
        console.log('[EternalAI] Queue position:', result.queue_info.position, 'Wait time:', result.queue_info.wait_time);
      }
    }

    throw new Error('Image generation timed out after 10 minutes');
  }

  private normalizeStyle(style: string): string {
    // Map common style names to Eternal AI LoRA identifiers
    const styleMap: Record<string, string> = {
      impressionist: 'Art_style_Impressionist',
      impressionism: 'Art_style_Impressionist',
      painterly: 'Daubrez_Painterly',
      anime: 'Anime_Art',
      mechanical: 'Mechanical_Bloom',
      random: 'RandomMaxx_Artistify',
    };

    const normalized = style.toLowerCase().replace(/\s+/g, '_');
    return styleMap[normalized] || style;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
