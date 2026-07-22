'use client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, createPortal } from '@react-three/fiber';
import { OrbitControls, useGLTF, Decal, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import ShirtFlip from './ShirtFlip';
import StaticShirtPreview from './StaticShirtPreview';
import { getDecalDimensions, getDecalPosition } from '@/lib/print-position';
import { getViewerAspect } from '@/lib/print-spec';

interface PrintData { src: string; x: number; y: number; scale: number; }
interface Shirt3DProps {
  /** Mehrere Ebenen pro Seite (freies Multi-Bild/Text-Atelier) — Array-Reihenfolge = Z-Order. */
  frontPrint?: PrintData[];
  backPrint?: PrintData[];
  shirtColor?: string;
  enableTouch?: boolean;
  /** static = statisches Bild (Startseite), flip = 2D-Editor-Fallback (Design-Studio) */
  fallback?: 'static' | 'flip';
  /** Foto-Quellen für den Fallback (kein GLB-Modell vorhanden) — default: Shirt-Fotos */
  frontSrc?: string;
  backSrc?: string;
  productId?: string;
}

/** GLB pro productId — gleiche 3D-Pipeline (Decals + manuelles Orbit) für Tee und Shorts. */
const MODEL_PATHS: Record<string, string> = {
  '1': '/models/shirt-white-v2.glb',
  '2': '/models/shorts-white-v1.glb',
};

function getModelPath(productId?: string): string | null {
  const id = productId || '1';
  return MODEL_PATHS[id] ?? null;
}

// === KUNDENMOTIV ALS DECAL ===
// Position wird dynamisch aus der Bounding-Box des Garment-Meshes abgeleitet.
// print.x / print.y: -50..+50 (% aus 2D-Editor); print.scale: Multiplikator — wie 2D-Editor.
function CustomerPrint({ mesh, print, front, productId, layerIndex = 0 }:
  { mesh: THREE.Mesh; print: PrintData; front: boolean; productId: string; layerIndex?: number }) {
  const tex = useTexture(print.src);
  tex.anisotropy = 8;

  const { pos, size } = useMemo(() => {
    mesh.geometry.computeBoundingBox();
    const bb = mesh.geometry.boundingBox as THREE.Box3;
    const c = new THREE.Vector3(); bb.getCenter(c);
    const s = new THREE.Vector3(); bb.getSize(s);
    const side = front ? 'front' : 'back';
    const transform = { scale: print.scale || 1, x: print.x, y: print.y };
    const { w, h } = getDecalDimensions({ x: s.x, y: s.y, z: s.z }, side, transform, productId);
    const position = getDecalPosition(
      { x: c.x, y: c.y, z: c.z },
      { x: s.x, y: s.y, z: s.z },
      side,
      transform,
      front,
      productId,
    );
    // Mehrere Ebenen auf derselben Seite: minimale Z-Staffelung gegen Z-Fighting
    // zwischen uebereinanderliegenden Decals (Reihenfolge = Stapel, wie im Editor).
    position[2] += (front ? 1 : -1) * layerIndex * 0.0015;
    return {
      pos: position,
      size: [w, h, Math.max(s.z * 1.5, 0.1)] as [number, number, number],
    };
  }, [mesh, print.x, print.y, print.scale, front, productId, layerIndex]);
  return (
    <Decal position={pos} rotation={[0, front ? 0 : Math.PI, 0]} scale={size}>
      <meshStandardMaterial
        map={tex}
        transparent
        polygonOffset
        polygonOffsetFactor={-2 - layerIndex}
        depthWrite={false}
        roughness={0.6}
        toneMapped={false}
      />
    </Decal>
  );
}

// === GARMENT-MODELL (Tee oder Shorts — modelPath) ===
function GarmentModel({
  modelPath,
  productId,
  frontPrint,
  backPrint,
  shirtColor = '#ffffff',
}: Shirt3DProps & { modelPath: string; productId: string }) {
  const { scene } = useGLTF(modelPath);
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    let best: THREE.Mesh | null = null;
    let bestCount = 0;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.geometry) {
        const n = m.geometry.attributes.position?.count ?? 0;
        if (n > bestCount) { best = m; bestCount = n; }
      }
    });
    if (best) {
      const b = best as THREE.Mesh;
      // Marketplace-OBJ/GLB-Konvertierungen (22.07.2026 weißes Paar, wie zuvor der
      // Shorts-Platzhalter) liefern oft keine NORMAL-Attribute — ohne die rendert
      // MeshStandardMaterial das Mesh schwarz/unbeleuchtet statt weiss.
      if (!b.geometry.attributes.normal) {
        b.geometry.computeVertexNormals();
      }
      b.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(shirtColor),
        roughness: 0.65,
        metalness: 0,
        // Beide aktiven Meshes (seit 22.07.2026) sind frisch aus Marketplace-OBJ/GLB
        // konvertiert, Winding-Richtung nicht verifiziert — DoubleSide fuer beide als
        // Absicherung, damit kein Mesh durch Backface-Culling unsichtbar wird.
        side: THREE.DoubleSide,
      });
      b.geometry.computeBoundingBox();
      console.log('[Shirt3D] product', productId, 'mesh:', b.name,
        'bbox:', JSON.stringify(b.geometry.boundingBox));
      setMesh(b);
    }
  }, [scene, shirtColor, productId]);
  return (
    <>
      <primitive object={scene} />
      {mesh && createPortal(
        <>
          {(frontPrint || []).map((p, i) => (
            <CustomerPrint key={`front-${i}`} mesh={mesh} print={p} front productId={productId} layerIndex={i} />
          ))}
          {(backPrint || []).map((p, i) => (
            <CustomerPrint key={`back-${i}`} mesh={mesh} print={p} front={false} productId={productId} layerIndex={i} />
          ))}
        </>,
        mesh
      )}
    </>
  );
}

