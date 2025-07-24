'use strict';

export default {
  register(app) {
    console.log('[imgfmtconv] Admin register start');
    app.addMenuLink({
      to: '/plugins/imgfmtconv',
      icon: () => '🖼️',
      intlLabel: {
        id: 'imgfmtconv.plugin.name',
        defaultMessage: 'Image Format Converter',
      },
      permissions: [],
      async Component() {
        console.log('[imgfmtconv] Admin dynamic import SettingsPage');
        const { default: SettingsPage } = await import('./admin-page.jsx');
        return SettingsPage;
      },
    });
    console.log('[imgfmtconv] Admin register end');
  },
  bootstrap(app) {
    console.log('[imgfmtconv] Admin panel bootstrap');
  },
}; 