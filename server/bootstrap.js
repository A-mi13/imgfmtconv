'use strict';

module.exports = async ({ strapi }) => {
  strapi.log.info('[imgfmtconv] Bootstrap started');
  try {
    strapi.log.info('[imgfmtconv] Strapi version: ' + (strapi.config?.info?.strapi || 'unknown'));
    strapi.log.info('[imgfmtconv] Registered plugins: ' + Object.keys(strapi.plugins || {}).join(', '));

    // Инициализация настроек при запуске
    const settingsService = strapi.plugin('imgfmtconv').service('settings');
    const initialSettings = settingsService.getSettings();
    strapi.log.info('[imgfmtconv] Settings loaded:', JSON.stringify(initialSettings, null, 2));

    // Подписка на lifecycle upload-файлов
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      async afterCreate(event) {
        const { result } = event;
        const settings = strapi.plugin('imgfmtconv').service('settings').getSettings();
        if (!settings.enabled || !settings.autoConvert) return;
        const ext = (result.ext || '').replace('.', '').toLowerCase();
        if (!settings.formatsToConvert.includes(ext)) return;
        const filePath = strapi.dirs.static.public + result.url;
        const converter = strapi.plugin('imgfmtconv').service('converter');
        const converted = await converter.convertImage(filePath, settings);
        const sharpLib = require('sharp');
        const fs = require('fs');
        const newFormats = {};
        if (converted.webp && fs.existsSync(converted.webp)) {
          const meta = await sharpLib(converted.webp).metadata();
          const stat = fs.statSync(converted.webp);
          newFormats.webp = {
            ext: '.webp',
            mime: 'image/webp',
            url: result.url.replace(/\.[^.]+$/, '.webp'),
            width: meta.width,
            height: meta.height,
            size: +(stat.size / 1024).toFixed(2),
            sizeInBytes: stat.size,
          };
        }
        if (converted.avif && fs.existsSync(converted.avif)) {
          const meta = await sharpLib(converted.avif).metadata();
          const stat = fs.statSync(converted.avif);
          newFormats.avif = {
            ext: '.avif',
            mime: 'image/avif',
            url: result.url.replace(/\.[^.]+$/, '.avif'),
            width: meta.width,
            height: meta.height,
            size: +(stat.size / 1024).toFixed(2),
            sizeInBytes: stat.size,
          };
        }
        if (Object.keys(newFormats).length) {
          await strapi.entityService.update('plugin::upload.file', result.id, {
            data: { formats: { ...result.formats, ...newFormats } }
          });
        }
        strapi.log.info(`[imgfmtconv] Converted file: ${filePath}`);
      },
      async afterDelete(event) {
        const { result } = event;
        const filePath = strapi.dirs.static.public + result.url;
        const base = filePath.replace(/\.[^.]+$/, '');
        const formats = ['webp', 'avif'];
        const fs = require('fs');
        for (const fmt of formats) {
          const altPath = base + '.' + fmt;
          try {
            if (fs.existsSync(altPath)) {
              fs.unlinkSync(altPath);
              strapi.log.info(`[imgfmtconv] Deleted: ${altPath}`);
            }
          } catch (e) {
            strapi.log.error(`[imgfmtconv] Error deleting ${altPath}: ${e.message}`);
          }
        }
      },
    });

    strapi.log.info('[imgfmtconv] Bootstrap finished successfully');
  } catch (e) {
    strapi.log.error('[imgfmtconv] Bootstrap error: ' + e.message);
    throw e;
  }
}; 