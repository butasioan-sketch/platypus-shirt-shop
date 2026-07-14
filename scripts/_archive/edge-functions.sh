#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Vercel Edge Functions"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Edge Functions laufen am Netzwerk-Rand (Edge) → sehr schnell."
echo ""
echo "Beispiele für Nutzung:"
echo "  - Authentifizierung / Middleware"
echo "  - A/B Testing"
echo "  - Personalisierung"
echo "  - API Routes mit niedriger Latenz"
echo ""
echo "In Next.js erstellst du sie so:"
echo ""
echo "app/api/hello/route.ts"
echo ""
echo 'export const runtime = "edge";'
echo ""
echo 'export async function GET() {'
echo '  return Response.json({ message: "Hello from Edge" });'
echo '}'
echo ""
echo "════════════════════════════════════════════════════════════"
