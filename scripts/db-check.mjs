import { readFileSync } from 'fs';
import { neon } from '@neondatabase/serverless';
const env = readFileSync('.env.local', 'utf8');
const m = env.match(/DATABASE_URL=["']?([^"'\n]+)/);
if (!m) { console.log('keine DATABASE_URL gefunden'); process.exit(0); }
const sql = neon(m[1]);
try {
  const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='orders' ORDER BY ordinal_position`;
  console.log('orders-Spalten:', cols.map(c => c.column_name).join(', '));
  const cnt = await sql`SELECT count(*)::int AS n, COALESCE(max(created_at)::text,'-') AS last FROM orders`;
  console.log(`${cnt[0].n} Bestellungen, letzte: ${cnt[0].last}`);
} catch (e) { console.log('DB-Fehler:', e.message); }
