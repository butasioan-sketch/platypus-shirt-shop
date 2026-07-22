# Shorts mesh source

## Active again since 22.07.2026 (rollback): TurboSquid "Kids Pant Design" (as shorts-white-v1.glb)

- Product: **Kids Pant Design** (TurboSquid ID 1996470), vendor digitalfashionwear.com
- 76 305 verts / 141 114 faces, **3 525 836 bytes**
- Visually a kids'-pants base, not a sport-shorts silhouette — known limitation, kept because it renders reliably (every sub-mesh white, no grey patches, proven in production before)
- License: TurboSquid free asset — confirm commercial rights before live sales

## Reverted same-day: shorts-sport-white-v1 (was live for a few hours on 22.07.2026)

- Source: `~/Downloads/Shorts-SportOBJ.rar` → `obj/objShorts.obj` (~2.7 MB), converted white via Grok
- 22 107 verts / 34 784 faces, centered, max-extent scaled to 1.0 — 772 132 bytes
- **Why reverted:** the mesh has multiple primitives/sub-meshes; the Shirt3D.tsx code at the time only painted the LARGEST sub-mesh white via `MeshStandardMaterial` — other sub-meshes stayed grey/textured once deployed live ("Schrott"-Look), which wasn't visible in the local single-primitive smoke test before deploy.
- Root cause is now fixed in `Shirt3D.tsx` (every mesh in `scene.traverse` gets painted + gets normals if missing) — but Jonny/Grok chose to keep the proven Kids-Pant backup active rather than re-risk this asset. Do **not** reactivate without a visual Jonny-OK.
- Staged at `public/models/library/inactive/shorts-sport-white-v1.glb` (also duplicated as `shorts-white-v1-marketplace-schrott.glb`, identical MD5 — redundant copy from the revert pass, harmless)
- License: confirm commercial rights before live sales
