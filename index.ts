import type { LLMProviderPlugin } from './types';
import { EternalAIImageProvider } from './image-provider';

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

    // Extended fields for prompting guidance (proposed extension to ImageProviderConstraints)
    promptingGuidance: `# Eternal AI Image Prompting Guide

## Core Structure
Use: Subject + Action + Style + Context

Example: "Golden retriever running along beach shore, nature photography, early morning sunlight"

## Element Priority
Place highest-priority elements first. Recommended sequence:
Primary subject → Main activity → Defining style → Core context → Supporting details

## Prompt Lengths
- Brief (10-30 words): Fast iterations and style testing
- Standard (30-80 words): Optimal for most creative work
- Detailed (80+ words): Intricate scenes with specific requirements

## Available Styles (LoRAs)
When a style is selected, include its trigger phrase in the prompt:

- **impressionist**: Classic impressionist painting style
- **painterly**: Include "DB4RZ Daubrez style" in prompt for Daubrez painterly aesthetic
- **anime**: Include "Psycho_4rt" in prompt for anime/glitch art style
- **mechanical**: Include "CynthiaPortrait:" prefix for mechanical floral/cyberpunk portraits
- **random**: Artistify style for surreal dreamlike elements

## Approach by Focus Type

### Character-Centric
Character description → Activity → Style → Setting
Example: "Young scientist with curly red hair, examining laboratory samples, realistic digital painting, modern research facility"

### Environment-Centric
Location → Conditions → Style → Details
Example: "Japanese mountain monastery in winter, heavy snowfall with fog, traditional ink wash painting style"

### Photography-Centric
Subject → Setting → Lighting → Camera specs
Example: "Fashion model in evening gown, minimal backdrop, soft key light with rim lighting, 50mm lens, f/2.0"

## Best Practices
- Use positive descriptions (say what you want, not what to avoid)
- Replace "no rain" with "clear sunny sky"
- Replace "not smiling" with "calm, thoughtful expression"
- Include lighting, color, and mood details for better results`,

    styleInfo: {
      impressionist: {
        name: 'Impressionist',
        loraId: 'Art_style_Impressionist',
        description: 'Classic impressionist painting style with visible brushstrokes and light effects',
        triggerPhrase: null,
      },
      painterly: {
        name: 'Daubrez Painterly',
        loraId: 'FLUX-daubrez-DB4RZ',
        description: 'Abstract art masterpiece style with rich painterly textures',
        triggerPhrase: 'DB4RZ Daubrez style painting of',
      },
      anime: {
        name: 'Psycho Art Anime',
        loraId: 'psycho_art',
        description: 'Anime style with glitching abstract surreal brushstrokes',
        triggerPhrase: 'Psycho_4rt anime',
      },
      mechanical: {
        name: 'Mechanical Bloom',
        loraId: 'Flux_1_MechanicalBloom',
        description: 'Surreal anime-style portraits with mechanical floral implants in cyberpunk settings',
        triggerPhrase: 'CynthiaPortrait:',
      },
      random: {
        name: 'RandomMaxx Artistify',
        loraId: 'RM_Artistify_v1_0M',
        description: 'Surreal dreamlike artistic elements with flowing, ethereal qualities',
        triggerPhrase: null,
      },
    },
  }),

  icon: {
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eternal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#eternal-gradient)" />
      <g fill="white">
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="6" r="1.2" />
        <circle cx="12" cy="18" r="1.2" />
        <circle cx="6" cy="12" r="1.2" />
        <circle cx="18" cy="12" r="1.2" />
        <circle cx="8" cy="8" r="0.8" />
        <circle cx="16" cy="16" r="0.8" />
        <circle cx="16" cy="8" r="0.8" />
        <circle cx="8" cy="16" r="0.8" />
      </g>
      <g stroke="white" stroke-width="0.5" stroke-opacity="0.6" fill="none">
        <line x1="12" y1="12" x2="12" y2="6" />
        <line x1="12" y1="12" x2="12" y2="18" />
        <line x1="12" y1="12" x2="6" y2="12" />
        <line x1="12" y1="12" x2="18" y2="12" />
      </g>
    </svg>`,
  },
};

export default plugin;
