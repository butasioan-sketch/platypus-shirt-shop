'use client';

import StarRating from './StarRating';

export type PublicReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  locale?: string;
  createdAt: string;
};

export default function ReviewCard({ review }: { review: PublicReview }) {
  const date = new Date(review.createdAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      style={{
        background: '#121212',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '1.35rem 1.4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{review.name}</p>
          <StarRating rating={review.rating} size={16} />
        </div>
        <time style={{ color: '#555', fontSize: '0.75rem', whiteSpace: 'nowrap' }} dateTime={review.createdAt}>
          {date}
        </time>
      </div>
      <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
        {review.comment}
      </p>
    </article>
  );
}