'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '@/app/components/Logo';

export default function AdminPage() {
  const [orderCount, setOrderCount] = useState(0);
  const [stripeStatus, setStripeStatus] = useState<'loading' | 'ok' | 'demo'>('loading');

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem('platypus_orders') || '[]');
      setOrderCount(orders.length);
    } catch { setOrderCount(0); }

    fetch('/api/payments/create-checkout')
      .then(r => r.json())
      .then(d => setStripeStatus(d.stripeKeyConfigured ? 'ok' : 'demo'))
      .catch(() => setStripeStatus('demo'));
  }, []);

  const cards = [
    { label: 'Orders', value: orderCount.toString(), href: '/admin/orders', color: '#4ade80', icon: '📦' },
    { label: 'Stripe', value: stripeStatus === 'loading' ? '...' : stripeStatus === 'ok' ? 'Aktiv' : 'Demo', href: '/admin/tests', color: stripeStatus === 'ok' ? '#4ade80' : '#facc15', icon: '💳' },
    { label: 'Inventory', value: '2 Produkte', href: '/admin/inventory', color: '#60a5fa', icon: '👕' },
    { label: 'Viewer Notes', value: 'Notizen', href: '/admin/viewer-notes', color: '#a78bfa', icon: '📝' },
  ];

  const links = [
    { label: 'Live Shop', href: 'https://platypus-shirt-shop.vercel.app', ext: true },
    { label: 'Produkt 1', href: '/product/1', ext: false },
    { label: 'Produkt 2', href: '/product/2', ext: false },
    { label: 'Warenkorb', href: '/cart', ext: false },
    { label: 'Stripe Dashboard', href: 'https://dashboard.stripe.com', ext: true },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.06), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>PLATYPUS <span style={{ color: '#e2001a', fontSize: '0.7rem', letterSpacing: '0.1em' }}>ADMIN</span></span>
          <span style={{ color: '#444', marginLeft: '1rem', fontSize: '0.875rem' }}>Admin</span>
        </div>
        <Link href="/" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Shop</Link>
      </header>

      <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {cards.map((card) => (
            <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{card.icon}</div>
                <p style={{ color: '#555', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</p>
                <p style={{ color: card.color, fontSize: '1.5rem', fontWeight: 800 }}>{card.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* QUICK LINKS */}
        <h2 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Quick Links</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}
              style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: '#fff', fontSize: '0.875rem' }}>
              <span>{l.label}</span>
              <span style={{ color: '#333' }}>{l.ext ? '↗' : '→'}</span>
            </a>
          ))}
        </div>

        {/* CHECKLISTE */}
        <h2 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Launch Checkliste</h2>
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
          {[
            { done: true,  label: 'Shop live auf Vercel' },
            { done: true,  label: 'Stripe Checkout integriert' },
            { done: true,  label: 'Design-Editor: eigenes Motiv hochladen' },
            { done: true,  label: 'Admin Dashboard' },
            { done: true,  label: 'Warenkorb mit LocalStorage' },
            { done: stripeStatus === 'ok', label: 'Echter Stripe Key gesetzt' },
            { done: false, label: 'Stripe Webhook aktiv' },
            { done: false, label: 'Admin Passwort gesetzt' },
            { done: false, label: 'Echte Produktbilder' },
            { done: false, label: 'Erster echter Testkauf' },
            { done: false, label: 'Datenbank (Supabase)' },
            { done: false, label: 'E-Mail Bestätigung' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: item.done ? '#4ade80' : '#333', fontSize: '1rem', minWidth: '20px' }}>
                {item.done ? '✓' : '○'}
              </span>
              <span style={{ color: item.done ? '#fff' : '#555', fontSize: '0.875rem' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
