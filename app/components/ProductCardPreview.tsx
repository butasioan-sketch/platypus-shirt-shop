import StaticShirtPreview from './StaticShirtPreview';
import { BRAND_DEMO_PRINT } from '@/lib/print-spec';

export default function ProductCardPreview() {
  return (
    <div style={{ width: '100%', height: '340px' }}>
      <StaticShirtPreview print={BRAND_DEMO_PRINT.front} />
    </div>
  );
}