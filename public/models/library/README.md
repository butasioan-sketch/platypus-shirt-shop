# Model Library (Polyester-first)

## Policy

1. **Nur Polyester-Artikel** mit gesourctem Blank (z. B. B&C TM062, JN387) werden als Shop-Produkt `active: true`.
2. Weitere 3D-Meshes liegen unter **`inactive/`** — optimiert als weiße GLB, **nicht** in `PRODUCTS` / nicht in `MODEL_PATHS` aktiv.
3. Aktivierung erst nach: Blank-Specs + Preis + Print-Profile + Jonny-OK.

## Active (Shop)

| id | productId | path | blank |
|----|-----------|------|-------|
| shirt-white-v2 | 1 | `/models/shirt-white-v2.glb` | Polyester B&C TM062 |
| shorts-white-v1 | 2 | `/models/shorts-white-v1.glb` | Polyester JN387 (Mesh: TurboSquid kids pant base) |

## Inactive (staged)

| id | path | notes |
|----|------|--------|
| cap-white-v1 | `inactive/cap-white-v1.glb` | Cap — warten auf Polyester-Cap-Blank |
| staged-obj | `inactive/staged-obj.glb` | Großes CLO/OBJ-Pack (Texturen nennen *Cotton Jersey*) — **nicht** aktiv |

## Catalog

`catalog.json` — Maschinen-Index (`active: false` / `materialTarget: polyester_pending`).

## Nicht im Runtime-Bundle

Rohe TurboSquid-ZIPs/RARs (FBX 166MB, Maps, Renders, ZPRJ) bleiben in `~/Downloads` — zu groß und nicht web-optimiert.
