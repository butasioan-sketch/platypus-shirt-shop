import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from './components/LocaleProvider';
import ChatWidgetWrapper from './components/ChatWidgetWrapper';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'PLATYPUS — Premium Print-on-Demand T-Shirts',
  description: 'Gestalte dein eigenes Shirt — Motiv vorne & hinten hochladen. Sichere Zahlung. Produktion auf Bestellung. Versand in DE & RO.',
  keywords: 'platypus, t-shirt, print on demand, custom shirt, eigenes design, motiv hochladen, tricouri, romania',
  icons: {
    icon: '/icon.jpeg',
    apple: '/apple-icon.jpeg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'PLATYPUS — Premium T-Shirts',
    description: 'Gestalte dein eigenes Shirt. Lade dein Motiv hoch. Sichere Zahlung.',
    type: 'website',
    url: 'https://platypus-shirt-shop.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a', color: '#fff' }}>
        <LocaleProvider>
          {children}
          <ChatWidgetWrapper />
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
