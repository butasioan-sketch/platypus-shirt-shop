'use client';

import dynamic from 'next/dynamic';
import { BRAND_DEMO_PRINT, VIEWER_DEFAULTS } from '@/lib/print-spec';
import ShirtFlip from './ShirtFlip';

const Shirt3D = dynamic(() => import('./Shirt3D'), {
  ssr: false,
  loading: () => (
    <ShirtFlip
      autoRotateSpeed={VIEWER_DEFAULTS.autoRotateSpeed2D}
      idleDelayMs={VIEWER_DEFAULTS.idleDelayMs}
      dragSensitivity={0.55}
      inertiaFriction={0.91}
      showControls={false}
      showHint={false}
      frontPrint={BRAND_DEMO_PRINT.front}
      backPrint={BRAND_DEMO_PRINT.back}
      shadow="0 12px 32px rgba(0,0,0,0.55)"
    />
  ),
});

export default function ProductHeroViewer({ height = 400 }: { height?: number }) {
  return (
    <div style={{ width: '100%', maxWidth: 340, height, margin: '0 auto', position: 'relative' }}>
      <div style={{
        position: 'absolute', width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(226,0,26,0.18), transparent 70%)',
        filter: 'blur(24px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0,
      }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <Shirt3D
          enableTouch={false}
          frontPrint={BRAND_DEMO_PRINT.front}
          backPrint={BRAND_DEMO_PRINT.back}
        />
      </div>
    </div>
  );
}