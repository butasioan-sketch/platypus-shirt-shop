# Ready for Claude — White GLB system (22.07.2026)

## Jonny parameters (verbindlich)

| Parameter | Wert |
|-----------|------|
| Farbe 360° | **komplett weiß** |
| Motiv | nur Kunden-Decal (Bild/Text) |
| Blank real | Polyester unifarben weiß, **≥ 140 g/m²** (Kauf folgt) |
| Seitenstreifen im Mesh | **nicht nötig** |
| Priorität | **360° überzeugt Kunden** |

## Was Grok aktiviert hat (lokal, evtl. noch nicht deployed)

| productId | Live-Pfad | Quelle | Status |
|-----------|-----------|--------|--------|
| `1` Tee | `public/models/shirt-white-v2.glb` | **Proven backup** (MD5 `ab8622e9…`) | stabil |
| `2` Shorts | `public/models/shorts-white-v1.glb` | **Kids-Pant backup** (MD5 `ba15a49d…`) | stabil (besser als Sport-Schrott) |

Marketplace-„Schrott“-Meshes (t_shirt / sport) liegen unter `library/inactive/*-marketplace-schrott.glb` bzw. ready-for-claude als A/B — **nicht** aktiv.

## Pipeline-Fix in `Shirt3D.tsx` (Grok)

1. **Alle** Meshes im GLB weiß (nicht nur größtes)  
2. Normalen berechnen wenn fehlend  
3. Besseres Licht für weiße Textilien  
4. Kamera **zurück** auf stabile Werte (Tee/Shorts proven)  
5. Loading-Skeleton + preload bleiben  

## Optional A/B (noch inactive / ready)

| Datei | Nutzen |
|-------|--------|
| `tee-marketplace-joe-white.glb` | nur testen wenn stabiles Tee unbefriedigend |
| `tee-marketplace-tshirt-white.glb` | oft schlechter (flach) |
| `shorts-marketplace-sport-white.glb` | oft schlechter (Kompression/Schritt) |

## Claude-Aufgabe danach

1. Diff `Shirt3D.tsx` prüfen, Build, Playwright 360°  
2. Commit + Report  
3. Deploy nur nach Jonny „deploy“  
4. **Keine** Marketplace-Meshes reaktivieren ohne visuelle Jonny-OK  

## Lizenz

Marketplace-Assets: kommerzielle Rechte vor Verkauf klären. Stable backups = bereits im Shop genutzte Assets.
