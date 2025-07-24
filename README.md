# Strapi Image Format Converter Plugin

[![npm version](https://badge.fury.io/js/strapi-plugin-imgfmtconv.svg)](https://badge.fury.io/js/strapi-plugin-imgfmtconv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Strapi](https://img.shields.io/badge/Strapi-5.0.0+-blue.svg)](https://strapi.io/)

A powerful Strapi plugin for automatic image format conversion to modern formats like WebP and AVIF. Optimize your images for better performance and smaller file sizes.

## Features

- 🚀 **Automatic conversion** on file upload
- 📦 **Bulk conversion** of existing files
- 🎛️ **Quality control** for WebP and AVIF formats
- 🔧 **Flexible format selection** (JPEG, PNG, GIF → WebP, AVIF)
- 💾 **Persistent settings** (saved between restarts)
- 🗑️ **Automatic cleanup** when original files are deleted
- 📱 **Admin panel integration** with user-friendly interface
- ⚡ **Performance optimized** with Sharp library

## Installation

```bash
npm install strapi-plugin-imgfmtconv
```

Or install from GitHub:

```bash
npm install github:A-mi13/imgfmtconv
```

## Configuration

The plugin settings are stored in `config/settings.json` and automatically loaded when Strapi starts.

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable the plugin |
| `autoConvert` | boolean | `true` | Auto-convert on file upload |
| `qualityWebp` | number | `80` | WebP quality (0-100) |
| `qualityAvif` | number | `70` | AVIF quality (0-100) |
| `formatsToConvert` | array | `['jpeg', 'png', 'jpg', 'gif']` | Source formats to convert |
| `convertTo` | array | `['webp', 'avif']` | Target formats |

### Example Configuration

```json
{
  "enabled": true,
  "autoConvert": true,
  "qualityWebp": 85,
  "qualityAvif": 75,
  "formatsToConvert": ["jpeg", "png", "jpg"],
  "convertTo": ["webp", "avif"]
}
```

## Usage

### Admin Panel

1. Navigate to **Content Manager** → **Image Format Converter** in your Strapi admin panel
2. Configure your settings
3. Use the bulk conversion feature to convert existing images

### API Endpoints

#### Get Settings
```http
GET /api/imgfmtconv/settings
```

#### Update Settings
```http
PUT /api/imgfmtconv/settings
Content-Type: application/json

{
  "enabled": true,
  "autoConvert": true,
  "qualityWebp": 85,
  "qualityAvif": 75,
  "formatsToConvert": ["jpeg", "png"],
  "convertTo": ["webp"]
}
```

#### Reset to Defaults
```http
POST /api/imgfmtconv/settings/reset
```

#### Reload Settings from File
```http
POST /api/imgfmtconv/settings/reload
```

#### Bulk Convert Existing Images
```http
POST /api/imgfmtconv/bulk-convert
```

## How It Works

1. **Upload Detection**: When a file is uploaded to Strapi, the plugin checks if it matches the configured source formats
2. **Conversion**: Using Sharp library, the image is converted to the specified target formats
3. **Storage**: Converted files are saved alongside the original with appropriate extensions
4. **Cleanup**: When the original file is deleted, converted versions are automatically removed

## Performance Benefits

- **WebP**: 25-35% smaller than JPEG at equivalent quality
- **AVIF**: 50% smaller than JPEG at equivalent quality
- **Automatic format selection**: Modern browsers automatically choose the best format
- **Fallback support**: Original formats are preserved for older browsers

## Browser Support

| Format | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| WebP | 23+ | 65+ | 14+ | 18+ |
| AVIF | 85+ | 93+ | 16.4+ | 85+ |

## Requirements

- Node.js >= 18.0.0
- Strapi >= 5.0.0
- Sharp library (automatically installed)

## Development

```bash
# Clone the repository
git clone https://github.com/A-mi13/imgfmtconv.git

# Install dependencies
npm install

# Link to your Strapi project
npm link
cd /path/to/your/strapi/project
npm link strapi-plugin-imgfmtconv
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Report a bug](https://github.com/A-mi13/imgfmtconv/issues)
- 💡 [Request a feature](https://github.com/A-mi13/imgfmtconv/issues)
- 📧 Contact: [GitHub Issues](https://github.com/A-mi13/imgfmtconv/issues)

## Changelog

### v1.0.0
- Initial release
- WebP and AVIF conversion support
- Admin panel integration
- Bulk conversion feature
- Persistent settings 