# Shorts mesh source (aktuell)

## Active (22.07.2026 night) — Adult sport shorts, TEE-PIPELINE

| | |
|--|--|
| File | `public/models/shorts-white-v1.glb` (~1.0 MB) |
| Source | `~/Downloads/Shorts-SportOBJ.rar` → `objShorts.obj` |
| Process | Python: single mesh, white, centered, max-extent≈1, normals |
| Architecture | **Same as Tee**: pure white MeshStandardMaterial + customer Decals |
| NOT | Kids Pant, NOT photo-atlas stretch on baby mesh |

### Why previous attempts failed

1. **Kids Pant** (TurboSquid 1996470) — wrong silhouette (child/jogger), never equals Tee quality.
2. **Photo-map on Kids Pant** — committed as `c684fb7` but often **not deployed**; even live it cannot fix kids proportions.
3. **Sport mesh first try** — multi-mesh + code painted only largest → grey patches; then rolled back instead of fixing code and reusing sport mesh.
4. **Process** — half-finished deploys + mesh swaps without one architecture = circle.

### Same as Tee now

- White blank 3D for orbit/decals
- Real product look in **2D photos** (`airfit-shorts-front/back.png`)
- 360 = position preview (honest copy already in UI)

### Backups

- `library/inactive/shorts-white-kids-pant-backup.glb`
- `library/inactive/shorts-white-v1-before-photo-map.glb`
- `library/ready-for-claude/shorts-adult-sport-white-v2.glb` (same as active)

### License

Shorts-Sport asset: confirm commercial rights before sales.
