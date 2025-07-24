'use strict';

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

function walkDir(dir, extList, files = []) {
  if (!fs.existsSync(dir)) return files;
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, extList, files);
    } else {
      const ext = path.extname(file).replace('.', '').toLowerCase();
      if (extList.includes(ext)) files.push(filePath);
    }
  });
  return files;
}

module.exports = {
  async convertImage(filePath, options) {
    const { qualityWebp = 80, qualityAvif = 50, convertTo = ['webp', 'avif'] } = options || {};
    const results = {};
    if (!fs.existsSync(filePath)) return results;
    const buffer = fs.readFileSync(filePath);
    const base = filePath.replace(/\.[^.]+$/, '');
    if (convertTo.includes('webp')) {
      const webpPath = base + '.webp';
      await sharp(buffer).webp({ quality: qualityWebp }).toFile(webpPath);
      results.webp = webpPath;
    }
    if (convertTo.includes('avif')) {
      const avifPath = base + '.avif';
      await sharp(buffer).avif({ quality: qualityAvif }).toFile(avifPath);
      results.avif = avifPath;
    }
    return results;
  },
  async bulkConvert(options) {
    const settings = require('../utils/settings-store').getSettings();
    const strapi = global.strapi;
    const publicDir = strapi ? strapi.dirs.static.public : path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'uploads');
    const extList = settings.formatsToConvert || ['jpeg', 'png', 'jpg', 'gif'];
    const files = walkDir(uploadDir, extList);
    let converted = 0;
    const sharpLib = require('sharp');
    const fs = require('fs');
    for (const file of files) {
      const result = await this.convertImage(file, settings);
      // Найти upload-file по url
      const relUrl = file.replace(publicDir, '').replace(/\\/g, '/');
      const fileEntry = await strapi.db.query('plugin::upload.file').findOne({ where: { url: relUrl } });
      if (fileEntry) {
        const newFormats = {};
        if (result.webp && fs.existsSync(result.webp)) {
          const meta = await sharpLib(result.webp).metadata();
          const stat = fs.statSync(result.webp);
          newFormats.webp = {
            ext: '.webp', mime: 'image/webp', url: fileEntry.url.replace(/\.[^.]+$/, '.webp'),
            width: meta.width, height: meta.height, size: +(stat.size / 1024).toFixed(2), sizeInBytes: stat.size,
          };
        }
        if (result.avif && fs.existsSync(result.avif)) {
          const meta = await sharpLib(result.avif).metadata();
          const stat = fs.statSync(result.avif);
          newFormats.avif = {
            ext: '.avif', mime: 'image/avif', url: fileEntry.url.replace(/\.[^.]+$/, '.avif'),
            width: meta.width, height: meta.height, size: +(stat.size / 1024).toFixed(2), sizeInBytes: stat.size,
          };
        }
        if (Object.keys(newFormats).length) {
          await strapi.entityService.update('plugin::upload.file', fileEntry.id, {
            data: { formats: { ...fileEntry.formats, ...newFormats } }
          });
        }
      }
      converted++;
    }
    return { success: true, converted, total: files.length };
  },
}; 