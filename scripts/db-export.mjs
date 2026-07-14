#!/usr/bin/env node
/**
 * PLATYPUS DB Export — F-L9 Backup Strategy
 * Usage: node scripts/db-export.mjs
 * Output: backups/db-YYYY-MM-DD_HH-MM.json
 */
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { neon } from '@neondatabase/serverless';

function loadEnv() {
  try {
    const env = readFileSync('.env.local', 'utf8');
    const m = env.match(/DATABASE_URL=["']?([^"'\n]+)/);
    if (m) return m[1];
  } catch {}
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

const url = loadEnv();
if (!url) {
  console.error('DATABASE_URL fehlt. Lege .env.local an oder setze die Variable.');
  process.exit(1);
}

const sql = neon(url);
console.log('Verbinde mit Neon...');

const [orders, designs, reviews, subscribers] = await Promise.all([
  sql`SELECT * FROM orders ORDER BY created_at DESC`.catch(() => []),
  sql`SELECT id, product_id, created_at FROM designs ORDER BY created_at DESC`.catch(() => []),
  sql`SELECT * FROM reviews ORDER BY created_at DESC`.catch(() => []),
  sql`SELECT email, status, locale, created_at, confirmed_at FROM newsletter_subscribers ORDER BY created_at DESC`.catch(() => []),
]);

const dump = {
  exportedAt: new Date().toISOString(),
  counts: { orders: orders.length, designs: designs.length, reviews: reviews.length, subscribers: subscribers.length },
  orders,
  designs,
  reviews,
  newsletter_subscribers: subscribers,
};

mkdirSync('backups', { recursive: true });
const ts = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
const file = `backups/db-${ts}.json`;
writeFileSync(file, JSON.stringify(dump, null, 2));

console.log(`✓ Backup gespeichert: ${file}`);
console.log(`  Orders:      ${orders.length}`);
console.log(`  Designs:     ${designs.length}`);
console.log(`  Reviews:     ${reviews.length}`);
console.log(`  Newsletter:  ${subscribers.length}`);
