# Shorts mesh source

## Photo map (22.07.2026 evening)

- Product photos `public/airfit-shorts-front.png` + `airfit-shorts-back.png` baked as atlas
  `public/models/shorts-photo-atlas.png` (left=front, right=back).
- Mesh `shorts-white-v1.glb` has planar front/back UVs (Python) so 360° looks like the shop photo.
- `Shirt3D` applies atlas as `map` for productId `2` (not pure white).
- Backup pre-photo: `library/inactive/shorts-white-v1-before-photo-map.glb`
- Limit: mesh shape is still Kids-Pant geometry — photo is projected, not a 1:1 scan.

**Claude QA finding (22.07.2026, see REPORT-SHORTS-PHOTO-MAP.md for full evidence):** technically working (atlas loads 200, UVs present, material.map set, 0 console errors), but the visual result does not clearly read as "shop photo look" yet:
- Front-on 360° view: pixel-sampled interior of the leg is near-flat (183–199 grayscale range, no piping visible) — reads as plain white at normal viewing distance.
- 3/4 side-angle view: visible texture smear/ghosting artifact near the side seam (not clean fabric detail).
- Recommend reviewing the screenshots in `beweise/shorts-photo-map-22-07/` closely (especially `08-diag-side-view-ARTIFACT.png`) before deploying — the improvement over pure white may not be as visible live as intended.

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
