import { Locale } from './i18n';

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'de';

  const saved = localStorage.getItem('platypus_locale') as Locale;
  if (saved && ['de', 'ro', 'en'].includes(saved)) return saved;

  const browser = navigator.language.toLowerCase();
  if (browser.startsWith('ro')) return 'ro';
  if (browser.startsWith('en')) return 'en';
  return 'de';
}

export function setLocale(locale: Locale) {
  localStorage.setItem('platypus_locale', locale);
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  de: '🇩🇪',
  ro: '🇷🇴',
  en: '🇬🇧',
};

export const LOCALE_LABELS: Record<Locale, string> = {
  de: 'Deutsch',
  ro: 'Română',
  en: 'English',
};

// SHIPPING_COSTS entfernt — einzige Wahrheit ist lib/shipping.ts
