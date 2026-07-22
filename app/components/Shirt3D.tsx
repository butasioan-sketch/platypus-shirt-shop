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

/**
 * GLB pro productId — Tee weiß; Shorts mit Produktfoto-Atlas (Front/Back planar)
 * auf das Mesh gebacken (public/models/shorts-photo-atlas.png + UVs im GLB).
 * Kundenmotiv weiterhin als Decal oben drauf.
 */
const MODEL_PATHS: Record<string, string> = {
  '1': '/models/shirt-white-v2.glb',
  '2': '/models/shorts-white-v1.glb',
};

/** Fallback-Atlas falls das GLB die Map nicht mitbringt */
const SHORTS_PHOTO_ATLAS = '/models/shorts-photo-atlas.png';

function getModelPath(productId?: string): string | null {
  const id = productId || '1';
  return MODEL_PATHS[id] ?? null;
}

const WHITE_MAT = {
  roughness: 0.62,
  metalness: 0,
  side: THREE.DoubleSide as THREE.Side,
};

/** Weißes Standard-Material (Tee) oder Foto-Atlas (Shorts). */
function makeGarmentMaterial(
  color: string,
  map?: THREE.Texture | null,
): THREE.MeshStandardMaterial {
  if (map) {
    map.colorSpace = THREE.SRGBColorSpace;
    map.flipY = false; // glTF-UVs: flipY false
    map.needsUpdate = true;
  }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    map: map ?? null,
    roughness: map ? 0.72 : WHITE_MAT.roughness,
    metalness: WHITE_MAT.metalness,
    side: WHITE_MAT.side,
  });
}

/** Planare UVs aus Bounding-Box (Fallback, wenn GLB keine UVs hat). */
function ensurePlanarUVs(geometry: THREE.BufferGeometry): void {
  if (geometry.getAttribute('uv')) return;
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox;
  if (!bb) return;
  const pos = geometry.getAttribute('position');
  if (!pos) return;
  const size = new THREE.Vector3();
  bb.getSize(size);
  const uvs = new Float32Array(pos.count * 2);
  const zMid = (bb.min.z + bb.max.z) * 0.5;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    let u = (x - bb.min.x) / Math.max(size.x, 1e-6);
    const v = (y - bb.min.y) / Math.max(size.y, 1e-6);
    // Atlas: links Front (0..0.5), rechts Back (0.5..1) — wie Python-Bake
    if (z >= zMid) {
      u = u * 0.5;
    } else {
      u = 0.5 + (1 - u) * 0.5;
    }
    uvs[i * 2] = u;
    uvs[i * 2 + 1] = v;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
}

// === KUNDENMOTIV ALS DECAL ===
// Position aus Bounding-Box des Haupt-Meshes (größtes Mesh) — wie 2D-Editor %.
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

// === GARMENT-MODELL ===
// Alle Meshes: Normalen + Material.
// Tee: weiß. Shorts: Produktfoto-Atlas (Front/Back) — Mesh-Form bleibt, Look ≈ Shop-Foto.
function GarmentModel({
  modelPath,
  productId,
  frontPrint,
  backPrint,
  shirtColor = '#ffffff',
}: Shirt3DProps & { modelPath: string; productId: string }) {
  const { scene } = useGLTF(modelPath);
  const isShorts = productId === '2';
  // Atlas-Datei existiert immer; wird nur bei Shorts als Map gesetzt (Hooks dürfen nicht conditional sein)
  const atlasTex = useTexture(SHORTS_PHOTO_ATLAS);
  const [decalMesh, setDecalMesh] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    let bestMesh: THREE.Mesh | null = null;
    let bestCount = 0;

    // Shorts: Foto-Atlas; Tee: reines Weiß (atlasTex ungenutzt)
    const baseMap = isShorts ? atlasTex : null;
    if (baseMap) {
      baseMap.colorSpace = THREE.SRGBColorSpace;
      baseMap.flipY = false;
      baseMap.needsUpdate = true;
    }
    const matTemplate = makeGarmentMaterial(shirtColor, baseMap);

    scene.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh) return;
      const m = o as THREE.Mesh;
      if (!m.geometry) return;

      if (!m.geometry.attributes.normal) {
        m.geometry.computeVertexNormals();
      } else {
        const n = m.geometry.attributes.normal;
        if (!n || n.count === 0) m.geometry.computeVertexNormals();
      }

      // Shorts: UVs für Atlas (im GLB gebacken ODER planar nachrechnen)
      if (isShorts) {
        ensurePlanarUVs(m.geometry);
      }

      if (Array.isArray(m.material)) {
        m.material.forEach((mat) => {
          if (mat && 'dispose' in mat) (mat as THREE.Material).dispose();
        });
      } else if (m.material && 'dispose' in m.material) {
        (m.material as THREE.Material).dispose();
      }
      m.material = matTemplate.clone();
      if (baseMap) {
        (m.material as THREE.MeshStandardMaterial).map = baseMap;
        (m.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
      m.castShadow = false;
      m.receiveShadow = false;

      const count = m.geometry.attributes.position?.count ?? 0;
      if (count > bestCount) {
        bestMesh = m;
        bestCount = count;
      }
    });

    if (bestMesh) {
      const b = bestMesh as THREE.Mesh;
      b.geometry.computeBoundingBox();
      // eslint-disable-next-line no-console
      console.log('[Shirt3D] product', productId, 'photoMap', isShorts, 'decalMesh:', b.name,
        'verts', bestCount, 'bbox', JSON.stringify(b.geometry.boundingBox));
      setDecalMesh(b);
    }
  }, [scene, shirtColor, productId, isShorts, atlasTex]);

  return (
    <>
      <primitive object={scene} />
      {decalMesh && createPortal(
        <>
          {(frontPrint || []).map((p, i) => (
            <CustomerPrint key={`front-${i}`} mesh={decalMesh} print={p} front productId={productId} layerIndex={i} />
          ))}
          {(backPrint || []).map((p, i) => (
            <CustomerPrint key={`back-${i}`} mesh={decalMesh} print={p} front={false} productId={productId} layerIndex={i} />
          ))}
        </>,
        decalMesh,
      )}
    </>
  );
}

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

  // Kamera für STABILE Meshes (Rollback 22.07.2026 — proven backups, nicht Marketplace-Schrott).
  // maxDistance MUSS >= |camera z| sein (sonst Orbit clamp → unsichtbar).
  const isShorts = productId === '2';
  const cameraPos: [number, number, number] = isShorts ? [0, 0.5, 2.2] : [0, 0.58, 0.85];
  const orbitTarget: [number, number, number] = isShorts ? [0, 0.45, 0] : [0, 0.53, 0];
  const minDistance = isShorts ? 0.8 : 0.3;
  const maxDistance = isShorts ? 5.0 : 2.5;

  return (
    <Canvas
      camera={{ position: cameraPos, fov: isShorts ? 35 : 40 }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={<ModelLoadingSkeleton productId={productId} />}>
        {/* Helles, weiches Licht — weiße Textilien brauchen genug Ambient + Key */}
        <ambientLight intensity={0.85} />
        <directionalLight position={[2.5, 4, 3]} intensity={1.15} />
        <directionalLight position={[-2.5, 2, -2]} intensity={0.45} />
        <directionalLight position={[0, 1, 4]} intensity={0.35} />
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
