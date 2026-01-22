import type { LLMProviderPlugin } from './types';
import { EternalAIImageProvider } from './image-provider';
import { EternalAIIcon } from './icon';

const metadata = {
  providerName: 'ETERNAL_AI',
  displayName: 'Eternal AI',
  description:
    'Text-to-image generation with advanced style control and character consistency',
  colors: {
    bg: 'bg-purple-100',
    text: 'text-purple-900',
    icon: 'text-purple-600',
  },
  abbreviation: 'EAI',
} as const;

const config = {
  requiresApiKey: true,
  requiresBaseUrl: false,
  apiKeyLabel: 'Eternal AI API Key',
} as const;

const capabilities = {
  chat: false,
  imageGeneration: true,
  embeddings: false,
  webSearch: false,
} as const;

const attachmentSupport = {
  supportsAttachments: false,
  supportedMimeTypes: [] as string[],
  description: 'No file attachments supported',
};

/**
 * Eternal AI Plugin for Quilltap
 * Provides text-to-image generation capabilities powered by Eternal AI's API
 */
export const plugin: LLMProviderPlugin = {
  metadata,
  config,
  capabilities,
  attachmentSupport,

  createProvider: () => {
    // This plugin only supports image generation, not chat
    throw new Error('Eternal AI plugin only supports image generation');
  },

  createImageProvider: () => {
    return new EternalAIImageProvider();
  },

  getAvailableModels: async (apiKey: string) => {
    const provider = new EternalAIImageProvider();
    return provider.getAvailableModels(apiKey);
  },

  validateApiKey: async (apiKey: string) => {
    const provider = new EternalAIImageProvider();
    return provider.validateApiKey(apiKey);
  },

  getImageProviderConstraints: () => ({
    maxPromptBytes: 4000,
    promptConstraintWarning:
      'Prompts are limited to 4000 bytes for best results',
    maxImagesPerRequest: 1,
    supportedSizes: ['1024x1024', '512x512', '768x768'],
    supportedStyles: [
      'impressionist',
      'painterly',
      'anime',
      'mechanical',
      'random',
    ],
  }),

  renderIcon: (props) => EternalAIIcon(props),
};

export default plugin;
