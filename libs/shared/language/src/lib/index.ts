import { default as i18next } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, de } from './sets';

export type Language = 'en' | 'de';

const settingsStore = localStorage.getItem('settingsStore');
console.log(settingsStore);

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: settingsStore,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const i18n = i18next;
