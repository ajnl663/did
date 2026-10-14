import en from './translations/en.json';

type TranslationKeys = typeof en;

type NestedKeys<T> = {
  [K in keyof T]: T[K] extends object ? `${K & string}.${NestedKeys<T[K]>}` : K & string;
}[keyof T];

type TranslationKey = NestedKeys<TranslationKeys>;

const translations: Record<string, TranslationKeys> = {
  en,
  hi: en,
  mr: en,
};

let currentLang: 'en' | 'hi' | 'mr' = 'en';

export function setLanguage(lang: 'en' | 'hi' | 'mr') {
  currentLang = lang;
}

export function getLanguage(): 'en' | 'hi' | 'mr' {
  return currentLang;
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations[currentLang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      value = translations.en;
      for (const k2 of keys) {
        if (value && typeof value === 'object' && k2 in value) {
          value = value[k2];
        } else {
          return key;
        }
      }
      break;
    }
  }

  if (typeof value !== 'string') return key;

  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
      return params[paramKey]?.toString() || `{{${paramKey}}}`;
    });
  }

  return value;
}

export function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  ] as const;
}