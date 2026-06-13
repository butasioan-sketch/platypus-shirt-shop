import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from './components/LocaleProvider';
import ChatWidgetWrapper from './components/ChatWidgetWrapper';

export const metadata: Metadata = {
  title: 'PLATYPUS — Premium Print-on-Demand T-Shirts',
  description: 'Dein eigenes Shirt. 360° Viewer. Stripe Checkout. Produktion auf Bestellung. Versand in DE & RO.',
  keywords: 'platypus, t-shirt, print on demand, custom shirt, 360 viewer, tricouri, romania',
  icons: {
    icon: '/icon.jpeg',
    apple: '/apple-icon.jpeg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'PLATYPUS — Premium T-Shirts',
    description: 'Dein Shirt. Cinematic 360° Viewer. Stripe Checkout.',
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
        </LocaleProvider>
      </body>
    </html>
  );
}
