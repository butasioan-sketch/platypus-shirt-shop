'use client';

import { useLocale } from '@/app/components/LocaleProvider';
import HomeView from './HomeView';

export default function HomeLocaleGate({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  if (locale === 'de') return <>{children}</>;
  return <HomeView locale={locale} />;
}