'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  total: number;
  revenue: number;
  last24h: number;
  byStatus: Record<string, number>;
  byCountry: Record<string, number>;
}

interface AnalyticsData {
  total: number;
  last24h: number;
  byType: Record<string, number>;
  byLocale: Record<string, number>;
  byProduct: Record<string, number>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, a] = await Promise.all([
        fetch('/api/orders?stats=true').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json()),
      ]);
      setStats(s);
      setAnalytics(a);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const FLAGS: Record<string, string> = { de: '🇩🇪', ro: '🇷🇴', en: '🇬🇧', DE: '🇩🇪', RO: '🇷🇴' };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.06), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS <span style={{ color: '#e2001a', fontSize: '0.7rem' }}>ADMIN</span></Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={load} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem' }}>↻ Refresh</button>
          <Link href="/admin" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none', alignSelf: 'center' }}>← Admin</Link>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Analytics</h1>

        {loading ? (
          <p style={{ color: '#555' }}>Laden...</p>
        ) : (
          <>
            {/* KENNZAHLEN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              {[
                { label: 'Umsatz gesamt', value: `€${(stats?.revenue || 0).toFixed(2)}`, color: '#4ade80' },
                { label: 'Bestellungen', value: (stats?.total || 0).toString(), color: '#60a5fa' },
                { label: 'Letzte 24h', value: (stats?.last24h || 0).toString(), color: '#a78bfa' },
                { label: 'Seitenaufrufe 24h', value: (analytics?.last24h || 0).toString(), color: '#facc15' },
              ].map((kpi) => (
                <div key={kpi.label} style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                  <p style={{ color: '#555', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{kpi.label}</p>
                  <p style={{ color: kpi.color, fontSize: '2rem', fontWeight: 800 }}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* ORDER STATUS PIPELINE */}
            <h2 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Order Pipeline</h2>
            <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              {[
                { key: 'paid', label: 'Bezahlt', color: '#4ade80' },
                { key: 'production', label: 'In Produktion', color: '#facc15' },
                { key: 'shipped', label: 'Versendet', color: '#60a5fa' },
                { key: 'delivered', label: 'Geliefert', color: '#a78bfa' },
                { key: 'cancelled', label: 'Storniert', color: '#f87171' },
              ].map((s) => {
                const count = stats?.byStatus?.[s.key] || 0;
                const total = stats?.total || 1;
                const pct = (count / total) * 100;
                return (
                  <div key={s.key} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#ccc' }}>{s.label}</span>
                      <span style={{ fontSize: '0.875rem', color: s.color, fontWeight: 700 }}>{count}</span>
                    </div>
                    <div style={{ height: '6px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: '3px', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NACH LAND & SPRACHE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Bestellungen nach Land</h3>
                {Object.entries(stats?.byCountry || {}).length === 0 ? (
                  <p style={{ color: '#444', fontSize: '0.875rem' }}>Noch keine Daten</p>
                ) : (
                  Object.entries(stats?.byCountry || {}).map(([country, count]) => (
                    <div key={country} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                      <span style={{ fontSize: '0.875rem' }}>{FLAGS[country] || '🌍'} {country}</span>
                      <span style={{ fontSize: '0.875rem', color: '#888' }}>{count}</span>
                    </div>
                  ))
                )}
              </div>

              <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Traffic nach Sprache</h3>
                {Object.entries(analytics?.byLocale || {}).length === 0 ? (
                  <p style={{ color: '#444', fontSize: '0.875rem' }}>Noch keine Daten</p>
                ) : (
                  Object.entries(analytics?.byLocale || {}).map(([locale, count]) => (
                    <div key={locale} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                      <span style={{ fontSize: '0.875rem' }}>{FLAGS[locale] || '🌍'} {locale.toUpperCase()}</span>
                      <span style={{ fontSize: '0.875rem', color: '#888' }}>{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #1a2332', borderRadius: '12px', padding: '1.25rem' }}>
              <p style={{ color: '#60a5fa', fontSize: '0.8rem', marginBottom: '0.5rem' }}>ℹ Datenquelle</p>
              <p style={{ color: '#888', fontSize: '0.8rem' }}>
                {stats?.total ? 'Live Daten aus Datenbank' : 'In-Memory Modus (DATABASE_URL nicht gesetzt). Daten werden bei Neustart zurückgesetzt.'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
