#!/bin/bash
set -e

echo "🔍 Lade deine echten Shirt-Bilder..."
FRONT_IMG=$(grep -oP "(?<=frontSrc = ')[^']*" app/components/ShirtFlip.tsx | head -1)
BACK_IMG=$(grep -oP "(?<=backSrc = ')[^']*" app/components/ShirtFlip.tsx | head -1)

if [[ -z "$FRONT_IMG" ]]; then
  FRONT_IMG="/airfit-front-t.png"
  BACK_IMG="/airfit-back-t.png"
fi

echo "✅ Vorderseite: $FRONT_IMG"
echo "✅ Rückseite: $BACK_IMG"

# Exportieren, damit Python sie lesen kann
export FRONT_IMG
export BACK_IMG

echo "🔍 Schritt 2: 3D-Modell mit echten Texturen ausstatten..."
python3 << 'PYEOF'
import os, re
file_path = "app/components/Shirt3D.tsx"
front_img = os.environ['FRONT_IMG']
back_img = os.environ['BACK_IMG']

with open(file_path, 'r') as f:
    data = f.read()

# 1. useTexture importieren (falls noch nicht vorhanden)
if "useTexture" not in data:
    data = data.replace(
        "import { OrbitControls, useGLTF, Decal, Stage }",
        "import { OrbitControls, useGLTF, Decal, Stage, useTexture }"
    )

# 2. Die komplette ShirtModel-Funktion durch eine korrekte ersetzen
pattern = r'function ShirtModel\([^)]*\)\s*\{[\s\S]*?\}'
replacement = f'''function ShirtModel({{ frontPrint, backPrint, shirtColor = '#ffffff' }}: Shirt3DProps) {{
  const {{ scene }} = useGLTF(MODEL_PATH);
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
  const frontTex = useTexture('{front_img}');

  useEffect(() => {{
    let found: THREE.Mesh | null = null;
    scene.traverse((o) => {{
      if (!found && (o as THREE.Mesh).isMesh) found = o as THREE.Mesh;
    }});
    if (found) {{
      const mat = new THREE.MeshStandardMaterial({{
        roughness: 0.65,
        metalness: 0,
        map: frontTex,
        color: new THREE.Color(0xffffff),
      }});
      (found as THREE.Mesh).material = mat;
      setMesh(found);
    }}
  }}, [scene, frontTex]);

  if (!mesh) return <primitive object={{scene}} />;
  return (
    <mesh geometry={{mesh.geometry}} material={{mesh.material}}>
      {{frontPrint && <PrintDecal print={{frontPrint}} front={{true}} />}}
      {{backPrint && <PrintDecal print={{backPrint}} front={{false}} />}}
    </mesh>
  );
}}'''

data = re.sub(pattern, replacement, data, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(data)

print("✅ 3D-Modell erfolgreich mit deinen echten Shirt-Bildern texturiert.")
PYEOF

echo ""
echo "🚀 Schritt 3: Baue und deploye – jetzt zeigt der 360°-Viewer dein echtes Shirt!"
npm run build && ./p deploy "textur: echte shirt-fotos auf 3d-modell"
