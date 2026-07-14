'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Locale, getTranslation } from '@/lib/i18n';
import ReviewCard, { PublicReview } from './ReviewCard';
import StarRating from './StarRating';

type Stats = { count: number; avg: number };

export default function ReviewsSection({
  locale,
  compact = false,
  showLink = true,
}: {
  locale: Locale;
  compact?: boolean;
  showLink?: boolean;
}) {
  const t = getTranslation(locale);
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [stats, setStats] = useState<Stats>({ count: 0, avg: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/reviews?status=approved&limit=' + (compact ? 3 : 20)).then((r) => r.json()),
      fetch('/api/reviews?stats=true').then((r) => r.json()),
    ])
      .then(([data, s]) => {
        setReviews(data.reviews || []);
        setStats({ count: s.count ?? 0, avg: s.avg ?? 0 });
      })
      .catch(() => {
        setReviews([]);
        setStats({ count: 0, avg: 0 });
      })
      .finally(() => setLoading(false));
  }, [compact]);

  const limit = compact ? 3 : reviews.length;

  return (
    <section style={{ padding: compact ? '3rem 2rem' : '0', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: compact ? 'center' : 'left', marginBottom: '2rem' }}>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>
          {t.reviews.label}
        </p>
        <h2 style={{ fontSize: compact ? '1.75rem' : '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>
          {t.reviews.title}
        </h2>
        <p style={{ color: '#999', fontSize: '0.95rem', maxWidth: '620px', margin: compact ? '0 auto' : 0, lineHeight: 1.6 }}>
          {t.reviews.sub}
        </p>

        {!loading && stats.count > 0 && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '1.25rem',
            padding: '0.55rem 1rem',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <StarRating rating={stats.avg} size={18} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{stats.avg.toFixed(1)}</span>
            <span style={{ color: '#666', fontSize: '0.8rem' }}>
              {t.reviews.basedOn.replace('{count}', String(stats.count))}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <p style={{ color: '#555', textAlign: compact ? 'center' : 'left' }}>{t.reviews.loading}</p>
      ) : reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 1.5rem',
          background: '#121212',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
        }}>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: showLink ? '1rem' : 0 }}>{t.reviews.empty}</p>
          {showLink && (
            <Link href="/bewertungen" style={{ color: '#e2001a', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              {t.reviews.writeFirst} →
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {reviews.slice(0, limit).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {showLink && reviews.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link
            href="/bewertungen"
            style={{
              display: 'inline-block',
              padding: '0.65rem 1.4rem',
              borderRadius: '999px',
              border: '1px solid rgba(226,0,26,0.45)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'rgba(226,0,26,0.08)',
            }}
          >
            {t.reviews.viewAll} →
          </Link>
        </div>
      )}
    </section>
  );
}