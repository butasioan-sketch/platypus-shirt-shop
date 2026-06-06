# Admin Authentication

## Setup

1. In `.env.local` (oder Vercel Environment Variables) setzen:
   ADMIN_PASSWORD=dein-sehr-starkes-passwort

2. Danach Build + Deploy:
   npm run build
   ./scripts-deploy.sh

## Zugriff

Nach dem Deploy:
- Gehe auf /admin
- Browser fragt nach Username + Passwort
- Username kann beliebig sein (z.B. admin)
- Passwort = ADMIN_PASSWORD aus .env

## Hinweis

Das ist eine einfache aber effektive Absicherung für die Pre-Launch Phase.
Später kann auf NextAuth oder Clerk upgegradet werden.
