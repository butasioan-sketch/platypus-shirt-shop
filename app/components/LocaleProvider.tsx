'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, getTranslation } from '@/lib/i18n';
import { detectLocale, setLocale as persistLocale } from '@/lib/locale';

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: ReturnType<typeof getTranslation>;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    persistLocale(l);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: getTranslation(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) return { locale: 'de' as Locale, setLocale: () => {}, t: getTranslation('de') };
  return ctx;
}
