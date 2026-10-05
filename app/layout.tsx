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
import CookieBanner from './components/CookieBanner';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ON ME – Personalisierte Textilien | PLATYPUS',
  description: 'ON ME – Personalisierte Textilien im PLATYPUS-Webshop. Gestalte dein individuelles T-Shirt oder Shorts mit eigenem Bild auf AirFit Performance Fabric.',
  keywords: 'on me, personalisierte textilien, platypus, custom shirt, eigenes design, t-shirt bedrucken, shorts bedrucken, sublimation',
  icons: {
    icon: [{ url: '/icon-192.png', sizes: '192x192' }, { url: '/icon-512.png', sizes: '512x512' }],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'ON ME | PLATYPUS' },
  manifest: '/manifest.json',
  openGraph: {
    title: 'ON ME – Personalisierte Textilien | PLATYPUS',
    description: 'Gestalte dein individuelles T-Shirt oder Shorts im PLATYPUS-Webshop. Dein Motiv auf AirFit Performance Fabric.',
    type: 'website',
    url: siteUrl,
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'PLATYPUS',
      url: siteUrl,
      logo: `${siteUrl}/logo.jpeg`,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'ON ME – Personalisierte Textilien | PLATYPUS',
      publisher: { '@id': `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://api.resend.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a', color: '#fff' }}>
        <a href="#main-content" className="skip-to-content">Zum Inhalt springen</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <LocaleProvider>
          <Analytics />
          {children}
          <RegisterSW />
          <ChatWidgetWrapper />
          <CookieBanner />
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
