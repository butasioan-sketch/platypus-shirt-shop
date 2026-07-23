# PLATYPUS — GLB-Workflow (weißes Blank + Decals)

## Ziel

Jedes Kleidungsstück im Shop:

1. **Weißes** 3D-Mesh (keine bunte Textur — Decals sind Kundenmotiv)
2. Geladen über `app/components/Shirt3D.tsx` → `MODEL_PATHS`
3. Kamera/Orbit kalibriert pro `productId`
4. 2D-Fotos bleiben in `lib/print-spec.ts` (`GARMENT_PROFILES`) für Atelier/PDF

## Tools (lokal eingerichtet)

| Tool | Version / Hinweis |
|------|-------------------|
| Node | v20.x |
| gltf-transform | CLI global (`gltf-transform --version`) |
| Blender | optional, für weiße Material-Export / Retopo |
| npm script | `npm run optimize-glb` |

## 1) Neue GLB optimieren

```bash
cd ~/Schreibtisch/platypus-shirt-shop

# Komprimieren / flatten / join (ohne Draco)
npm run optimize-glb -- ~/Downloads/mein-shorts.glb public/models/shorts-white-v1.glb
```

Nur prüfen:

```bash
gltf-transform inspect public/models/shorts-white-v1.glb
```

**Weiß bleiben:** Wenn die Datei noch Texturen/Farben hat, in Blender:

- Material → Principiel weiß / Base Color `#FFFFFF`
- Texturen entfernen
- Export GLB → dann `optimize-glb`

Oder Python/trimesh (wie bisher bei Shorts-Sport): Vertices zentrieren, scale max-extent≈1, weiße Vertex-Colors, Export.

## 2) Viewer anbinden — `Shirt3D.tsx`

**Einzige Map** (Stand heute):

```ts
const MODEL_PATHS: Record<string, string> = {
  '1': '/models/shirt-white-v2.glb',   // Tee
  '2': '/models/shorts-white-v1.glb',  // Shorts
};
```

### Neues Produkt (z. B. productId `"3"`)

1. Datei: `public/models/foo-white-v1.glb`
2. Eintrag: `'3': '/models/foo-white-v1.glb'`
3. Am Dateiende: `useGLTF.preload('/models/foo-white-v1.glb');`
4. In `getCamera()` Zweig für `"3"` (siehe unten)
5. `lib/products.ts` + `lib/print-spec.ts` `GARMENT_PROFILES['3']` (Fotos, Placement)
6. `lib/pricing.ts` falls neuer Preis

### Bestehendes ersetzen (z. B. bessere Shorts)

1. Backup: `cp public/models/shorts-white-v1.glb public/models/library/inactive/shorts-backup-$(date +%Y%m%d).glb`
2. Neue Datei **gleicher Name** `shorts-white-v1.glb` → **kein** Code-Pfad-Wechsel
3. Nur `getCamera('2')` neu kalibrieren
4. `useGLTF.preload` bleibt

**Wichtig:** `GarmentModel` färbt **alle** Meshes weiß (`makeWhiteMaterial`). Kein separates „Textur-GLB“ für Blank — Decals kommen von `CustomerPrint`.

## 3) Kamera / Scale / Position kalibrieren

Funktion: `getCamera(productId)` in `Shirt3D.tsx`.

| Parameter | Bedeutung |
|-----------|-----------|
| `cameraPos [x,y,z]` | Startposition der Kamera (z = Abstand) |
| `orbitTarget [x,y,z]` | Punkt, um den gedreht wird ≈ **Mesh-Mitte** |
| `minDistance` / `maxDistance` | Zoom-Grenzen — **maxDistance ≥ \|camera z\|** sonst klemmt Orbit (Mesh „unsichtbar“) |
| `fov` | Sichtfeld (Tee 40, Shorts ~38) |

### Praktisches Vorgehen

1. Mesh zentrieren (Python: centroid → 0, max-extent → ~1.0) **oder** Original-Scale behalten und Kamera anpassen.
2. Browser: `/product/2` → Tab **360°**
3. Konsole: Log `[Shirt3D] product 2 … bbox: …` → Mittelpunkt/Größe ablesen
4. `orbitTarget` ≈ bbox-Center
5. `cameraPos` so wählen, dass Mesh den Frame füllt (z vergrößern = weiter weg)
6. `maxDistance` mindestens so groß wie Abstand der Kamera

### Tee-Referenz (funktioniert)

```ts
cameraPos: [0, 0.58, 0.85], orbitTarget: [0, 0.53, 0], min: 0.3, max: 2.5, fov: 40
```

### Shorts (unit-scale Sport, Stand)

```ts
cameraPos: [0, 0.05, 1.85], orbitTarget: [0, 0, 0], min: 0.7, max: 4.0, fov: 38
```

## 4) Lokal testen

```bash
npm run dev
# http://localhost:3000/product/1  und  /product/2
# Tab 360° — Mesh weiß, drehbar, Motiv-Upload = Decal
```

## 5) Regeln

- Mesh **weiß** (Decal-Pipeline)
- Kein Deploy ohne Jonny „deploy“
- Kids-Pant: `library/inactive/DEAD-kids-pant-DO-NOT-USE.glb` — nicht reaktivieren
- Neues Mesh: erst Backup, dann ersetzen, dann Kamera, dann Beweise

## 6) Fab-Kauf (nächste Qualitätsstufe Shorts)

Empfehlung: Men Soccer Athletic Shorts  
https://www.fab.com/listings/f222155f-5896-43cc-9973-18122b61bb65  

→ Download GLB → `optimize-glb` → ersetzen `shorts-white-v1.glb` → Kamera → deploy.
