import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { I18nManager } from 'react-native';

const LANGUAGE_KEY = 'medbridge_user_language';

interface SettingsState {
  language: 'en' | 'ur';
  isRTL: boolean;
  setLanguage: (lang: 'en' | 'ur') => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'en',
  isRTL: false,

  setLanguage: async (lang: 'en' | 'ur') => {
    const isRTL = lang === 'ur';
    set({ language: lang, isRTL });
    try {
      await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
      // Optional RTL update for layout if app reloads
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
      }
    } catch (e) {
      console.warn('Failed to save language preference', e);
    }
  },

  loadSettings: async () => {
    try {
      const savedLang = await SecureStore.getItemAsync(LANGUAGE_KEY);
      if (savedLang === 'en' || savedLang === 'ur') {
        const isRTL = savedLang === 'ur';
        set({ language: savedLang, isRTL });
      }
    } catch (e) {
      console.warn('Failed to load language preference', e);
    }
  },
}));
