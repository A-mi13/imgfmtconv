# Publishing Guide

This guide will help you publish the Strapi Image Format Converter plugin to GitHub and npm.

## Prerequisites

1. **GitHub Account**: Make sure you have access to https://github.com/A-mi13/imgfmtconv
2. **npm Account**: Create an account at https://www.npmjs.com/
3. **Node.js**: Version 18.0.0 or higher
4. **Git**: Latest version

## Step 1: Prepare GitHub Repository

### Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Strapi Image Format Converter Plugin"
```

### Add Remote Repository
```bash
git remote add origin https://github.com/A-mi13/imgfmtconv.git
git branch -M main
git push -u origin main
```

### Create GitHub Release
1. Go to https://github.com/A-mi13/imgfmtconv
2. Click on "Releases" in the right sidebar
3. Click "Create a new release"
4. Tag version: `v1.0.0`
5. Release title: `v1.0.0 - Initial Release`
6. Description:
```
## 🎉 Initial Release

### Features
- WebP and AVIF image conversion
- Automatic conversion on upload
- Bulk conversion of existing files
- Quality control for both formats
- Admin panel integration
- Persistent settings
- Automatic cleanup

### Installation
```bash
npm install strapi-plugin-imgfmtconv
```

### Requirements
- Node.js >= 18.0.0
- Strapi >= 5.0.0
```

## Step 2: Publish to npm

### Login to npm
```bash
npm login
```

### Check Package
```bash
npm pack
```
This will create a `.tgz` file. Check its contents to ensure all necessary files are included.

### Publish
```bash
npm publish
```

### Verify Publication
1. Check https://www.npmjs.com/package/strapi-plugin-imgfmtconv
2. Verify all files are included
3. Test installation: `npm install strapi-plugin-imgfmtconv`

## Step 3: Update Documentation

### Update README.md
- Add installation instructions
- Add usage examples
- Add troubleshooting section if needed

### Add Badges (Optional)
Add these badges to your README.md:

```markdown
[![npm version](https://badge.fury.io/js/strapi-plugin-imgfmtconv.svg)](https://badge.fury.io/js/strapi-plugin-imgfmtconv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Strapi](https://img.shields.io/badge/Strapi-5.0.0+-blue.svg)](https://strapi.io/)
```

## Step 4: Maintenance

### Version Updates
When updating the plugin:

1. Update version in `package.json`
2. Update changelog in README.md
3. Create new GitHub release
4. Publish to npm: `npm publish`

### Example Version Update
```bash
# Update version
npm version patch  # or minor/major

# Commit changes
git add .
git commit -m "Bump version to 1.0.1"

# Push to GitHub
git push origin main
git push --tags

# Publish to npm
npm publish
```

## Troubleshooting

### npm Login Issues
```bash
npm whoami  # Check if logged in
npm logout  # Logout and try again
npm login   # Login again
```

### Package Name Conflicts
If the package name is taken, consider:
- `@your-username/strapi-plugin-imgfmtconv`
- `strapi-plugin-image-format-converter`
- `strapi-imgfmtconv`

### Publishing Errors
- Check if you're logged in: `npm whoami`
- Verify package.json is valid: `npm pack`
- Check for existing version: `npm view strapi-plugin-imgfmtconv`

## Best Practices

1. **Semantic Versioning**: Use semantic versioning (MAJOR.MINOR.PATCH)
2. **Changelog**: Keep a detailed changelog
3. **Testing**: Test the plugin before publishing
4. **Documentation**: Keep documentation up to date
5. **Issues**: Monitor and respond to GitHub issues

## Useful Commands

```bash
# Check package contents
npm pack --dry-run

# View package info
npm view strapi-plugin-imgfmtconv

# Unpublish (within 72 hours)
npm unpublish strapi-plugin-imgfmtconv@1.0.0

# Update npm
npm install -g npm@latest
```

## Configuration

- The plugin includes a default `config/settings.json` file in the repository.
- You can edit this file before publishing or after installation to set your preferred options.
- This file is not ignored by git and will be available after cloning the repository. 