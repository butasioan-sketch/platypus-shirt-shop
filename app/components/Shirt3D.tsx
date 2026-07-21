'use client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, createPortal } from '@react-three/fiber';
import { OrbitControls, useGLTF, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ShirtFlip from './ShirtFlip';
import StaticShirtPreview from './StaticShirtPreview';
import { getDecalDimensions, getDecalPosition } from '@/lib/print-position';

interface PrintData { src: string; x: number; y: number; scale: number; }
interface Shirt3DProps {
  frontPrint?: PrintData;
  backPrint?: PrintData;
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
function CustomerPrint({ mesh, print, front, productId }:
  { mesh: THREE.Mesh; print: PrintData; front: boolean; productId: string }) {
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
    return {
      pos: position,
      size: [w, h, Math.max(s.z * 1.5, 0.1)] as [number, number, number],
    };
  }, [mesh, print.x, print.y, print.scale, front, productId]);
  return (
    <Decal position={pos} rotation={[0, front ? 0 : Math.PI, 0]} scale={size}>
      <meshStandardMaterial
        map={tex}
        transparent
        polygonOffset
        polygonOffsetFactor={-2}
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
      b.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(shirtColor),
        roughness: 0.65,
        metalness: 0,
        // Shorts-Platzhalter ist prozedural erzeugt (Ring-Loft) — DoubleSide als
        // Absicherung gegen Winding-Fehler, ohne Risiko fuer das geprüfte Tee-GLB.
        side: productId === '2' ? THREE.DoubleSide : THREE.FrontSide,
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
          {frontPrint && <CustomerPrint mesh={mesh} print={frontPrint} front productId={productId} />}
          {backPrint && <CustomerPrint mesh={mesh} print={backPrint} front={false} productId={productId} />}
        </>,
        mesh
      )}
    </>
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
  const supportsModel = Boolean(modelPath);
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supportsModel || !modelPath) { setModelExists(false); return; }
    fetch(modelPath, { method: 'HEAD' })
      .then((r) => setModelExists(r.ok))
      .catch(() => setModelExists(false));
  }, [supportsModel, modelPath]);

  if (modelExists === null || !modelExists || !modelPath) {
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

  // Shorts: Kamera auf Mesh-Mitte (y 0.03..0.98) zentriert, weiter zurück damit
  // Bund + beide Beine vollstaendig im Frame sind; Tee: bisherige Werte unveraendert.
  const isShorts = productId === '2';
  const cameraPos: [number, number, number] = isShorts ? [0, 0.5, 1.6] : [0, 0.58, 0.85];
  const orbitTarget: [number, number, number] = isShorts ? [0, 0.5, 0] : [0, 0.53, 0];

  return (
    <Canvas
      camera={{ position: cameraPos, fov: 40 }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 3]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <GarmentModel {...props} modelPath={modelPath} productId={productId} />
        <OrbitControls
          enablePan={false}
          minDistance={0.3}
          maxDistance={2.5}
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
