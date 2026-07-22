# Model Library (Polyester-first)

## Policy

1. **Nur Polyester-Artikel** mit gesourctem Blank (z. B. B&C TM062, JN387) werden als Shop-Produkt `active: true`.
2. Weitere 3D-Meshes liegen unter **`inactive/`** — optimiert als weiße GLB, **nicht** in `PRODUCTS` / nicht in `MODEL_PATHS` aktiv.
3. Aktivierung erst nach: Blank-Specs + Preis + Print-Profile + Jonny-OK.

## Active (Shop) — Stand 22.07.2026, "proven backups" (Rollback nach GLB-System-Reparatur)

| id | productId | path | Quelle | Shop-Blank (lib/print-spec.ts) |
|----|-----------|------|--------|-------------------------------------------|
| shirt-white-v2-backup | 1 | `/models/shirt-white-v2.glb` | Bewährtes Shop-Asset (MD5 `ab8622e9…`) | James & Nicholson JN827 — Text/Preis, Mesh nicht 1:1 modelliert |
| shorts-white-kids-pant-backup | 2 | `/models/shorts-white-v1.glb` | TurboSquid Kids Pant Design 1996470 (MD5 `ba15a49d…`) | James & Nicholson JN387 — Text/Preis, Mesh nicht 1:1 modelliert |

**Was passiert ist (22.07.2026, ein Tag, drei Zustände):**
1. Vormittags: neues weißes Marketplace-Paar aktiviert (`tee-t_shirt-white-v1` / `shorts-sport-white-v1`), lokal + live per Playwright geprüft — sah lokal einwandfrei weiß aus, deployed.
2. Danach: Jonny/Grok stellten fest, dass die Meshes **mehrere Sub-Meshes** enthalten. Der damalige `Shirt3D.tsx`-Code färbte nur das **größte** Sub-Mesh weiß (`if (n > bestCount)`-Logik) — die übrigen Sub-Meshes blieben grau/texturiert ("Schrott"-Look), was im lokalen Single-Primitive-Test nicht auffiel.
3. Rollback: Grok hat `Shirt3D.tsx` repariert (**jedes** Mesh im Scene-Graph wird jetzt weiß gefärbt + bekommt Normalen falls nötig, siehe Code-Kommentar dort) und gleichzeitig die aktiven GLB-Pfade zurück auf die bewährten Backups gesetzt, statt das gefixte Marketplace-Paar erneut zu riskieren.

**Wichtig:** Beide aktiven Meshes sind weiterhin nicht 1:1 an JN827/JN387 kalibriert — das war nie das Ziel dieses Tages, sondern ein zuverlässiger weißer 360°-Eindruck. Siehe REPORT-GLB-SYSTEM-REPAIR.md (und REPORT-WHITE-GLB-PAIR-22-07.md für den zwischenzeitlichen Marketplace-Versuch).

## Inactive — Marketplace-Paar (reaktivierbar, aber nicht ohne Jonny-OK)

| id | path | Grund inaktiv |
|----|------|---------------------|
| tee-t_shirt-white-v1 | `inactive/tee-t_shirt-white-v1.glb` (+ Duplikat `shirt-white-v2-marketplace-schrott.glb`, identische MD5) | War kurz live, Multi-Mesh-Weiß-Bug (siehe oben) — Code-Fix existiert jetzt, aber nicht gegen dieses Asset erneut getestet |
| shorts-sport-white-v1 | `inactive/shorts-sport-white-v1.glb` (+ Duplikat `shorts-white-v1-marketplace-schrott.glb`, identische MD5) | Gleicher Grund, gleichzeitig zurückgerollt |
| tee-joe-white-v1 | `inactive/tee-joe-white-v1.glb` | Nie aktiviert — gestagter Fallback, schwerer (6,7 MB / ~204k Verts) als tee-t_shirt-white-v1 |

Die beiden `-marketplace-schrott`-Dateien sind reine Umbenennungen der ursprünglichen `tee-t_shirt-white-v1`/`shorts-sport-white-v1`-Dateien (per MD5 verifiziert identisch) — redundant, aber harmlos, nicht gelöscht ohne Jonny-Freigabe.

## Staging-Ordner: `ready-for-claude/`

Kuratierter Grok-Ordner mit A/B-Kandidaten (`tee-stable-white-v2.glb`, `shorts-stable-white-v1.glb`, `tee-marketplace-*-white.glb`, `shorts-marketplace-sport-white.glb`) + `READY-MANIFEST.json`. **Nicht** in `MODEL_PATHS` verdrahtet, dient nur als Übergabe-/Vergleichsablage zwischen Grok und Claude. Das Manifest schlägt eigene Kamera-Werte vor, die von den tatsächlich im Code verwendeten abweichen — nicht übernommen, da die aktuelle Kalibrierung per Playwright bereits als gut befunden wurde.

## Inactive (staged, unverändert)

| id | path | notes |
|----|------|--------|
| cap-white-v1 | `inactive/cap-white-v1.glb` | Cap — warten auf Polyester-Cap-Blank |
| staged-obj | `inactive/staged-obj.glb` | Großes CLO/OBJ-Pack (Texturen nennen *Cotton Jersey*) — **nicht** aktiv |

## Catalog

`catalog.json` — Maschinen-Index, inkl. `rollback_22-07`-Feld mit der obigen Historie.

## Nicht im Runtime-Bundle

Rohe TurboSquid-ZIPs/RARs (FBX 166MB, Maps, Renders, ZPRJ) bleiben in `~/Downloads` — zu groß und nicht web-optimiert. Die rohe Grok-Konvertierungs-Workdir `.tmp-shorts-sport/` (95 MB, farbige Marketplace-Texturen) ist per `.gitignore` vom Repo ausgeschlossen.

## Achtung: shirt-white-v2.glb nicht re-exportieren

Ein früherer Versuch, diese Datei durch ein GLB-Tool (z. B. trimesh/gltf-transform Re-Export) zu
"optimieren", hat den Root-Transform der Scene zerstört. Reine **Lese**-Operationen (`gltf-transform
inspect`) sind unproblematisch, aber kein Re-Export/Re-Save dieser spezifischen Datei ohne Not.
