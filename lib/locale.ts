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

export const SHIPPING_COSTS: Record<Locale, { price: number; days: string }> = {
  de: { price: 4.99, days: '3–5 Werktage' },
  ro: { price: 6.99, days: '5–7 zile' },
  en: { price: 8.99, days: '5–10 days' },
};
