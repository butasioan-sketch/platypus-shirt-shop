'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ size = 48, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
      <Image src="/logo.jpeg" alt="PLATYPUS" width={size} height={size} style={{ borderRadius: '10px', marginRight: showText ? '0.75rem' : 0 }} priority />
      {showText && <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>PLATYPUS</span>}
    </Link>
  );
}
