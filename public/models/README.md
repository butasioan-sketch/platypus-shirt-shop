# 3D-Modelle (Garment)

**Workflow (Optimieren, Einbinden, Kamera kalibrieren):** siehe [`GLB-WORKFLOW.md`](./GLB-WORKFLOW.md) — dort auch `npm run optimize-glb`, Code-Stellen in `Shirt3D.tsx` und die Regeln (weiß bleiben, Kids-Pant nicht reaktivieren).

| Datei | productId | Hinweis |
|-------|-----------|---------|
| `shirt-white-v2.glb` | `1` (Tee) | Produktions-Referenz |
| `shirt.glb` | — | älteres Tee-Backup |
| `shorts-white-v1.glb` | `2` (Shorts) | Adult-Sport-Mesh (Shorts-SportOBJ), nicht 1:1 JN387 — Kids-Pant ist retired (`library/inactive/DEAD-kids-pant-DO-NOT-USE.glb`) |

Pipeline: `app/components/Shirt3D.tsx` → `MODEL_PATHS` pro productId, Decals, Orbit manuell. Maschinen-Index aller Assets (aktiv + inaktiv): `library/catalog.json`.
