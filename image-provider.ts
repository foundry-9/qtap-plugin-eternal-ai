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

const BASE_MODELS = [
  'black-forest-labs/FLUX.1-dev',
  'black-forest-labs/FLUX.1-schnell',
] as const;

const STYLES: Record<string, { loraId: string; name: string; description: string; triggerPhrase: string | null }> = {
  impressionist: {
    loraId: 'Art_style_Impressionist',
    name: 'Impressionist',
    description: 'Classic impressionist painting style with visible brushstrokes and light effects',
    triggerPhrase: null,
  },
  painterly: {
    loraId: 'FLUX-daubrez-DB4RZ',
    name: 'Daubrez Painterly',
    description: 'Abstract art masterpiece style with rich painterly textures',
    triggerPhrase: 'DB4RZ Daubrez style painting of',
  },
  anime: {
    loraId: 'psycho_art',
    name: 'Psycho Art Anime',
    description: 'Anime style with glitching abstract surreal brushstrokes',
    triggerPhrase: 'Psycho_4rt anime',
  },
  mechanical: {
    loraId: 'Flux_1_MechanicalBloom',
    name: 'Mechanical Bloom',
    description: 'Surreal anime-style portraits with mechanical floral implants in cyberpunk settings',
    triggerPhrase: 'CynthiaPortrait:',
  },
  random: {
    loraId: 'RM_Artistify_v1_0M',
    name: 'RandomMaxx Artistify',
    description: 'Surreal dreamlike artistic elements with flowing, ethereal qualities',
    triggerPhrase: null,
  },
};

interface EternalAIGenerationResponse {
  request_id: string;
  status: 'pending' | 'done' | 'success' | 'failed';
  result?: string;
  progress?: number;
}

interface EternalAIPollResponse {
  request_id: string;
  status: 'done' | 'success' | 'processing' | 'pending' | 'failed' | 'error';
  result_url?: string;
  result_image_url?: string;
  result_image?: string;
  file_name?: string;
  image_request_type?: string;
  prompt?: string;
  magic_prompt?: string;
  model?: string;
  created_at?: string;
  updated_at?: string;
  queue_info?: {
    position: number;
    wait_time: number;
  };
  error?: string;
}

export class EternalAIImageProvider implements ImageGenProvider {
  readonly provider = 'ETERNAL_AI';
  readonly supportedModels = [
    ...BASE_MODELS,
    ...BASE_MODELS.flatMap(base =>
      Object.keys(STYLES).map(style => `${base}/${style}`)
    ),
  ];

  async generateImage(
    params: ImageGenParams,
    apiKey: string
  ): Promise<ImageGenResponse> {
    // Parse model ID to extract base model and LoRA style
    const { loraConfig } = this.parseModelId(params.model);

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
    const imageUrl = result.result_url || result.result_image_url || result.result_image;
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
        'accept': 'application/json',
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
      const imageUrl = result.result_url || result.result_image_url || result.result_image;

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

  private parseModelId(model?: string): { baseModel: string; loraConfig: Record<string, number> } {
    const loraConfig: Record<string, number> = {};
    let baseModel = BASE_MODELS[0]; // default

    if (!model) {
      return { baseModel, loraConfig };
    }

    // Check if model ID contains a style suffix (e.g., "black-forest-labs/FLUX.1-dev/impressionist")
    for (const base of BASE_MODELS) {
      if (model.startsWith(base)) {
        baseModel = base;
        const suffix = model.slice(base.length + 1); // skip the trailing "/"
        if (suffix && STYLES[suffix]) {
          loraConfig[STYLES[suffix].loraId] = 1;
        }
        return { baseModel, loraConfig };
      }
    }

    // If model doesn't match any base, treat it as-is (forward compatibility)
    return { baseModel: model, loraConfig };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
