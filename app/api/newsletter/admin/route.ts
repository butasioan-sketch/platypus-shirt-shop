import { NextResponse } from 'next/server';
import { getNewsletterSubscribers, initDb } from '@/lib/db';

let initialized = false;
async function ensureInit() {
  if (!initialized) { await initDb(); initialized = true; }
}

export async function GET() {
  await ensureInit();
  const subscribers = await getNewsletterSubscribers();
  return NextResponse.json({ subscribers });
}
