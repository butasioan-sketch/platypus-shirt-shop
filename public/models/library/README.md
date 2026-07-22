# Model Library (Polyester-first)

## Policy

1. **Nur Polyester-Artikel** mit gesourctem Blank (z. B. B&C TM062, JN387) werden als Shop-Produkt `active: true`.
2. Weitere 3D-Meshes liegen unter **`inactive/`** — optimiert als weiße GLB, **nicht** in `PRODUCTS` / nicht in `MODEL_PATHS` aktiv.
3. Aktivierung erst nach: Blank-Specs + Preis + Print-Profile + Jonny-OK.

## Active (Shop)

| id | productId | path | Mesh-Materialtarget (catalog.json) | Shop-Blank (lib/print-spec.ts, aktuell) |
|----|-----------|------|-------------------------------------|-------------------------------------------|
| shirt-white-v2 | 1 | `/models/shirt-white-v2.glb` | `polyester_bc_tm062` (unveraendert seit Erstellung) | James & Nicholson JN827 (seit 21.07.2026 — nur Text/Preis, Mesh NICHT neu kalibriert) |
| shorts-white-v1 | 2 | `/models/shorts-white-v1.glb` | `polyester_jn387` | James & Nicholson JN387 (Mesh: TurboSquid Kids-Pant-Base, nicht 1:1 modelliert) |

**Wichtig:** Die Tee-GLB-Geometrie/Material wurde nie an JN827 angepasst — sie stammt weiterhin vom
alten TM062-Shooting. Das Mesh ist einfarbig (eine `MeshStandardMaterial`, siehe `Shirt3D.tsx`),
kann daher ohnehin kein Colorblocking zeigen. Siehe REPORT-AUDIT-WEBSHOP-DOWNLOADS-22-07.md.

## Inactive (staged)

| id | path | notes |
|----|------|--------|
| cap-white-v1 | `inactive/cap-white-v1.glb` | Cap — warten auf Polyester-Cap-Blank |
| staged-obj | `inactive/staged-obj.glb` | Großes CLO/OBJ-Pack (Texturen nennen *Cotton Jersey*) — **nicht** aktiv |

## Catalog

`catalog.json` — Maschinen-Index (`active: false` / `materialTarget: polyester_pending`).

## Nicht im Runtime-Bundle

Rohe TurboSquid-ZIPs/RARs (FBX 166MB, Maps, Renders, ZPRJ) bleiben in `~/Downloads` — zu groß und nicht web-optimiert.
