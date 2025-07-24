'use strict';

const settingsStore = require('../utils/settings-store');

module.exports = {
  async getSettings(ctx) {
    try {
      const settings = settingsStore.getSettings();
      ctx.body = { data: settings };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async updateSettings(ctx) {
    try {
      const { body } = ctx.request;
      const updatedSettings = settingsStore.updateSettings(body);
      ctx.body = {
        data: updatedSettings,
        message: 'Настройки обновлены успешно',
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async resetSettings(ctx) {
    try {
      const resetSettings = settingsStore.resetSettings();
      ctx.body = {
        data: resetSettings,
        message: 'Настройки сброшены к значениям по умолчанию',
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async reloadSettings(ctx) {
    try {
      const reloadedSettings = settingsStore.reloadSettings();
      ctx.body = {
        data: reloadedSettings,
        message: 'Настройки перезагружены из файла',
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}; 