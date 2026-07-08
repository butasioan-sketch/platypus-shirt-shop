#!/bin/bash
set -e  # Stoppt bei jedem Fehler

echo "🚀 START: Das Master-Skript übernimmt jetzt komplett."

# 1. Automatisch in das richtige Projektverzeichnis wechseln
PROJECT_DIR="$HOME/Schreibtisch/platypus-shirt-shop"
if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ Projektordner nicht gefunden: $PROJECT_DIR"
  echo "👉 Bitte prüfe den Pfad oder lege den Ordner an."
  exit 1
fi
cd "$PROJECT_DIR"
echo "✅ Erfolgreich gewechselt in: $(pwd)"

# 2. Pfade der echten Shirt-Bilder aus ShirtFlip.tsx extrahieren
FRONT_IMG=$(grep -oP "(?<=frontSrc = ')[^']*" app/components/ShirtFlip.tsx 2>/dev/null || echo "/airfit-front-t.png")
BACK_IMG=$(grep -oP "(?<=backSrc = ')[^']*" app/components/ShirtFlip.tsx 2>/dev/null || echo "/airfit-back-t.png")
echo "✅ Vorderseite: $FRONT_IMG"
echo "✅ Rückseite: $BACK_IMG"

# 3. Shirt3D.tsx komplett mit echten Texturen und optimierten Decals überschreiben
mkdir -p app/components
cat > app/components/Shirt3D.tsx << 'SHIRT3D'
'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Decal, Stage, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ShirtFlip from './ShirtFlip';

interface PrintData { src: string; x: number; y: number; scale: number; }
interface Shirt3DProps {
  frontPrint?: PrintData;
  backPrint?: PrintData;
  shirtColor?: string;
}

const MODEL_PATH = '/models/shirt.glb';

function PrintDecal({ print, front }: { print: PrintData; front: boolean }) {
  const tex = useTexture(print.src);
  tex.anisotropy = 8;
  // OPTIMIERTE POSITION: Hier kannst du Y_SHIFT und SCALE_FACTOR anpassen
  const Y_SHIFT = 0.18;
  const SCALE_FACTOR = 1.0;
  const px = (print.x / 100) * 0.4;
  const py = Y_SHIFT - (print.y / 100) * 0.5;
  const s = SCALE_FACTOR * 0.35 * print.scale;
  return (
    <Decal
      position={[px, py, front ? 0.15 : -0.15]}
      rotation={[0, front ? 0 : Math.PI, 0]}
      scale={[s, s, 0.3]}
    >
      <meshStandardMaterial
        map={tex}
        transparent
        polygonOffset
        polygonOffsetFactor={-1}
        roughness={0.65}
        toneMapped={false}
      />
    </Decal>
  );
}

function ShirtModel({ frontPrint, backPrint, shirtColor = '#ffffff' }: Shirt3DProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
  const frontTex = useTexture('$FRONT_IMG');
  const backTex = useTexture('$BACK_IMG');

  useEffect(() => {
    let found: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if (!found && (o as THREE.Mesh).isMesh) found = o as THREE.Mesh;
    });
    if (found) {
      (found as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        map: frontTex,
        roughness: 0.65,
        metalness: 0,
        color: new THREE.Color(0xffffff),
      });
      setMesh(found);
    }
  }, [scene, frontTex]);

  if (!mesh) return <primitive object={scene} />;
  return (
    <mesh geometry={mesh.geometry} material={mesh.material}>
      {frontPrint && <PrintDecal print={frontPrint} front={true} />}
      {backPrint && <PrintDecal print={backPrint} front={false} />}
    </mesh>
  );
}

export default function Shirt3D(props: Shirt3DProps) {
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(MODEL_PATH, { method: 'HEAD' })
      .then((r) => setModelExists(r.ok))
      .catch(() => setModelExists(false));
  }, []);

  if (modelExists === null) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
        LADE 3D-ANSICHT…
      </div>
    );
  }

  if (!modelExists) {
    return (
      <ShirtFlip
        autoRotateSpeed={0.03}
        idleDelayMs={3000}
        showControls={false}
        showHint={true}
        frontPrint={props.frontPrint ? { src: props.frontPrint.src, x: props.frontPrint.x, y: props.frontPrint.y, scale: props.frontPrint.scale } : undefined}
        backPrint={props.backPrint ? { src: props.backPrint.src, x: props.backPrint.x, y: props.backPrint.y, scale: props.backPrint.scale } : undefined}
      />
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }} dpr={[1, 2]} style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.5} shadows={false}>
          <ShirtModel {...props} />
        </Stage>
        <OrbitControls enablePan={false} minDistance={1.2} maxDistance={4} autoRotate autoRotateSpeed={0.8} />
      </Suspense>
    </Canvas>
  );
}
SHIRT3D
echo "✅ Shirt3D.tsx mit echten Texturen und optimierter Decal-Position überschrieben."

# 4. 3D-Pakete installieren (falls nicht vorhanden)
npm list @react-three/fiber @react-three/drei three || npm install three @react-three/fiber @react-three/drei --legacy-peer-deps

# 5. Build durchführen
echo "⏳ Führe Build aus..."
npm run build

# 6. Deployen
echo "⏳ Deploye auf Vercel..."
./p deploy "final: 3d-shop mit echten texturen und kalibrierten decals"

echo "🎉 ALLES FERTIG! Dein Shop ist jetzt live:"
echo "   https://platypus-shirt-shop.vercel.app/product/1"
echo "   Lade ein Motiv hoch, klicke auf 360° und sieh dein echtes Shirt in 3D."
