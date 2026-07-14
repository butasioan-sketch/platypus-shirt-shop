import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | PLATYPUS',
  description: 'Häufige Fragen zu PLATYPUS — Versand, Produktion, Druckqualität, Größen, Widerrufsrecht und mehr.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
