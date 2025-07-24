'use strict';

const settingsStore = require('../utils/settings-store');

module.exports = {
  getSettings() {
    return settingsStore.getSettings();
  },
  
  updateSettings(newSettings) {
    return settingsStore.updateSettings(newSettings);
  },
  
  resetSettings() {
    return settingsStore.resetSettings();
  },
  
  reloadSettings() {
    return settingsStore.reloadSettings();
  },
}; 