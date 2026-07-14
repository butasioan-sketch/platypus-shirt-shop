'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import StarRating from '@/app/components/reviews/StarRating';
import { Review, ReviewStatus } from '@/lib/types';

const STATUS_COLORS: Record<ReviewStatus, string> = {
  pending: '#facc15',
  approved: '#4ade80',
  rejected: '#f87171',
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('pending');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const status = filter === 'all' ? 'all' : filter;
      const data = await fetch(`/api/reviews?status=${status}&limit=100`).then((r) => r.json());
      setReviews(data.reviews || []);
    } catch {
      setReviews([]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: ReviewStatus) => {
    setActing(id);
    await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setActing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Bewertung endgültig löschen?')) return;
    setActing(id);
    await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    setActing(null);
    load();
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.06), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.15em' }}>
          PLATYPUS <span style={{ color: '#e2001a', fontSize: '0.7rem' }}>ADMIN</span>
        </Link>
        <Link href="/admin" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Admin</Link>
      </header>

      <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>Bewertungen</h1>
            <p style={{ color: '#666', fontSize: '0.85rem' }}>Freischalten, ablehnen oder einzeln löschen</p>
          </div>
          {filter === 'pending' && pendingCount > 0 && (
            <span style={{ background: 'rgba(250,204,21,0.12)', color: '#facc15', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
              {pendingCount} ausstehend
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {([
            { key: 'pending', label: 'Ausstehend' },
            { key: 'approved', label: 'Freigeschaltet' },
            { key: 'rejected', label: 'Abgelehnt' },
            { key: 'all', label: 'Alle' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                background: filter === key ? '#fff' : '#111',
                color: filter === key ? '#000' : '#888',
                border: '1px solid #222',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#555' }}>Laden...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: '#555' }}>Keine Bewertungen in dieser Ansicht.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  background: '#111',
                  border: `1px solid ${review.status === 'pending' ? 'rgba(250,204,21,0.25)' : '#1a1a1a'}`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700 }}>{review.name}</span>
                      <span style={{ color: STATUS_COLORS[review.status], fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                        {review.status}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  <span style={{ color: '#555', fontSize: '0.75rem' }}>
                    {new Date(review.createdAt).toLocaleString('de-DE')}
                  </span>
                </div>

                <p style={{ color: '#aaa', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 1rem', whiteSpace: 'pre-wrap' }}>
                  {review.comment}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {review.status !== 'approved' && (
                    <button
                      disabled={acting === review.id}
                      onClick={() => setStatus(review.id, 'approved')}
                      style={{ background: '#166534', color: '#fff', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      Freischalten
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      disabled={acting === review.id}
                      onClick={() => setStatus(review.id, 'rejected')}
                      style={{ background: '#1a1a1a', color: '#facc15', border: '1px solid #333', padding: '0.45rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem' }}
                    >
                      Ablehnen
                    </button>
                  )}
                  <button
                    disabled={acting === review.id}
                    onClick={() => remove(review.id)}
                    style={{ background: 'transparent', color: '#f87171', border: '1px solid rgba(248,113,113,0.35)', padding: '0.45rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem' }}
                  >
                    Löschen
                  </button>
                  {review.orderId && (
                    <span style={{ color: '#444', fontSize: '0.75rem', marginLeft: 'auto' }}>Order: {review.orderId}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}