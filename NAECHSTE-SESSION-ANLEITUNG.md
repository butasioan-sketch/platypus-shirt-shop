# PLATYPUS — Anleitung für die nächste Session

## Voraussetzung: STABILES INTERNET
Teste zuerst:
Nur weitermachen wenn 10/10 Pakete ankommen (0% packet loss).

---

## Stand jetzt
- Build: lokal grün
- Code: liegt auf GitHub (github.com/butasioan-sketch/platypus-shirt-shop)
- Problem: Vercel ist noch nicht mit dem GitHub-Repo verbunden
- Ziel: Vercel mit GitHub verbinden → automatischer Deploy → Shop live

---

## SCHRITT 1: Repo für Vercel zugänglich machen (BROWSER)

Öffne im Browser (Firefox/Chrome), in die Adressleiste tippen:

    vercel.com/dashboard

Dann:
1. Projekt "platypus-shirt-shop" anklicken
2. Oben auf "Settings"
3. Links auf "Git"
4. Button "Connect Git Repository" klicken
5. GitHub wählen
6. Falls Vercel keinen Zugriff hat: "Configure GitHub App" / "Adjust Permissions"
   → dort "platypus-shirt-shop" erlauben (oder "All repositories")
7. Repo aus der Liste wählen und verbinden

Sobald verbunden: Vercel baut AUTOMATISCH den ersten Deploy von GitHub.
Das dauert 1-3 Minuten auf VERCELS Servern (nicht deine Leitung).

---

## SCHRITT 2: Warten und prüfen

Nach ca. 3 Minuten im Terminal:

    curl -s -o /dev/null -w "orders: %{http_code}\n" https://platypus-shirt-shop.vercel.app/admin/orders

- 200 oder 401 = ERFOLG, Shop ist live mit allen neuen Features
- 404 = Deploy noch nicht fertig, 2 Min warten, nochmal

---

## SCHRITT 3: Env Variablen in Vercel setzen (BROWSER)

Im Vercel Dashboard → Settings → Environment Variables.
Diese hinzufügen (Production):

| Name                | Wert                                      |
|---------------------|-------------------------------------------|
| ADMIN_PASSWORD      | (dein Wunschpasswort)                     |
| NEXT_PUBLIC_SITE_URL| https://platypus-shirt-shop.vercel.app    |
| STRIPE_SECRET_KEY   | (dein Stripe Key, schon gesetzt?)         |

Optional für volle Features:
| ANTHROPIC_API_KEY   | sk-ant-...  (für echten KI-Chat)          |
| RESEND_API_KEY      | re-...      (für echte Bestätigungsmails) |
| DATABASE_URL        | (von Vercel Postgres, siehe Schritt 4)    |

Nach dem Setzen: Vercel → Deployments → "Redeploy".

---

## SCHRITT 4 (später): Datenbank für echte Bestellungen

Vercel Dashboard → Storage → "Create Database" → Postgres (Neon).
Mit dem Projekt verbinden. DATABASE_URL wird automatisch gesetzt.
Dann Redeploy. Ab da überleben Bestellungen jeden Neustart.

---

## SCHRITT 5: Mit Freunden testen (intern)

Sobald oben alles grün:
- Shop:   https://platypus-shirt-shop.vercel.app
- Admin:  https://platypus-shirt-shop.vercel.app/admin  (Passwort: ADMIN_PASSWORD)
- Stripe Testkarte: 4242 4242 4242 4242, Datum in Zukunft, beliebiger CVC

Freunde können Produkte ansehen, in den Warenkorb legen, Test-Checkout machen.
Du siehst die Bestellungen unter /admin/orders.

---

## Wenn der GitHub-Push nochmal nötig ist (bei stabilem Netz)

    git push origin main

Falls "Repository not found": Repo neu erstellen
    gh repo create platypus-shirt-shop --private --source=. --remote=origin --push

---

## WICHTIG
- Erst Internet stabil (ping testen), DANN Befehle
- Browser-Weg ist zuverlässiger als Terminal bei wackeligem Netz
- Bei jedem Schritt: erst prüfen ob er geklappt hat, dann weiter
