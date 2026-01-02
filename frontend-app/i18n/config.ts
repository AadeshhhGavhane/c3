import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

const LANGUAGE_KEY = '@c3_app_language';

// Get saved language or device language
const getInitialLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      return savedLanguage;
    }
    // Get device language
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    // Map device language to our supported languages
    if (deviceLanguage === 'hi' || deviceLanguage === 'mr') {
      return deviceLanguage;
    }
    return 'en';
  } catch (error) {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
    },
    lng: 'en', // Will be updated after async check
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Set initial language
getInitialLanguage().then((lang) => {
  i18n.changeLanguage(lang);
});

// Function to change language and save preference
export const changeLanguage = async (language: 'en' | 'hi' | 'mr') => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export default i18n;

