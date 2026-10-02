import { useSettingsStore } from '@/store/settingsStore';
import { t as translate } from '@/i18n';

export function useLanguage() {
  const language = useSettingsStore((state) => state.language);
  const isRTL = useSettingsStore((state) => state.isRTL);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const t = (key: string) => translate(key, language);

  const toggleLanguage = async () => {
    await setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return { language, isRTL, setLanguage, toggleLanguage, t };
}
