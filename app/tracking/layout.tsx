import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sendungsverfolgung | PLATYPUS',
  description: 'Verfolge deine PLATYPUS-Bestellung — Gib deine Bestellnummer ein und sieh den aktuellen Status.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
