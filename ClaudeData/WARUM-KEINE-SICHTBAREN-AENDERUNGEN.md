# WARUM du keine sichtbaren Verbesserungen siehst (2026-07-23)

## Kurzantwort

1. **Deploy war schon online** — Live-MD5 = Lokal-MD5 (Stand nach Restore).
2. **Service Worker hat alte GLBs im Browser gehalten** — das war der Hauptgrund für „nix ändert sich online“.
3. **Mesh-Experimente haben Tee/Shorts schlechter gemacht** — dann Restore. Optik = Mesh-Quelle, nicht Kamera-Tüfteln.
4. **Shorts-Mesh ist low-poly** (~17k verts) vs Tee (~175k) — „gleiche Optik“ ohne besseres Shorts-3D-Asset unmöglich.

---

## Live-Stand (verifiziert)

| Datei | MD5 | Größe | Live-ETag |
|-------|-----|-------|-----------|
| `shirt-white-v2.glb` | `ab8622e998d7d2a7232971a364f7ffa6` | 833552 | = MD5 |
| `shorts-white-v1.glb` | `ab97dbfac083ee91472c3996dcc326fc` | 629412 | = MD5 |

Commit: `095524c` + SW-Fix (kein GLB-Cache mehr).

URL: https://platypus-shirt-shop.vercel.app

---

## Was schief lief (Kreise)

| Aktion | Effekt |
|--------|--------|
| Marketplace-Tee unit-scale + Kamera-Origin | Tee schlechter |
| CLO high-poly OBJ.rar als „Shorts“ | **T-Shirt auf product/2** |
| Kids-Pant / Photo-Map | falsche Form |
| gltf simplify / „perf“ | weniger Detail |
| Service Worker `cache-first` auf `/models/*` | Browser zeigt **alte** GLBs trotz Deploy |

Restore: Original-Tee (`ab8622e9`) + Shorts-Sport white (`ab97dbfa`) + bewährte Tee-Kamera.

---

## Was du im Browser tun musst (einmal)

1. https://platypus-shirt-shop.vercel.app öffnen
2. DevTools → Application → Service Workers → **Unregister**
3. Application → Cache Storage → alles löschen
4. Hard-Refresh (Ctrl+Shift+R)
5. product/1 und product/2 prüfen

Oder: Inkognito-Fenster.

---

## Claude: was du geben darfst / was NICHT

### VERBOTEN (Kreise)

- Mesh tauschen (marketplace, CLO, kids, photo-map)
- Kamera „optimieren“ ohne MD5-Freeze
- Neue GLBs aus Downloads raten
- `SIMPLIFY=1` auf Shop-Meshes
- Docs/Manifest umschreiben und das als „fertig“ verkaufen

### ERLAUBT

- Verify MD5 live vs lokal (siehe Tabelle oben)
- Playwright/Screenshot QA
- **Nach Verify:** `git push` + `vercel --prod` (oder nur push wenn auto-deploy)
- SW-Cache-Version nur bumpen wenn nötig (bereits `platypus-v3-no-glb-cache`)

### Paste für Claude (Copy-Paste)

```
STOP MESH EXPERIMENTS.

FROZEN LIVE ASSETS (do not replace files):
- public/models/shirt-white-v2.glb MD5 ab8622e998d7d2a7232971a364f7ffa6
- public/models/shorts-white-v1.glb MD5 ab97dbfac083ee91472c3996dcc326fc
- Shirt3D camera: tee [0,0.58,0.85]/[0,0.53,0] ; shorts [0,0.05,1.9]/[0,0,0]

TASK (verify + deploy only):
1. md5sum both glbs — must match freeze
2. curl live etag/md5 must match
3. public/sw.js must NOT cache /models/ (network-only)
4. git status clean for intentional changes only
5. git push origin main
6. vercel --prod (or wait for GitHub deploy) until alias platypus-shirt-shop.vercel.app serves same MD5s
7. Write one line: DONE live tee=ab8622e9 shorts=ab97dbfa

FORBIDDEN: any new glb, camera change, make-shop-glb, optimize-glb, ready-for-claude copy into public/models/*.glb
If mesh quality is not enough: STOP and tell Jonny we need a better adult shorts source file — do not invent meshes.
```

---

## Ehrliche Qualitätsgrenze

- **Tee:** bewährtes Shop-Mesh, brauchbar.
- **Shorts:** Adult Sport OBJ, ~17k verts, Form ok, Optik unter Tee.
- Bessere Shorts nur mit **neuem adult Shorts .glb/.obj** (nicht Foto, nicht CLO-Shirt, nicht Kids).

---

## Deine Checkliste online (ohne uns)

1. Cache löschen / Inkognito  
2. `/product/1` — weißes Tee, 360°, kein schwarzes Mesh  
3. `/product/2` — **Shorts-Form** (Beine), **kein T-Shirt**  
4. MD5 im Terminal (optional):  
   `curl -sL https://platypus-shirt-shop.vercel.app/models/shirt-white-v2.glb | md5sum`  
   `curl -sL https://platypus-shirt-shop.vercel.app/models/shorts-white-v1.glb | md5sum`
