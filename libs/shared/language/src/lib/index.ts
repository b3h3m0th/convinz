import { default as i18next } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, de } from './sets';

export enum Language {
  en = 'en',
  de = 'de',
}

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: localStorage.getItem('settingsStore') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const i18n = i18next;
