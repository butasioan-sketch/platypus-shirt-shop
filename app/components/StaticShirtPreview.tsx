import Image from 'next/image';
import { SHIRT_VIEWER_ASPECT, type PrintSide } from '@/lib/print-spec';
import { getMotifStyle } from '@/lib/print-position';

interface PrintData { src: string; x?: number; y?: number; scale?: number }

interface StaticShirtPreviewProps {
  shirtSrc?: string;
  alt?: string;
  side?: PrintSide;
  print?: PrintData;
  shadow?: string;
}

export default function StaticShirtPreview({
  shirtSrc = '/airfit-front-t.png',
  alt = 'AirFit Pro — Vorderseite',
  side = 'front',
  print,
  shadow = '0 8px 24px rgba(0,0,0,0.5)',
}: StaticShirtPreviewProps) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'relative', height: '100%', aspectRatio: SHIRT_VIEWER_ASPECT, maxWidth: '100%' }}>
        <Image
          src={shirtSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 80vw, 340px"
          style={{ objectFit: 'contain', filter: `drop-shadow(${shadow})` }}
          priority
        />
        {print && (
          <img
            src={print.src}
            alt=""
            draggable={false}
            style={{ ...getMotifStyle(side, { scale: print.scale ?? 1, x: print.x ?? 0, y: print.y ?? 0 }), zIndex: 2 }}
          />
        )}
      </div>
    </div>
  );
}