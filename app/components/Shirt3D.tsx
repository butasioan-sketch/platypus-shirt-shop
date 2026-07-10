'use client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, createPortal } from '@react-three/fiber';
import { OrbitControls, useGLTF, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ShirtFlip from './ShirtFlip';

interface PrintData { src: string; x: number; y: number; scale: number; }
interface Shirt3DProps {
  frontPrint?: PrintData;
  backPrint?: PrintData;
  shirtColor?: string;
  enableTouch?: boolean;
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
    const chestY = c.y + s.y * 0.08;             // Brusthoehe: knapp ueber Mitte
    const dirX = front ? 1 : -1;                 // Rueckseite: X spiegeln
    const x = c.x + dirX * (print.x / 100) * s.x;
    const y = chestY - (print.y / 100) * s.y;
    const z = c.z + (front ? 1 : -1) * (s.z / 2);
    const w = s.x * 0.5 * (print.scale || 1);    // Basis = 50 % Shirtbreite
    return {
      pos: [x, y, z] as [number, number, number],
      size: [w, w, Math.max(s.z * 1.5, 0.1)] as [number, number, number],
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
export default function Shirt3D({ enableTouch = true, ...props }: Shirt3DProps) {
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(MODEL_PATH, { method: 'HEAD' })
      .then((r) => setModelExists(r.ok))
      .catch(() => setModelExists(false));
  }, []);

  if (modelExists === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', color: '#888', fontSize: 13 }}>
        LADE 3D-ANSICHT…
      </div>
    );
  }

  if (!modelExists) {
    return <ShirtFlip frontPrint={props.frontPrint} backPrint={props.backPrint} />;
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
          autoRotateSpeed={0.8}
          target={[0, 0.53, 0]}
          enableRotate={enableTouch}
          enableZoom={enableTouch}
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);
