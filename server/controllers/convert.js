'use strict';

module.exports = {
  async bulkConvert(ctx) {
    try {
      const result = await strapi.plugin('imgfmtconv').service('converter').bulkConvert();
      ctx.body = { message: `Bulk conversion complete: ${result.converted} of ${result.total} files`, ...result };
      strapi.log.info(`[imgfmtconv] Bulk conversion: ${result.converted} of ${result.total} files converted`);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}; 