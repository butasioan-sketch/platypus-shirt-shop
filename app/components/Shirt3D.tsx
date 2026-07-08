'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Decal, useTexture, Stage } from '@react-three/drei';
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
  const px = (print.x / 100) * 0.4;
  const py = 0.15 - (print.y / 100) * 0.5;
  const s = 0.35 * print.scale;
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

  useEffect(() => {
    let found: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if (!found && (o as THREE.Mesh).isMesh) found = o as THREE.Mesh;
    });
    if (found) {
      (found as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(shirtColor),
        roughness: 0.65,
        metalness: 0,
      });
      setMesh(found);
    }
  }, [scene, shirtColor]);

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
        frontPrint={props.frontPrint}
        backPrint={props.backPrint}
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
