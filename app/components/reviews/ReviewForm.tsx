'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n';
import StarRating from './StarRating';

type ReviewCopy = {
  name: string;
  namePlaceholder: string;
  rating: string;
  comment: string;
  commentPlaceholder: string;
  orderId: string;
  orderIdPlaceholder: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
};

export default function ReviewForm({ locale, copy }: { locale: Locale; copy: ReviewCopy }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setStatus('error');
      setMessage(copy.error);
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment, orderId: orderId || undefined, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || copy.error);

      setStatus('success');
      setMessage(data.message || copy.success);
      setName('');
      setRating(0);
      setComment('');
      setOrderId('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : copy.error);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    color: '#fff',
    padding: '0.85rem 1rem',
    fontSize: '0.9rem',
    outline: 'none',
  };

  return (
    <form
      onSubmit={submit}
      style={{
        background: '#121212',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.1rem',
      }}
    >
      <div>
        <label style={{ display: 'block', color: '#ccc', fontSize: '0.8rem', marginBottom: '0.45rem', fontWeight: 600 }}>
          {copy.name}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={copy.namePlaceholder}
          maxLength={60}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ display: 'block', color: '#ccc', fontSize: '0.8rem', marginBottom: '0.45rem', fontWeight: 600 }}>
          {copy.rating}
        </label>
        <StarRating rating={rating} size={28} interactive onChange={setRating} />
      </div>

      <div>
        <label style={{ display: 'block', color: '#ccc', fontSize: '0.8rem', marginBottom: '0.45rem', fontWeight: 600 }}>
          {copy.comment}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={copy.commentPlaceholder}
          minLength={10}
          maxLength={1200}
          required
          rows={5}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', color: '#888', fontSize: '0.78rem', marginBottom: '0.45rem' }}>
          {copy.orderId}
        </label>
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder={copy.orderIdPlaceholder}
          maxLength={40}
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          background: status === 'sending' ? '#333' : '#e2001a',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          padding: '0.9rem 1.5rem',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: status === 'sending' ? 'wait' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {status === 'sending' ? copy.sending : copy.submit}
      </button>

      {message && (
        <p style={{
          margin: 0,
          fontSize: '0.85rem',
          color: status === 'success' ? '#4ade80' : '#f87171',
          lineHeight: 1.5,
        }}>
          {message}
        </p>
      )}
    </form>
  );
}