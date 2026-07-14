import Image from 'next/image';
import { getPrintOverlayBox } from '@/lib/print-spec';

interface PrintData { src: string; x?: number; y?: number; scale?: number }

interface StaticShirtPreviewProps {
  shirtSrc?: string;
  alt?: string;
  print?: PrintData;
  shadow?: string;
}

export default function StaticShirtPreview({
  shirtSrc = '/airfit-front-t.png',
  alt = 'AirFit Pro — Vorderseite',
  print,
  shadow = '0 8px 24px rgba(0,0,0,0.5)',
}: StaticShirtPreviewProps) {
  const printBox = { ...getPrintOverlayBox(), pointerEvents: 'none' as const, zIndex: 2 };

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'relative', height: '100%', aspectRatio: '4/5', maxWidth: '100%' }}>
        <Image
          src={shirtSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 80vw, 340px"
          style={{ objectFit: 'contain', filter: `drop-shadow(${shadow})` }}
          priority
        />
        {print && (
          <div style={printBox}>
            <img
              src={print.src}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                width: `${(print.scale ?? 1) * 100}%`,
                height: `${(print.scale ?? 1) * 100}%`,
                objectFit: 'contain',
                top: `${50 + (print.y ?? 0)}%`,
                left: `${50 + (print.x ?? 0)}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}