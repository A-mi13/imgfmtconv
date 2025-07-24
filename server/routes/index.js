'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/settings',
    handler: 'settings.getSettings',
    config: { auth: false },
  },
  {
    method: 'PUT',
    path: '/settings',
    handler: 'settings.updateSettings',
    config: { auth: false },
  },
  {
    method: 'POST',
    path: '/settings/reset',
    handler: 'settings.resetSettings',
    config: { auth: false },
  },
  {
    method: 'POST',
    path: '/settings/reload',
    handler: 'settings.reloadSettings',
    config: { auth: false },
  },
  {
    method: 'POST',
    path: '/bulk-convert',
    handler: 'convert.bulkConvert',
    config: { auth: false },
  },
]; 