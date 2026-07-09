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

// === DECAL FÜR DAS ECHTE SHIRT-BILD (VORDERSEITE) ===
function ShirtDecalFront({ src }: { src: string }) {
  const tex = useTexture(src);
  tex.anisotropy = 8;
  // Das gesamte Shirt-Foto als Decal auf die Vorderseite legen
  // Position (0,0) zentriert, scale so groß, dass es das Shirt bedeckt
  return (
<<<<<<< Updated upstream
    <Decal
      position={[0, 0.05, 0.12]}  // leicht nach vorne, mittig
      rotation={[0, 0, 0]}
      scale={[0.9, 1.1, 0.3]}     // Breite/Höhe anpassen – hier experimentell
    >
      <meshStandardMaterial
        map={tex}
        transparent={false}
        roughness={0.6}
        metalness={0}
        toneMapped={false}
      />
    </Decal>
  );
}

// === DECAL FÜR DAS ECHTE SHIRT-BILD (RÜCKSEITE) ===
function ShirtDecalBack({ src }: { src: string }) {
  const tex = useTexture(src);
  tex.anisotropy = 8;
  return (
    <Decal
      position={[0, 0.05, -0.12]} // leicht nach hinten
      rotation={[0, Math.PI, 0]}
      scale={[0.9, 1.1, 0.3]}
    >
      <meshStandardMaterial
        map={tex}
        transparent={false}
        roughness={0.6}
        metalness={0}
        toneMapped={false}
      />
    </Decal>
  );
}

// === DECAL FÜR KUNDENMOTIV (VORNE/HINTEN) ===
function CustomerPrint({ print, front }: { print: PrintData; front: boolean }) {
  const tex = useTexture(print.src);
  tex.anisotropy = 8;
  // Position aus DesignStudio (x/y) in % auf das Shirt übertragen
  const px = (print.x / 100) * 0.35;
  const py = 0.12 - (print.y / 100) * 0.45;
  const s = 0.3 * print.scale;
  return (
    <Decal
      position={[px, py, front ? 0.16 : -0.16]}
      rotation={[0, front ? 0 : Math.PI, 0]}
      scale={[s, s, 0.2]}
    >
      <meshStandardMaterial
        map={tex}
        transparent={true}
        polygonOffset
        polygonOffsetFactor={-1}
        roughness={0.6}
        toneMapped={false}
      />
    </Decal>
  );
}

function ShirtModel({ frontPrint, backPrint, shirtColor = '#ffffff' }: Shirt3DProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);

  // Deine echten Shirt-Bilder (aus public/)
  const frontShirtImg = '/airfit-front-t.png';
  const backShirtImg = '/airfit-back-t.png';

  useEffect(() => {
    let found: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if (!found && (o as THREE.Mesh).isMesh) found = o as THREE.Mesh;
    });
    if (found) {
      // Basis-Material auf einfarbig weiß, damit die Decals sauber leuchten
      (found as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xffffff),
        roughness: 0.6,
        metalness: 0,
      });
      setMesh(found);
    }
  }, [scene]);

  if (!mesh) return <primitive object={scene} />;
  return (
    <mesh geometry={mesh.geometry} material={mesh.material}>
      {/* Echte Shirt-Decals */}
      <ShirtDecalFront src={frontShirtImg} />
      <ShirtDecalBack src={backShirtImg} />
      {/* Kundenmotive */}
      {frontPrint && <CustomerPrint print={frontPrint} front={true} />}
      {backPrint && <CustomerPrint print={backPrint} front={false} />}
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
=======
    <ShirtFlip
      autoRotateSpeed={0.03}
      idleDelayMs={3000}
      showControls={false}
      showHint={true}
      frontPrint={props.frontPrint}
      backPrint={props.backPrint}
    />
>>>>>>> Stashed changes
  );
}
