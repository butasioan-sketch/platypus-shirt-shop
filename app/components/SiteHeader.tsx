'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from './LocaleProvider';
import LocaleSwitcher from './LocaleSwitcher';
import CartCount from '@/app/components/CartCount';

export default function SiteHeader() {
  const { t } = useLocale();

  return (
    <header className="site-header" style={{
      padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      position: 'sticky', top: 0, background: 'rgba(10,10,10,0.75)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 100,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Image src="/logo.jpeg" alt="PLATYPUS" width={56} height={56} style={{ borderRadius: '10px', marginRight: '0.75rem' }} priority />
        <span className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>PLATYPUS</span>
      </Link>
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/versand" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>{t.nav.shipping}</Link>
        <LocaleSwitcher />
        <CartCount />
      </nav>
    </header>
  );
}