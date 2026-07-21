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
- No-Print-Zonen: `getNoPrintNote(productId)` in `lib/print-spec.ts` — produktspezifisch (Tee: Schulter/Seitennaht/Kragen/Saum; Shorts: Kordelbund/Seitennaht-Paspel/Schritt/Saum), im Atelier-UI und PDF-Platzierungsdiagramm (gestrichelt) sichtbar.

## Produkt-Roadmap (Essential Collection — genau 2 Produkte, beide LIVE)
- Brand: `Essential Collection` · `AirFit Pro [Shorts]` · `AirFit Performance Fabric · Unisex · Maßgefertigt auf Bestellung`
- Alles weiß · 100 % Polyester · gleicher System-Aufbau (Atelier, 360°, Freeze, PDF)
- **P1 AirFit Pro** T-Shirt Unisex — LIVE (Blank **JN827**, 165 g/m² — Code aktualisiert 21.07; Fotos bleiben bestehend, kein JN827-Rückenfoto vorhanden)
- **P2 AirFit Pro Shorts** Unisex — LIVE
  - Blank: **James & Nicholson JN387** (Sweat-Shorts), 100 % PE, **135 g/m²**, S–XXL, Kordelbund, ohne Innenslip. Fotos: `public/airfit-shorts-front.png`/`back.png`, Overlay/Placement = Erstversion (nicht physisch getestet)
  - PDF-Analyse: `~/Downloads/James & Nicholson Unisex Basic Team Shorts Sweat-Shorts JN387, 10,60 €.pdf`
  - Doku: `~/Schreibtisch/MeinVault/ClaudeData/BRAND-ESSENTIAL-COLLECTION-2PRODUKTE.md`
  - Noch offen: physischer Testdruck zur Verifikation der Overlay-Kalibrierung
- Kein P3/P4 (Boxer / Sport-Unterwäsche nicht im Sortiment)
- **Preise (verbindlich):** `~/Schreibtisch/MeinVault/ClaudeData/PREISE-UND-BUNDLE-ESSENTIAL.md`
  - **Final (Jonny-OK 21.07):** Tee **44,99 €** · Shorts **39,99 €** · Set **74,99 €** (Blank JN827/JN387, real EK 16,40€/10,60€ brutto)
  - Extra-Motiv ab 3. Bild: **+2,99 €**
  - Master: `~/Schreibtisch/MeinVault/ClaudeData/FINAL-CLAUDE-LAUNCH-21-07.md`
  - Claude-Bau: Abschnitt „CLAUDE — KOMPLETT-PASTE“ in PREISE-UND-BUNDLE-ESSENTIAL.md

## 3D-Model-Library (Polyester-first)
- `public/models/library/catalog.json` — Maschinen-Index aller GLBs (aktiv + inaktiv), `README.md` daneben = Policy.
- Aktiv (in `MODEL_PATHS`/`products.ts`): nur `shirt-white-v2.glb` (P1) und `shorts-white-v1.glb` (P2).
- `library/inactive/` — gestagte Meshes für zukünftige Artikel (z. B. Cap), **nicht** in `MODEL_PATHS`/`products.ts` verdrahtet. Aktivierung erst nach: Polyester-Blank gesourct + Preis + Print-Profile + Jonny-OK.

## Regeln
- Vor Deploy: `./p build`
- Preise auf Homepage seit 19.07.2026 erlaubt (Essential Collection zeigt Tee/Shorts/Set-Preis explizit, Jonny-OK)
- Checkout immer mit designId
- Terminologie: Maßanfertigung, Atelier, Platypus Concierge (nicht Print-on-Demand)