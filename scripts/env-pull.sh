#!/bin/bash
echo "Environment Variables von Vercel herunterladen..."
vercel env pull .env.local
echo "✅ .env.local aktualisiert"
