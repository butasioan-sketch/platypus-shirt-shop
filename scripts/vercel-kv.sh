#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Vercel KV (Key-Value Store)"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Vercel KV ist ein schneller Key-Value Store (basiert auf Redis)."
echo ""
echo "Installation:"
echo "  npm install @vercel/kv"
echo ""
echo "Beispielnutzung (in einer Route):"
echo ""
echo 'import { kv } from "@vercel/kv";'
echo ""
echo 'export async function GET() {'
echo '  await kv.set("besucher", 1);'
echo '  const count = await kv.get("besucher");'
echo '  return Response.json({ count });'
echo '}'
echo ""
echo "Tipp: Gut für Counter, Sessions, Caching, Feature Flags."
echo ""
echo "════════════════════════════════════════════════════════════"
