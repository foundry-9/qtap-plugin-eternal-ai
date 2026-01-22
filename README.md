# Eternal AI Image Provider Plugin for Quilltap

A Quilltap plugin that integrates [Eternal AI](https://eternalai.org) for advanced text-to-image generation with character consistency and artistic style control.

## Features

- **Text-to-Image Generation**: Create images from detailed text prompts
- **Style Control**: Apply artistic styles like impressionist, anime, painterly, and more
- **Character Consistency**: Generate images with consistent character details across multiple requests
- **Negative Prompts**: Specify what should NOT appear in the generated image
- **Async Generation**: Efficient polling-based image generation with progress tracking
- **Multiple Models**: Access to FLUX models with varying speed/quality tradeoffs

## Installation

### For Quilltap Core Users

1. Copy this plugin into your Quilltap plugins directory:
   ```bash
   cp -r qtap-plugin-eternal-ai /path/to/quilltap/plugins/dist/
   ```

2. Restart Quilltap

3. The plugin will be automatically loaded

### For Standalone Use

1. Install dependencies:
   ```bash
   npm install @quilltap/plugin-types @quilltap/plugin-utils react
   ```

2. Build the plugin:
   ```bash
   npm run build
   ```

## Configuration

### Getting an API Key

1. Visit [Eternal AI](https://eternalai.org)
2. Create an account
3. Navigate to your API settings
4. Copy your API key

### Adding to Quilltap

1. Open Quilltap Settings
2. Go to **API Keys** section
3. Click **Add API Key**
4. Select **Eternal AI** from the provider dropdown
5. Paste your API key
6. Click **Verify** to validate the key

### Creating a Connection Profile

1. Go to Settings > **Connection Profiles**
2. Click **New Profile**
3. Select **Eternal AI** as the provider
4. Choose your API key from the dropdown
5. Select a model (typically `black-forest-labs/FLUX.1-dev`)
6. Click **Save**

## Usage

### Basic Image Generation

In Quilltap, use the image generation feature with your Eternal AI profile:

```
Prompt: A serene landscape with mountains and a lake at sunset
```

### With Style Control

Specify a style to apply artistic effects:

```
Prompt: A serene landscape with mountains and a lake at sunset
Style: impressionist
```

### With Negative Prompt

Exclude unwanted elements:

```
Prompt: A portrait of a person smiling in a park
Negative Prompt: blurry, distorted, low quality
```

## Supported Styles

- **impressionist** - Impressionist art style
- **painterly** - Painterly artistic effects
- **anime** - Anime/manga art style
- **mechanical** - Mechanical and industrial aesthetics
- **random** - RandomMaxx artistic transformations

## API Details

### Endpoint

```
POST https://open.eternalai.org/creative-ai/image
```

### Authentication

Add your API key in the `x-api-key` header.

### Response Time

- Typical generation: 45 seconds to 1 minute
- The plugin automatically polls for results
- Maximum wait time: 10 minutes before timeout

## Models

### FLUX.1-dev
- **Speed**: Standard (30-60 seconds)
- **Quality**: High
- **Use Case**: General purpose image generation
- **Characteristics**: Excellent detail, good prompt following

### FLUX.1-schnell
- **Speed**: Fast (15-30 seconds)
- **Quality**: Good
- **Use Case**: Quick iterations
- **Characteristics**: Faster generation, slightly less detail

## Limitations

- One image per request (not configurable per Eternal AI API)
- Maximum prompt length: 4000 bytes
- Generations are asynchronous (not real-time)
- No file attachment support
- Chat completions are not supported

## Troubleshooting

### "Invalid API key" error

- Verify your API key is correct in Quilltap settings
- Check that you've enabled the API key in your Eternal AI account
- Ensure the key hasn't expired

### Generation times out

- Eternal AI may be experiencing high load
- Try again in a few moments
- Large, complex prompts may take longer to generate

### Images look low quality

- Try with the `impressionist` or `painterly` style for artistic enhancement
- Make your prompt more detailed and specific
- Avoid conflicting style requests in your prompt

## Development

### Building from Source

```bash
npm install
npm run build
```

### Project Structure

```
├── manifest.json          # Plugin metadata
├── package.json          # NPM configuration
├── index.ts              # Main plugin entry point
├── image-provider.ts     # Image generation implementation
├── icon.tsx              # UI icon component
├── types.ts              # Type definitions
└── README.md             # This file
```

### Type Definitions

The plugin includes TypeScript support with full type definitions from `@quilltap/plugin-types`.

## References

- [Eternal AI Documentation](https://docs.eternalai.org)
- [Eternal AI API Reference](https://docs.eternalai.org/api)
- [Quilltap Plugin Development Guide](https://github.com/foundry-9/quilltap#plugins)

## License

MIT

## Support

- Report issues: [Quilltap GitHub Issues](https://github.com/foundry-9/quilltap/issues)
- Eternal AI Support: [Eternal AI Help](https://eternalai.org/support)

## Contributing

Contributions are welcome! Please ensure:

- TypeScript code passes type checking
- All API calls include proper error handling
- Documentation is updated for new features
- Commit messages are clear and descriptive

## Changelog

### 1.0.0

- Initial release
- Text-to-image generation support
- Style control with LoRA configurations
- Async generation with polling
- API key validation
- Comprehensive error handling
