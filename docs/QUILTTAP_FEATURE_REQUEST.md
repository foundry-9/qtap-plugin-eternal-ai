# Feature Request: Image Provider Prompting Guidance

## Summary

Extend `ImageProviderConstraints` interface to allow image generation plugins to provide prompting guidance that Quilttap can use when an LLM is generating image prompts.

## Problem

Different image generation providers have different optimal prompting strategies:
- Some providers work better with specific prompt structures
- LoRA/style systems require trigger phrases in the prompt
- Providers may have unique capabilities or limitations

Currently, there's no way for a plugin to communicate this knowledge to Quilttap's chat LLM when it's crafting image prompts.

## Proposed Solution

Extend the `ImageProviderConstraints` interface in `@quilttap/plugin-types`:

```typescript
interface ImageProviderConstraints {
  // Existing fields
  maxPromptBytes?: number;
  promptConstraintWarning?: string;
  maxImagesPerRequest?: number;
  supportedAspectRatios?: string[];
  supportedSizes?: string[];

  // NEW: Prompting guidance for LLMs
  /**
   * Prompting guidance text that should be provided to the chat LLM
   * when it's generating image prompts for this provider.
   * This can include structure recommendations, best practices,
   * and provider-specific tips.
   */
  promptingGuidance?: string;

  // NEW: Style/LoRA information
  /**
   * Detailed information about available styles/LoRAs.
   * Keys are the style identifiers (matching supportedStyles).
   */
  styleInfo?: Record<string, {
    /** Human-readable name */
    name: string;
    /** Internal LoRA/style identifier used in API calls */
    loraId: string;
    /** Description for UI and LLM context */
    description: string;
    /** Trigger phrase to include in prompt when this style is active */
    triggerPhrase?: string | null;
  }>;
}
```

## Implementation in Quilttap

When Quilttap's chat LLM is generating an image prompt:

1. Get the active image provider's constraints via `getImageProviderConstraints()`
2. If `promptingGuidance` is present, include it in the system prompt or context
3. If a style is selected and `styleInfo[style].triggerPhrase` exists, instruct the LLM to incorporate it

Example system prompt addition:
```
When creating image prompts for Eternal AI, follow these guidelines:
[promptingGuidance content here]

The user has selected the "painterly" style. Include "DB4RZ Daubrez style painting of" in your prompt.
```

## Benefits

1. **Provider-specific optimization**: Each image provider can teach the LLM its optimal prompting patterns
2. **Style trigger automation**: When users select a style, the LLM automatically uses the correct trigger phrases
3. **Better results**: Users get higher quality images without needing to learn each provider's quirks
4. **Extensible**: New providers can add their own guidance without Quilttap core changes

## Reference Implementation

The `qtap-plugin-eternal-ai` plugin already implements these fields. See:
- `index.ts`: `getImageProviderConstraints()` returns `promptingGuidance` and `styleInfo`
- `image-provider.ts`: `normalizeStyle()` maps style names to LoRA identifiers

## Migration

This is a backward-compatible addition. Existing plugins continue to work; they simply won't provide prompting guidance.
