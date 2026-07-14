"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Subscriber { email: string; status: string; locale: string; created_at: string }

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    confirmed: '#4ade80', pending: '#fbbf24', unsubscribed: '#f87171',
  };
  return (
    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', color: colors[status] || '#888', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {status}
    </span>
  );
}

export default function NewsletterAdminPage() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/newsletter/admin')
      .then(r => r.json())
      .then(d => { setRows(d.subscribers || []); setLoading(false); })
      .catch(() => { setError('Fehler beim Laden'); setLoading(false); });
  }, []);

  const confirmed = rows.filter(r => r.status === 'confirmed');
  const pending = rows.filter(r => r.status === 'pending');

  function exportCSV() {
    const header = ['E-Mail', 'Status', 'Locale', 'Datum'];
    const csvRows = rows.map(r => [r.email, r.status, r.locale, r.created_at]);
    const csv = [header, ...csvRows]
      .map(row => row.map(cell => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'platypus-newsletter.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-5 sm:p-10 text-white">
      <Link href="/admin" className="font-black underline text-neutral-400 hover:text-white">
        ← Zurück zum Admin
      </Link>

      <div className="mt-5 rounded-[2rem] bg-[#121212] border border-white/10 shadow-xl p-6 sm:p-10">
        <p className="text-[#e2001a] font-black uppercase tracking-widest text-xs">Newsletter</p>
        <h1 className="mt-3 text-4xl sm:text-6xl font-black">E-Mail Leads</h1>
        <p className="mt-4 text-neutral-400">
          Double Opt-In — Neon Postgres. Bestätigt: <strong style={{ color: '#4ade80' }}>{confirmed.length}</strong> · Ausstehend: <strong style={{ color: '#fbbf24' }}>{pending.length}</strong>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            disabled={rows.length === 0}
            className="rounded-2xl bg-black px-5 py-3 font-black text-white disabled:opacity-40"
          >
            CSV exportieren ({rows.length})
          </button>
        </div>
      </div>

      <div className="mt-8">
        {loading && <p className="text-neutral-500">Lade…</p>}
        {error && <p style={{ color: '#f87171' }}>{error}</p>}
        {!loading && rows.length === 0 && (
          <div className="rounded-[2rem] bg-[#121212] border border-white/10 p-6">
            <p className="font-black text-neutral-500">Noch keine Anmeldungen.</p>
          </div>
        )}
        <div className="grid gap-2">
          {rows.map((row, i) => (
            <div key={i} className="rounded-2xl bg-[#121212] border border-white/10 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-black text-white text-sm">{row.email}</p>
                <p className="text-neutral-600 text-xs mt-0.5">{new Date(row.created_at).toLocaleDateString('de')} · {row.locale.toUpperCase()}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
