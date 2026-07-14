'use client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, createPortal } from '@react-three/fiber';
import { OrbitControls, useGLTF, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ShirtFlip from './ShirtFlip';
import StaticShirtPreview from './StaticShirtPreview';
import { VIEWER_DEFAULTS } from '@/lib/print-spec';
import { getDecalDimensions, getDecalPosition } from '@/lib/print-position';

interface PrintData { src: string; x: number; y: number; scale: number; }
interface Shirt3DProps {
  frontPrint?: PrintData;
  backPrint?: PrintData;
  shirtColor?: string;
  enableTouch?: boolean;
  autoRotateSpeed?: number;
  /** static = statisches Bild (Startseite), flip = 2D-Editor-Fallback (Design-Studio) */
  fallback?: 'static' | 'flip';
}

const MODEL_PATH = '/models/shirt-white-v2.glb';

// === KUNDENMOTIV ALS DECAL ===
// Position wird dynamisch aus der Bounding-Box des Shirt-Meshes abgeleitet.
// print.x / print.y: -20..+20 (% aus 2D-Editor, 0 = Mitte, y+ = nach unten)
// print.scale: Multiplikator (Slider, 1 = 100 %)
function CustomerPrint({ mesh, print, front }:
  { mesh: THREE.Mesh; print: PrintData; front: boolean }) {
  const tex = useTexture(print.src);
  tex.anisotropy = 8;

  const { pos, size } = useMemo(() => {
    mesh.geometry.computeBoundingBox();
    const bb = mesh.geometry.boundingBox as THREE.Box3;
    const c = new THREE.Vector3(); bb.getCenter(c);
    const s = new THREE.Vector3(); bb.getSize(s);
    const { w, h } = getDecalDimensions({ x: s.x, y: s.y, z: s.z }, print.scale || 1);
    const position = getDecalPosition(
      { x: c.x, y: c.y, z: c.z },
      { x: s.x, y: s.y, z: s.z },
      { scale: print.scale || 1, x: print.x, y: print.y },
      front,
    );
    return {
      pos: position,
      size: [w, h, Math.max(s.z * 1.5, 0.1)] as [number, number, number],
    };
  }, [mesh, print.x, print.y, print.scale, front]);
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

// === SHIRT-MODELL ===
function ShirtModel({ frontPrint, backPrint, shirtColor = '#ffffff' }: Shirt3DProps) {
  const { scene } = useGLTF(MODEL_PATH);
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
      });
      b.geometry.computeBoundingBox();
      console.log('[Shirt3D] Decal-Mesh:', b.name,
        'bbox:', JSON.stringify(b.geometry.boundingBox));
      setMesh(b);
    }
  }, [scene, shirtColor]);
  return (
    <>
      <primitive object={scene} />
      {mesh && createPortal(
        <>
          {frontPrint && <CustomerPrint mesh={mesh} print={frontPrint} front />}
          {backPrint && <CustomerPrint mesh={mesh} print={backPrint} front={false} />}
        </>,
        mesh
      )}
    </>
  );
}

// === HAUPTKOMPONENTE ===
export default function Shirt3D({
  enableTouch = true,
  autoRotateSpeed = VIEWER_DEFAULTS.autoRotateSpeed3D,
  fallback = 'flip',
  ...props
}: Shirt3DProps) {
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(MODEL_PATH, { method: 'HEAD' })
      .then((r) => setModelExists(r.ok))
      .catch(() => setModelExists(false));
  }, []);

  if (modelExists === null || !modelExists) {
    if (fallback === 'static') {
      return <StaticShirtPreview shadow="0 12px 32px rgba(0,0,0,0.55)" />;
    }
    return (
      <ShirtFlip
        frontPrint={props.frontPrint}
        backPrint={props.backPrint}
        autoRotateSpeed={VIEWER_DEFAULTS.autoRotateSpeed2D}
        idleDelayMs={VIEWER_DEFAULTS.idleDelayMs}
        showControls={false}
        showHint={false}
      />
    );
  }
  return (
    <Canvas
      camera={{ position: [0, 0.58, 0.85], fov: 40 }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 3]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <ShirtModel {...props} />
        <OrbitControls
          enablePan={false}
          minDistance={0.3}
          maxDistance={2}
          autoRotate
          autoRotateSpeed={autoRotateSpeed}
          target={[0, 0.53, 0]}
          enableRotate={enableTouch}
          enableZoom={enableTouch}
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);
