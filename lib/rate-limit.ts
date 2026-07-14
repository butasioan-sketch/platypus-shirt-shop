// Einfaches In-Memory Rate-Limiting (Basis-Schutz vor Launch).
// Claude kann später auf Upstash/Vercel KV upgraden.

type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

function pruneExpired(now: number) {
  if (buckets.size < 200) return;
  for (const [k, v] of buckets) {
    if (now > v.reset) buckets.delete(k);
  }
}

export function checkRateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  pruneExpired(now);
  const entry = buckets.get(key);

  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((entry.reset - now) / 1000)) };
  }

  entry.count += 1;
  return { ok: true };
}

export function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    'unknown'
  );
}