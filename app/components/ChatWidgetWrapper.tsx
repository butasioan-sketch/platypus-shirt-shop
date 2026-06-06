'use client';

import { useLocale } from './LocaleProvider';
import ChatWidget from './ChatWidget';

export default function ChatWidgetWrapper() {
  const { locale } = useLocale();
  return <ChatWidget locale={locale} />;
}
