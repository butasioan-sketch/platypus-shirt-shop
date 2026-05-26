import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PLATYPUS',
  description: 'Premium Print-on-Demand',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-zinc-950 text-white">
        <nav className="border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-widest text-xl">PLATYPUS</Link>
            <div className="flex items-center gap-8 text-sm">
              <Link href="/product/1" className="hover:text-zinc-400 transition">Shop</Link>
              <Link href="/cart" className="hover:text-zinc-400 transition flex items-center gap-1">
                Warenkorb
                <span className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded">0</span>
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
