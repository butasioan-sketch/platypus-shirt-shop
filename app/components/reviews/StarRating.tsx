'use client';

type Props = {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
};

export default function StarRating({ rating, size = 18, interactive = false, onChange }: Props) {
  return (
    <div style={{ display: 'inline-flex', gap: '0.15rem', alignItems: 'center' }} role={interactive ? 'radiogroup' : 'img'} aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        const StarEl = interactive ? 'button' : 'span';
        return (
          <StarEl
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            aria-label={interactive ? `${star} Sterne` : undefined}
            style={{
              background: 'none',
              border: 'none',
              padding: interactive ? '0.1rem' : 0,
              cursor: interactive ? 'pointer' : 'default',
              color: filled ? '#facc15' : '#333',
              fontSize: `${size}px`,
              lineHeight: 1,
            }}
          >
            ★
          </StarEl>
        );
      })}
    </div>
  );
}