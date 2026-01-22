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
  prompt?: string;
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

    // Poll for the result
    const result = await this.pollForResult(
      generationResponse.request_id,
      apiKey
    );

    return {
      images: [
        {
          url: result.result_url,
          revisedPrompt: result.prompt,
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
          messages: [{ content: 'test' }],
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
      messages: [{ content: prompt }],
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

      const response = await fetch(POLLING_ENDPOINT, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Polling failed: ${response.status}`);
      }

      const result: EternalAIPollResponse = await response.json();

      if (result.status === 'done') {
        if (!result.result_url) {
          throw new Error('Generation completed but no result URL provided');
        }
        return result;
      }

      if (result.status === 'failed') {
        throw new Error(
          `Image generation failed: ${result.error || 'Unknown error'}`
        );
      }

      // Status is 'processing', continue polling
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
