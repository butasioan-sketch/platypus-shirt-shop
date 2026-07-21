# PLATYPUS — Hinweise für Claude / AI-Assistenten

**Onboarding:** `~/Schreibtisch/MeinVault/ClaudeData/PLATYPUS-ONBOARDING.md`  
**Bug-Audit-Liste:** `~/Schreibtisch/MeinVault/ClaudeData/BUG-AUDIT-LIST.md`  
**Roadmap Phase 2:** `~/Schreibtisch/MeinVault/ClaudeData/ROADMAP-PHASE2.md` ← Design, Marketing, Cart, Social

## Projekt
- Pfad: `~/Schreibtisch/platypus-shirt-shop`
- Live: https://platypus-shirt-shop.vercel.app
- Owner: butasioan@googlemail.com
- **Claude-Index (Live-Stand + offene Aufgaben):** `~/Schreibtisch/MeinVault/ClaudeData/CLAUDE-INDEX-PLATYPUS-LIVE.md`

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
- Preis: `lib/pricing.ts` — PRODUCT_FLAT pro productId (Tee/Shorts je 39.99€), INCLUDED_IMAGES (2) Motiv-Slots, jedes weitere Bild +EXTRA_IMAGE_PRICE (2.99€) pro Teil. Essential Set (1x Tee + 1x Shorts): PRICE_BUNDLE_ESSENTIAL (69.99€), automatisch via `calcMerchandiseTotal`/`isBundleEligible` sobald beide im Warenkorb sind.
- Produktabhängige Druck-Kalibrierung: `lib/print-spec.ts` `GARMENT_PROFILES` (Foto, Overlay, Placement, Blank pro productId) statt globalem Singleton — `getGarmentProfile(productId)`. `getMotifRect`/`getMotifStyle`/PDF nehmen alle einen `productId`-Parameter (default '1').
- No-Print-Zonen (Schulter/Seitennaht/Kragen/Saum): `NO_PRINT_NOTE` in `lib/print-spec.ts`, im Atelier-UI und PDF-Platzierungsdiagramm (gestrichelt) sichtbar.

## Produkt-Roadmap (Essential Collection — genau 2 Produkte, beide LIVE)
- Brand: `Essential Collection` · `AirFit Pro [Shorts]` · `AirFit Performance Fabric · Unisex · Maßgefertigt auf Bestellung`
- Alles weiß · 100 % Polyester · gleicher System-Aufbau (Atelier, 360°, Freeze, PDF)
- **P1 AirFit Pro** T-Shirt Unisex — LIVE (Blank B&C TM062, 140 g/m²)
- **P2 AirFit Pro Shorts** Unisex — LIVE
  - Blank: **James & Nicholson JN387** (Sweat-Shorts), 100 % PE, **135 g/m²**, S–XXL, Kordelbund, ohne Innenslip. Fotos: `public/airfit-shorts-front.png`/`back.png`, Overlay/Placement = Erstversion (nicht physisch getestet)
  - PDF-Analyse: `~/Downloads/James & Nicholson Unisex Basic Team Shorts Sweat-Shorts JN387, 10,60 €.pdf`
  - Doku: `~/Schreibtisch/MeinVault/ClaudeData/BRAND-ESSENTIAL-COLLECTION-2PRODUKTE.md`
  - Noch offen: physischer Testdruck zur Verifikation der Overlay-Kalibrierung
- Kein P3/P4 (Boxer / Sport-Unterwäsche nicht im Sortiment)
- **Preise (verbindlich):** `~/Schreibtisch/MeinVault/ClaudeData/PREISE-UND-BUNDLE-ESSENTIAL.md`
  - Tee **39,99 €** · Shorts **39,99 €** · **Essential Set** (Tee+Shorts) **69,99 €**
  - Extra-Motiv ab 3. Bild: **+2,99 €** · COGS grob Tee ~5,15 / Shorts ~11,05
  - Claude-Bau: Abschnitt „CLAUDE — KOMPLETT-PASTE“ in PREISE-UND-BUNDLE-ESSENTIAL.md

## Regeln
- Vor Deploy: `./p build`
- Preise auf Homepage seit 19.07.2026 erlaubt (Essential Collection zeigt Tee/Shorts/Set-Preis explizit, Jonny-OK)
- Checkout immer mit designId
- Terminologie: Maßanfertigung, Atelier, Platypus Concierge (nicht Print-on-Demand)