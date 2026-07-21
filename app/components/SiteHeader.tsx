'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from './LocaleProvider';
import LocaleSwitcher from './LocaleSwitcher';
import CartCount from '@/app/components/CartCount';

export default function SiteHeader() {
  const { t } = useLocale();

  return (
    <header className="plt-header site-header">
      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Image src="/logo.jpeg" alt="PLATYPUS" width={56} height={56} style={{ borderRadius: '10px', marginRight: '0.75rem' }} priority />
        <span className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>PLATYPUS</span>
      </Link>
      <nav className="site-header-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/product/1" className="plt-nav-link">{t.nav.shirt}</Link>
        <Link href="/product/2" className="plt-nav-link">{t.nav.shorts}</Link>
        <Link href="/versand" className="plt-nav-link">{t.nav.shipping}</Link>
        <LocaleSwitcher />
        <CartCount />
      </nav>
    </header>
  );
}
