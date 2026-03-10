# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-03-10

### Added
- `getImageGenerationModels()` for rich model metadata via `ImageGenerationModelInfo`
- LoRA styles exposed as model variants (e.g., `black-forest-labs/FLUX.1-dev/impressionist`)
- 12 total model variants: 2 base models x (1 unstyled + 5 LoRA styles)
- `result_image` fallback field in poll response handling
- `accept: application/json` header on generation requests

### Changed
- Style selection now driven by model ID parsing (`parseModelId()`) instead of `params.style`
- Style definitions centralized in `STYLES` constant (single source of truth)
- Poll response types updated to match API docs (`success`, `error` statuses; additional fields)
- `supportedSizes` corrected to `1024x1024`, `1024x768`, `768x1024`
- Removed `supportedStyles` (not in `ImageProviderConstraints` interface)
- Updated peer dependencies to `@quilltap/plugin-types` ^1.16.0 and `@quilltap/plugin-utils` ^1.4.0

## [1.0.0] - 2026-01-22

- Initial release
- Text-to-image generation support
- Style control with LoRA configurations
- Async generation with polling
- API key validation
- Comprehensive error handling
