import { NextResponse } from 'next/server';
import templatesData from '@/data/templates-99.json';

export async function GET() {
  return NextResponse.json(templatesData, {
    headers: {
      // Statischer Katalog — Client/CDN darf lange cachen.
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
