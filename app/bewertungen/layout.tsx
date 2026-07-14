import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kundenbewertungen | PLATYPUS',
  description: 'Echte Bewertungen von PLATYPUS-Kunden — Qualität, Druck, Passform, Versand. Teile auch deine Erfahrung.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
