'use client';

import dynamic from 'next/dynamic';
import { BRAND_DEMO_PRINT } from '@/lib/print-spec';
import StaticShirtPreview from './StaticShirtPreview';

const Shirt3D = dynamic(() => import('./Shirt3D'), {
  ssr: false,
  loading: () => (
    <StaticShirtPreview
      print={BRAND_DEMO_PRINT.front}
      shadow="0 12px 32px rgba(0,0,0,0.55)"
    />
  ),
});

export default function ProductHeroViewer({ height = 400 }: { height?: number }) {
  return (
    <div style={{ width: '100%', maxWidth: 400, height, margin: '0 auto', position: 'relative' }}>
      <div style={{
        position: 'absolute', width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(226,0,26,0.18), transparent 70%)',
        filter: 'blur(24px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0,
      }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <Shirt3D
          enableTouch={false}
          fallback="static"
          frontPrint={BRAND_DEMO_PRINT.front}
          backPrint={BRAND_DEMO_PRINT.back}
        />
      </div>
    </div>
  );
}