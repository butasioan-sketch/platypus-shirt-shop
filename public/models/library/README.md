# Model Library (Polyester-first)

## Policy

1. **Nur Polyester-Artikel** mit gesourctem Blank (z. B. B&C TM062, JN387) werden als Shop-Produkt `active: true`.
2. Weitere 3D-Meshes liegen unter **`inactive/`** — optimiert als weiße GLB, **nicht** in `PRODUCTS` / nicht in `MODEL_PATHS` aktiv.
3. Aktivierung erst nach: Blank-Specs + Preis + Print-Profile + Jonny-OK.

## Active (Shop) — Stand 22.07.2026, "weißes GLB-Paar"

| id | productId | path | Quelle | Shop-Blank (lib/print-spec.ts) |
|----|-----------|------|--------|-------------------------------------------|
| tee-t_shirt-white-v1 | 1 | `/models/shirt-white-v2.glb` | Downloads/t_shirt.glb, weiß konvertiert (Grok 22.07.2026) | James & Nicholson JN827 — generische Tee-Silhouette, nicht 1:1 modelliert |
| shorts-sport-white-v1 | 2 | `/models/shorts-white-v1.glb` | Downloads/Shorts-SportOBJ.rar, weiß konvertiert (Grok 22.07.2026) | James & Nicholson JN387 — generische Sport-Shorts-Silhouette, nicht 1:1 modelliert |

**Wichtig:** Beide Meshes sind rein weiß (kein Colorblocking, keine Logos/Texturen aus den
Marketplace-Packs). Das Material ist eine einzige `MeshStandardMaterial` in `Shirt3D.tsx` —
das war schon vorher so und bleibt so. Weder Tee- noch Shorts-Mesh sind geometrisch am
jeweiligen realen Blank (JN827/JN387) kalibriert — beide sind visuelle Näherungen, ausgewählt
weil sie in 360° überzeugender/erwachsener wirken als die vorherigen Meshes (winziges TM062-Tee-Mesh,
Kids-Pant-Shorts-Mesh). Siehe REPORT-WHITE-GLB-PAIR-22-07.md.

## Rollback / Vorgänger (inactive, Backup)

| id | path | Grund für Ablösung |
|----|------|---------------------|
| shirt-white-v2-backup | `inactive/shirt-white-v2-backup.glb` | War extrem klein skaliert (max-extent ~0.28 vs. jetzt 1.0), Materialtarget TM062 nie an JN827 angepasst |
| shorts-white-kids-pant-backup | `inactive/shorts-white-kids-pant-backup.glb` | TurboSquid "Kids Pant" — sichtbar Kinder-Silhouette, nicht Sport-Shorts |
| tee-joe-white-v1 | `inactive/tee-joe-white-v1.glb` | Staged Fallback falls `tee-t_shirt-white-v1` in 360°-QA nicht überzeugt (schwerer: 6,7 MB / ~204k Verts) |

## Inactive (staged)

| id | path | notes |
|----|------|--------|
| cap-white-v1 | `inactive/cap-white-v1.glb` | Cap — warten auf Polyester-Cap-Blank |
| staged-obj | `inactive/staged-obj.glb` | Großes CLO/OBJ-Pack (Texturen nennen *Cotton Jersey*) — **nicht** aktiv |

## Catalog

`catalog.json` — Maschinen-Index (`active: false` / `materialTarget: polyester_pending`).

## Nicht im Runtime-Bundle

Rohe TurboSquid-ZIPs/RARs (FBX 166MB, Maps, Renders, ZPRJ) bleiben in `~/Downloads` — zu groß und nicht web-optimiert.
