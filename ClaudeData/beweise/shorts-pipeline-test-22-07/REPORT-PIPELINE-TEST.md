# SHORTS PIPELINE TEST — 2026-07-23

## 5-Zeilen-Fakten
1. Größe neue GLB: 614 KB (629412 bytes) ≈ 615 KB
2. MD5: `ab97dbfac083ee91472c3996dcc326fc`
3. Ladezeit: GLB-Fetch ~0.01 s (localhost); 360°-Mesh sichtbar ~4.4 s nach Tab-Klick (Playwright); Gesamtseite ~6–19 s cold headless
4. Mesh erkennbar als Hose/Shorts? **Ja** (keine T-Shirt-Form; verts=17487; Screenshots desktop+mobile 360°)
5. Kamera kalibriert/angepasst? **Nein** (Shirt3D.tsx unverändert; Mesh unit-scale origin-centered, Framing ok)

## Pipeline
- Quelle: `/tmp/platypus-heavy-park/.tmp-shorts-sport/extracted/Shorts-Sport/obj/objShorts.obj`
- Befehl: `npm run make-shop-glb -- "<src>" public/models/shorts-white-v1.glb`
- Exit: **0** (Blender weiß + center + unit-scale + gltf-transform OHNE simplify)
- MD5 identisch zu vorherigem Live-Asset (`ab97dbfa…`) — erwartet bei gleicher Quelle
- Backup: `public/models/library/inactive/shorts-white-v1-backup-pipeline-test-20260723.glb` (+ script auto-backup)

## Viewer
- `[Shirt3D] product 2 verts 17487 bbox min≈[-0.48,-0.5,-0.28] max≈[0.48,0.5,0.28]`
- Desktop + Mobile Screenshots: `beweise/shorts-pipeline-test-22-07/*-360-viewer.png`
- Kamera: bestehende shorts camera `[0,0.05,1.9]` / target origin — **nicht geändert**

## Verboten eingehalten
- Kein Shirt3D / pricing / print-spec Change
- Kein manuelles gltf-transform
- Kein Push / Deploy

## Ergebnis
**PIPELINE VALIDIERT: OK**
