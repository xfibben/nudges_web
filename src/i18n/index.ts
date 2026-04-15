import en from './en.json';
import es from './es.json';

export const languages = {
  en: 'English',
  es: 'Español',
};

export const defaultLang = 'en';

const translations = { en, es };

type Lang = keyof typeof translations;
type Translations = typeof en;

type DotPaths<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? DotPaths<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

type TranslationKey = DotPaths<Translations>;

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[lang] ?? translations[defaultLang];
    for (const k of keys) {
      value = value?.[k];
    }
    if (value === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let fallback: any = translations[defaultLang];
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      return fallback ?? key;
    }
    return value;
  };
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Lang;
  return defaultLang;
}

export function getLocalizedPath(path: string, lang: Lang): string {
  if (lang === defaultLang) return path;
  return `/${lang}${path}`;
}
