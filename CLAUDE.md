# PLATYPUS — Hinweise für Claude / AI-Assistenten

**Onboarding:** `~/Schreibtisch/MeinVault/ClaudeData/PLATYPUS-ONBOARDING.md`  
**Bug-Audit-Liste:** `~/Schreibtisch/MeinVault/ClaudeData/BUG-AUDIT-LIST.md`  
**Roadmap Phase 2:** `~/Schreibtisch/MeinVault/ClaudeData/ROADMAP-PHASE2.md` ← Design, Marketing, Cart, Social

## Projekt
- Pfad: `~/Schreibtisch/platypus-shirt-shop`
- Live: https://platypus-shirt-shop.vercel.app
- Owner: butasioan@googlemail.com

## Befehle
```bash
./p health | build | deploy "msg" | status
bash scripts/p2-verify.sh
```

## Kritische Dateien
- `lib/print-spec.ts` — Druck 210×297 mm
- `lib/i18n.ts` — Marken-Copy
- `lib/products.ts` — AirFit Pro (einzige Quelle)
- `app/api/payments/create-checkout/route.ts` — Server-Preise, designId Pflicht
- `lib/admin-alert.ts` — E-Mail bei on_hold

## Env
Siehe `.env.example`. Production-Secrets auf Vercel — `npx vercel env ls`.

## Druckauftrag / Freeze
- `designs.front_transform`/`back_transform` (scale,x,y) + `meta` werden bei jedem `saveDesign` gespeichert.
- Nach Zahlung (Stripe-Webhook): Design wird eingefroren (`frozen_at`), fehlendes Motiv → Order `on_hold`.
- `orders.print_job` = unveränderlicher Snapshot (Transforms + Placement + PrintSpec) zum Zahlungszeitpunkt.
- PDF: `GET /api/orders/{id}/print-pdf` (lib/print-job.ts, pdf-lib) — Auftragskopf + je Seite Druckblatt (Ebene 1) + Platzierung (Ebene 2, % + mm-Näherung). Geschützt wie `/admin` (proxy.ts, ADMIN_PASSWORD).
- Ebene 1 (Druckblatt, `lib/print-export.ts`) vs Ebene 2 (Platzierung auf Shirt, `lib/print-position.ts`/`lib/print-job.ts`) — Details im Kommentar dort.
- Legacy-Designs ohne Transform-Spalten: Admin zeigt "unbekannt (Legacy)".
- PDF hat zusätzlich Seite "KUNDENBLICK" pro Seite (Shirt-Foto + Motiv exakt wie Atelier/360°) — `lib/print-customer-view.ts`, `designs.front_preview`/`back_preview`. Reklamations-Nachweis. Legacy ohne Preview: Fallback-Text.
- Preis: `lib/pricing.ts` — BASE_PRICE deckt INCLUDED_IMAGES (2) Motiv-Slots, jedes weitere Bild +EXTRA_IMAGE_PRICE (2.99€). Heute nur front+back → immer 39.99€.
- No-Print-Zonen (Schulter/Seitennaht/Kragen/Saum): `NO_PRINT_NOTE` in `lib/print-spec.ts`, im Atelier-UI und PDF-Platzierungsdiagramm (gestrichelt) sichtbar.

## Produkt-Roadmap
- P1 AirFit Pro T-Shirt (unisex) — LIVE
- P2 Laufshorts (unisex, weiß), P3 Boxershorts (Herren), P4 Sport-Unterwäsche (Damen, Polyester) — **PLACEHOLDER**, Specs (Größen, Preis, Gewicht) fehlen noch (siehe Kommentar in `lib/products.ts`). Keine Preise/Maße erfinden, kein Checkout ohne Specs.

## Regeln
- Vor Deploy: `./p build`
- Kein Preis auf Homepage
- Checkout immer mit designId
- Terminologie: Maßanfertigung, Atelier, Platypus Concierge (nicht Print-on-Demand)