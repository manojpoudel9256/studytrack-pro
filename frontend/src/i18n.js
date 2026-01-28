import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import ja from './locales/ja/translation.json';

i18n
    // .use(LanguageDetector) // Temporarily disabled
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ja: { translation: ja }
        },
        lng: localStorage.getItem('i18nextLng') || 'en', // Manual load
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
