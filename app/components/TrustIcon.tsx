import React from 'react';

const ICONS: Record<string, React.ReactNode> = {
  stripe: (
    <>
      <rect x="8" y="12" width="16" height="12" rx="2" fill="none" stroke="#e2001a" strokeWidth="1.8" />
      <path d="M8 16h16" stroke="#e2001a" strokeWidth="1.8" />
      <circle cx="20" cy="20" r="1.5" fill="#e2001a" />
    </>
  ),
  pod: (
    <>
      <path d="M8 12h16v14H8z" fill="none" stroke="#e2001a" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 12V9a4 4 0 018 0v3" fill="none" stroke="#e2001a" strokeWidth="1.8" />
    </>
  ),
  quality: (
    <>
      <circle cx="16" cy="16" r="10" fill="none" stroke="#e2001a" strokeWidth="1.8" />
      <path d="M11 16l3.5 3.5L21 12" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  shipping: (
    <>
      <rect x="4" y="14" width="14" height="10" rx="1" fill="none" stroke="#e2001a" strokeWidth="1.8" />
      <path d="M18 17h4l3 5v2h-7z" fill="none" stroke="#e2001a" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="10" cy="26" r="2" fill="none" stroke="#e2001a" strokeWidth="1.8" />
      <circle cx="22" cy="26" r="2" fill="none" stroke="#e2001a" strokeWidth="1.8" />
    </>
  ),
};

export default function TrustIcon({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
      {ICONS[name] ?? ICONS.stripe}
    </svg>
  );
}