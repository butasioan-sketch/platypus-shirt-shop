import type { Metadata } from 'next';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};
import './globals.css';
import { LocaleProvider } from './components/LocaleProvider';
import ChatWidgetWrapper from './components/ChatWidgetWrapper';
import RegisterSW from './components/RegisterSW';
import Footer from './components/Footer';
import Analytics from './components/Analytics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'On Me — Custom Sublimation T-Shirts | DIN A4',
  description: 'B&C TM062 Polyester-Shirt mit deinem Motiv — vorne & hinten auf DIN A4. Sublimationsdruck in der Faser. Versand DE & RO.',
  keywords: 'platypus, t-shirt, print on demand, custom shirt, eigenes design, motiv hochladen, tricouri, romania',
  icons: {
    icon: [{ url: '/icon-192.png', sizes: '192x192' }, { url: '/icon-512.png', sizes: '512x512' }],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'PLATYPUS' },
  manifest: '/manifest.json',
  openGraph: {
    title: 'On Me — Dein Motiv auf Premium Polyester',
    description: 'Sublimationsdruck DIN A4 — vorne & hinten. B&C TM062, 39,99 €.',
    type: 'website',
    url: siteUrl,
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a', color: '#fff' }}>
        <LocaleProvider>
          <Analytics />
          {children}
          <RegisterSW />
          <ChatWidgetWrapper />
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