/** Sichtbarer Lade-Platzhalter waehrend das GLB geladen/geparst wird — vorher
 *  war hier `fallback={null}` (nichts), was auf dem dunklen Seiten-Hintergrund wie
 *  ein "kaputter schwarzer Kasten" wirkte statt wie ein Ladezustand. `Html fullscreen`
 *  (drei) ueberlagert die Canvas-Flaeche mit echtem DOM statt einem Three.js-Objekt,
 *  da ein <Suspense> innerhalb von <Canvas> nur R3F-renderbare Fallbacks akzeptiert. */
function ModelLoadingSkeleton({ productId }: { productId: string }) {
  return (
    <Html fullscreen>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '55%', aspectRatio: getViewerAspect(productId), borderRadius: '16px',
          background: 'rgba(255,255,255,0.06)', animation: 'plt-glb-pulse 1.3s ease-in-out infinite',
        }} />
      </div>
    </Html>
  );
}

// === HAUPTKOMPONENTE ===
export default function Shirt3D({
  enableTouch = true,
  fallback = 'flip',
  ...props
}: Shirt3DProps) {
  const productId = props.productId || '1';
  const modelPath = getModelPath(productId);

  if (!modelPath) {
    if (fallback === 'static') {
      return <StaticShirtPreview shadow="0 12px 32px rgba(0,0,0,0.55)" />;
    }
    return (
      <ShirtFlip
        frontPrint={props.frontPrint}
        backPrint={props.backPrint}
        productId={props.productId}
        {...(props.frontSrc ? { frontSrc: props.frontSrc } : {})}
        {...(props.backSrc ? { backSrc: props.backSrc } : {})}
        showControls={false}
        showHint={false}
      />
    );
  }

  // Kamera-Kalibrierung fuer das weisse GLB-Paar (22.07.2026, tee-t_shirt-white-v1 /
  // shorts-sport-white-v1) — beide Meshes sind zentriert, max-extent auf 1.0 skaliert
  // (per gltf-transform inspect vermessen), anders als die alten Meshes (Tee war winzig,
  // max-extent ~0.28; Shorts sass auf y=0 statt zentriert). orbitTarget = jeweiliger
  // Bounding-Box-Mittelpunkt der neuen Meshes, nicht mehr die alten Werte.
  // WICHTIG: maxDistance muss >= |cameraPos| sein — sonst klemmt OrbitControls
  // die Kamera und das GLB wirkt „kaputt“ / unsichtbar.
  const isShorts = productId === '2';
  const cameraPos: [number, number, number] = isShorts ? [0, -0.15, 2.15] : [0, -0.04, 1.95];
  const orbitTarget: [number, number, number] = isShorts ? [0, -0.18, 0] : [0, -0.04, 0];
  const minDistance = isShorts ? 0.9 : 0.8;
  const maxDistance = isShorts ? 4.5 : 4.0;

  return (
    <Canvas
      camera={{ position: cameraPos, fov: isShorts ? 35 : 40 }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <Suspense fallback={<ModelLoadingSkeleton productId={productId} />}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 3]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <GarmentModel {...props} modelPath={modelPath} productId={productId} />
        <OrbitControls
          enablePan={false}
          minDistance={minDistance}
          maxDistance={maxDistance}
          autoRotate={false}
          target={orbitTarget}
          enableRotate={enableTouch}
          enableZoom={enableTouch}
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/models/shirt-white-v2.glb');
useGLTF.preload('/models/shorts-white-v1.glb');
