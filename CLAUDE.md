# PLATYPUS — Hinweise für Claude / AI-Assistenten

**Onboarding:** `~/Schreibtisch/MeinVault/ClaudeData/PLATYPUS-ONBOARDING.md`  
**Bug-Audit-Liste:** `~/Schreibtisch/MeinVault/ClaudeData/BUG-AUDIT-LIST.md` ← zuerst abarbeiten

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

## Regeln
- Vor Deploy: `./p build`
- Kein Preis auf Homepage
- Checkout immer mit designId
- Terminologie: Maßanfertigung, Atelier, Platypus Concierge (nicht Print-on-Demand)