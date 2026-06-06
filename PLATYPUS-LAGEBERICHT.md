# PLATYPUS Lagebericht
Erstellt: Sa 6. Jun 02:31:53 CEST 2026

## System
- Node: v20.20.2
- NPM: 10.8.2
- Git: git version 2.43.0

## Projekt Struktur
- [OK] app/page.tsx
- [OK] app/layout.tsx
- [OK] app/product/[id]/page.tsx
- [OK] app/cart/page.tsx
- [OK] app/admin/page.tsx
- [OK] app/admin/orders/page.tsx
- [OK] app/admin/inventory/page.tsx
- [OK] app/admin/viewer-notes/page.tsx
- [OK] app/api/payments/create-checkout/route.ts
- [OK] app/api/webhooks/stripe/route.ts
- [OK] middleware.ts
- [OK] app/lib/products.ts
- [OK] app/components/Viewer/Viewer.tsx
- [OK] app/components/Footer.tsx
- [OK] app/impressum/page.tsx
- [OK] app/agb/page.tsx
- [OK] app/datenschutz/page.tsx
- [OK] app/versand/page.tsx

## Environment
- [FEHLT] STRIPE_SECRET_KEY
- [FEHLT] NEXT_PUBLIC_SITE_URL
- [FEHLT] ADMIN_PASSWORD
- [FEHLT] STRIPE_WEBHOOK_SECRET
- [FEHLT] NEXT_PUBLIC_SUPABASE_URL
- [FEHLT] NEXT_PUBLIC_SUPABASE_ANON_KEY

## Build
- [FAIL] Build fehlgeschlagen

### Build Fehler
```

> platypus-shirt-shop@0.1.0 build
> next build

▲ Next.js 16.2.4 (Turbopack)
- Environments: .env.local


> Build error occurred
Error: Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected. Please use "./proxy.ts" only. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
    at ignore-listed frames
```

## Live Shop
Base URL: https://platypus-shirt-shop.vercel.app

- [OK] / → 200
- [OK] /product/1 → 200
- [OK] /product/2 → 200
- [OK] /cart → 200
- [OK] /admin → 200
- [FAIL] /admin/orders → 404
- [OK] /admin/inventory → 200
- [OK] /admin/viewer-notes → 200
- [OK] /impressum → 200
- [OK] /agb → 200
- [OK] /datenschutz → 200
- [OK] /versand → 200

## Stripe API
API Antwort: {"ok":true,"provider":"stripe","methodId":"card","methodLabel":"Visa / Mastercard","status":"stripe_checkout_created","amount":34.98,"currency":"EUR","reference":"DIAGNOSE-TEST","redirectUrl":"https://checkout.stripe.com/c/pay/cs_test_a1SdHQwIwhDIxYcYRcsTNsplNLMxFefWUkH7UoiO8rOxlTy7ES4whiLksk#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRRXEZMaUlNTjVvVzR9bWh1RzZBME5pbHJgZ0tETT0zdzZ%2FX2RtTFdTNkpIMUJDR0Nia041V0NNSEp2aV1USFVUMUY1R0ZUTXZVSVBBMDdMUXMwTm5wfGE1NV9XU3N1YnE8JyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl","createdAt":"2026-06-06T00:32:08.087Z"}
- [OK] Stripe Checkout aktiv
- Checkout URL: https://checkout.stripe.com/c/pay/cs_test_a1SdHQwIwhDIxYcYRcsTNsplNLMxFefWUkH7UoiO8rOxlTy7ES4whiLksk#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRRXEZMaUlNTjVvVzR9bWh1RzZBME5pbHJgZ0tETT0zdzZ%2FX2RtTFdTNkpIMUJDR0Nia041V0NNSEp2aV1USFVUMUY1R0ZUTXZVSVBBMDdMUXMwTm5wfGE1NV9XU3N1YnE8JyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl

## Scripts
- [OK] platypus_lead.sh
- [OK] scripts-deploy.sh
- [OK] scripts/orders-final-report.sh
- [OK] scripts/orders-live-healthcheck.sh
- [OK] scripts/project-audit.sh
- [OK] scripts/env-check.sh
- [OK] scripts/stripe-webhook-setup.sh
- [OK] modules/admin.sh
- [OK] modules/stripe.sh
- [OK] modules/deploy.sh
- [OK] modules/audit.sh
- [OK] modules/backup.sh
- [OK] modules/health.sh
- [OK] modules/env.sh
- [OK] modules/orders.sh
- [WARN] config/settings.cfg nicht ausführbar

## Vercel
```
https://platypus-shirt-shop-aq1snf1f8-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-pdr9ms9i0-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-pr7eddzq4-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-ab48uihih-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-lufmemqp1-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-cmxc37s6r-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-cynf61ly4-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-dwp9noqut-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-hhpnjq37j-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-hlusr4yen-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-4s4pm0ahi-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-4szf8yhz4-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-48gh6efdi-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-972ds9ja8-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-5essbuav0-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-9vhtslnmy-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-c438468q9-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-5fqo55urt-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-d9oeu8clt-butasioan-sketchs-projects.vercel.app
https://platypus-shirt-shop-l7sqa02xs-butasioan-sketchs-projects.vercel.app
```

## Git
- Branch: main
```
b3c3f90 deploy: 2026-05-27 00:01
959da48 update
d5887df deploy: 2026-05-26 23:02
5115e68 deploy: 2026-05-26 21:17
2c3336b deploy: 2026-05-26 20:48
```

## Zusammenfassung
Report gespeichert in: PLATYPUS-LAGEBERICHT.md
