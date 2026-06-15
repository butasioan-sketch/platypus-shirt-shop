# PLATYPUS — Lagebericht (verifizierter Stand)
Stand: 15. Juni 2026

## Was PLATYPUS IST
Print-on-Demand T-Shirt-Shop. Kunde lädt eigenes Motiv hoch (vorne/hinten),
bezahlt, Bestellung geht in Produktion. Marke: "On Me — words are not just words".

## Technik (verifiziert)
- Next.js 16.2.4 (Turbopack), React, Vercel
- Stripe Checkout (TEST-Modus aktiv)
- Neon Postgres (echte Datenbank — NICHT LocalStorage, NICHT Supabase)
- Live: https://platypus-shirt-shop.vercel.app
- GitHub: butasioan-sketch/platypus-shirt-shop

## Was FUNKTIONIERT (getestet)
- Design-Editor: Motiv hochladen, frei verschieben, Größe, zentrieren
- Kompletter Kauf-Ablauf: Upload -> Checkout -> DB -> Admin zeigt Design zum Drucken
- Sendungsverfolgung (/tracking): Status-Leiste Bezahlt->Produktion->Versandt->Zugestellt
- FAQ-Seite (/faq): 10 Fragen, aufklappbar
- Admin-Bereich komplett (Übersicht, Orders, Analytics, Inventory, Tests, Newsletter, Viewer-Notes) — alle im Markenlook
- Markenlook durchgängig (dunkel + rot #e2001a), Frontend + Admin
- Helfer-Skript ./p (deploy/health/status/build)
- Echter Freunde-Test bestanden (Sergiu, mit echtem Design)

## OFFEN — vor echtem Verkauf (Priorität)
1. Resend-API-Schlüssel besorgen -> echte Bestätigungs-Mails (E-Mail-Code ist fertig, wartet nur auf Schlüssel)
2. Stripe-Name "On Me Sandbox" -> "PLATYPUS" (im Stripe-Dashboard, beim Live-Gang)
3. Legal-Texte rechtssicher prüfen (Impressum/AGB/Datenschutz/Widerruf — Abmahnschutz DE)
4. Echte Produktfotos statt SVG-Silhouetten
5. Stripe TEST -> LIVE schalten (Verifizierung, sk_live-Schlüssel, Webhook neu registrieren)

## ENTDECKTE IDEEN / BAUSTEINE (auf dem Mac gefunden)
- WM-2026-Flaggen-Kollektion: KONZEPT existiert (PDF in Downloads), 48 abstrakte Team-Designs + VS-Element,
  für Plotter/Thermofolie bei "most solutions GmbH (Witten)".
  ACHTUNG: Die 48 Design-PNGs existieren noch NICHT auf dem Mac.
  ACHTUNG: Markenrecht prüfen (FIFA schützt "WM"/"World Cup" — nur eigene abstrakte Kunst, keine FIFA-Begriffe/Logos).
- platypus-designer/designer.html: eigenes Designer-Tool (für dich/Plotter-Partner),
  exportiert druckfertiges transparentes PNG (30x40cm). Funktioniert, eigenständig.

## AUFRÄUMEN (optional, ungefährlich)
- @supabase/supabase-js aus package.json entfernen (totes Paket, nirgends benutzt)
- ~20 alte KI-Skripte im Projektordner sichten (platypus-*.sh)

## ERLEDIGT diese Session
360-Viewer-Reste komplett entfernt (toter Code gelöscht), SEO aktualisiert,
gesamter Admin-Bereich auf Markenlook, Tracking + FAQ gebaut, Farb-Harmonisierung abgeschlossen.
