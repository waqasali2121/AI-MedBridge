import en from './en.json';
import ur from './ur.json';

const translations: Record<string, any> = { en, ur };

export function t(key: string, lang: 'en' | 'ur' = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  for (const k of keys) {
    value = value?.[k];
  }
  return typeof value === 'string' ? value : key;
}

export { en, ur };
