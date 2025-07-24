'use strict';

const fs = require('fs');
const path = require('path');

// Путь к файлу настроек
const settingsPath = path.join(__dirname, '../../../config/settings.json');

// Дефолтные настройки
const defaultSettings = {
  enabled: true,
  autoConvert: true,
  qualityWebp: 80,
  qualityAvif: 50,
  formatsToConvert: ['jpeg', 'png'],
  convertTo: ['webp', 'avif'],
};

// Функция для чтения настроек из файла
function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      const loadedSettings = JSON.parse(data);
      // Объединяем с дефолтными настройками для совместимости
      return { ...defaultSettings, ...loadedSettings };
    }
  } catch (error) {
    console.warn('Ошибка чтения настроек imgfmtconv:', error.message);
  }
  return defaultSettings;
}

// Функция для сохранения настроек в файл
function saveSettings(settings) {
  try {
    // Создаем директорию если её нет
    const configDir = path.dirname(settingsPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Ошибка сохранения настроек imgfmtconv:', error.message);
    return false;
  }
}

// Загружаем настройки при инициализации
let settings = loadSettings();

module.exports = {
  getSettings() {
    return settings;
  },
  
  updateSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    
    // Сохраняем в файл
    const saved = saveSettings(settings);
    if (!saved) {
      console.warn('Не удалось сохранить настройки imgfmtconv в файл');
    }
    
    return settings;
  },
  
  // Метод для принудительной перезагрузки настроек
  reloadSettings() {
    settings = loadSettings();
    return settings;
  },
  
  // Метод для сброса к дефолтным настройкам
  resetSettings() {
    settings = { ...defaultSettings };
    saveSettings(settings);
    return settings;
  }
}; 