#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Vercel Edge Middleware"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Middleware läuft vor jeder Anfrage und kann Requests modifizieren."
echo ""
echo "Datei erstellen: middleware.ts (im Root)"
echo ""
echo "Beispiel:"
echo ""
echo 'import { NextResponse } from "next/server";'
echo 'import type { NextRequest } from "next/server";'
echo ""
echo 'export function middleware(request: NextRequest) {'
echo '  // Beispiel: Weiterleitung'
echo '  if (request.nextUrl.pathname === "/admin") {'
echo '    return NextResponse.redirect(new URL("/login", request.url));'
echo '  }'
echo '  return NextResponse.next();'
echo '}'
echo ""
echo "export const config = {"
echo '  matcher: ["/admin/:path*"]'
echo "};"
echo ""
echo "════════════════════════════════════════════════════════════"
