# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install          # Install dependencies (uses legacy-peer-deps)
npm run build        # Bundle with esbuild to dist/index.js (React externalized)
```

No test or lint commands are configured.

## Architecture

This is a Quilltap plugin that integrates Eternal AI's image generation service. The plugin implements the `LLMProviderPlugin` interface from `@quilltap/plugin-types`.

### Key Files

- **index.ts** - Plugin entry point exporting metadata, configuration, capabilities, and factory methods
- **image-provider.ts** - `EternalAIImageProvider` class implementing async image generation with polling
- **icon.tsx** - React SVG icon component
- **types.ts** - Re-exports from Quilltap packages

### Image Generation Flow

1. `generateImage()` submits a POST request to `https://open.eternalai.org/creative-ai/image`
2. Eternal AI returns a task ID for async processing
3. Plugin polls `https://open.eternalai.org/creative-ai/result/image` every 2 seconds
4. Maximum polling duration: 10 minutes (300 attempts)
5. Returns image URL when status is "done"

### Style System

The plugin maps style names to Eternal AI LoRA (Low-Rank Adaptation) identifiers in `normalizeStyle()`. Supported styles: impressionist, painterly, anime, mechanical, random.

### Plugin Capabilities

- Image generation only (no chat, embeddings, or web search)
- Constraints: 4000-byte prompt limit, 1 image per request, 3 sizes (1024x1024, 1024x768, 768x1024)
- Available models: `black-forest-labs/FLUX.1-dev`, `black-forest-labs/FLUX.1-schnell`

### API Authentication

Uses `x-api-key` header for all Eternal AI API calls.
