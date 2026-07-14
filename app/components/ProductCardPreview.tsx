'use client';

import ShirtFlip from './ShirtFlip';
import { BRAND_DEMO_PRINT, VIEWER_DEFAULTS } from '@/lib/print-spec';

export default function ProductCardPreview() {
  return (
    <div style={{ width: '100%', height: '340px' }}>
      <ShirtFlip
        autoRotateSpeed={VIEWER_DEFAULTS.autoRotateSpeed2D}
        showControls={false}
        showHint={false}
        frontPrint={BRAND_DEMO_PRINT.front}
        backPrint={BRAND_DEMO_PRINT.back}
      />
    </div>
  );
}