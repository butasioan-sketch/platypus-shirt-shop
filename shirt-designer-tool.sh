#!/bin/bash
set -uo pipefail

GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${CYAN}[->]${NC} $1"; }

info "Shirt Designer + PNG Export wird erstellt..."

mkdir -p ~/Schreibtisch/platypus-designer

cat > ~/Schreibtisch/platypus-designer/designer.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PLATYPUS Shirt Designer</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:system-ui,sans-serif; }
  body { background:#0a0a0a; color:#fff; padding:1rem; }
  h1 { font-size:1.5rem; letter-spacing:0.15em; margin-bottom:1rem; text-align:center; }
  .layout { display:flex; flex-wrap:wrap; gap:1.5rem; justify-content:center; }
  .panel { background:#111; border:1px solid #222; border-radius:12px; padding:1rem; }
  .controls { width:300px; }
  label { display:block; font-size:0.8rem; color:#888; margin:0.75rem 0 0.25rem; text-transform:uppercase; letter-spacing:0.05em; }
  input, select, textarea { width:100%; background:#0a0a0a; border:1px solid #333; color:#fff; border-radius:8px; padding:0.5rem; font-size:0.9rem; }
  textarea { resize:vertical; min-height:60px; }
  .row { display:flex; gap:0.5rem; }
  .row > * { flex:1; }
  button { background:#fff; color:#000; border:none; border-radius:8px; padding:0.75rem; font-weight:700; cursor:pointer; margin-top:0.5rem; width:100%; font-size:0.9rem; }
  button.sec { background:#1a1a1a; color:#fff; border:1px solid #333; }
  .tabs { display:flex; gap:0.5rem; margin-bottom:1rem; justify-content:center; }
  .tab { padding:0.5rem 1.25rem; border-radius:999px; cursor:pointer; font-size:0.85rem; background:#1a1a1a; border:1px solid #333; }
  .tab.active { background:#fff; color:#000; }
  canvas { background:transparent; border:1px dashed #333; border-radius:8px; max-width:100%; }
  .hint { font-size:0.7rem; color:#555; margin-top:0.75rem; line-height:1.5; }
  .swatch { display:inline-block; width:28px; height:28px; border-radius:6px; border:2px solid #333; cursor:pointer; margin-right:4px; }
  .swatch.active { border-color:#fff; }
</style>
</head>
<body>
  <h1>PLATYPUS SHIRT DESIGNER</h1>

  <div class="tabs">
    <div class="tab active" data-side="front" onclick="switchSide('front')">Vorderseite</div>
    <div class="tab" data-side="back" onclick="switchSide('back')">Rückseite</div>
  </div>

  <div class="layout">
    <div class="panel">
      <canvas id="canvas" width="300" height="400"></canvas>
      <div class="hint">
        Vorschau auf dem Shirt. Der Druckbereich (gestrichelt) ist 30×40 cm.<br>
        Export erzeugt ein transparentes PNG nur mit deinem Motiv — fertig zum Plotten.
      </div>
    </div>

    <div class="controls panel">
      <label>Text</label>
      <textarea id="text" oninput="render()" placeholder="Dein Text...">PLATYPUS</textarea>

      <label>Schriftgröße</label>
      <input type="range" id="size" min="20" max="120" value="48" oninput="render()">

      <label>Schriftart</label>
      <select id="font" onchange="render()">
        <option value="Arial Black">Arial Black (fett)</option>
        <option value="Impact">Impact</option>
        <option value="Georgia">Georgia (serif)</option>
        <option value="Courier New">Courier (mono)</option>
        <option value="Arial">Arial</option>
      </select>

      <label>Textfarbe (Plotter-Farbe)</label>
      <div id="colors"></div>

      <label>Position vertikal</label>
      <input type="range" id="posY" min="0" max="400" value="180" oninput="render()">

      <label>Drehung</label>
      <input type="range" id="rot" min="-45" max="45" value="0" oninput="render()">

      <button onclick="exportPNG()">PNG EXPORTIEREN (druckfertig)</button>
      <button class="sec" onclick="exportPNG(true)">PNG mit Shirt-Vorschau</button>

      <div class="hint">
        <b>Druckfertig</b> = nur dein Motiv, transparent, hohe Auflösung (für den Plotter deines Partners).<br>
        <b>Mit Vorschau</b> = zum Zeigen für Freunde/Blogger.
      </div>
    </div>
  </div>

<script>
let side = 'front';
let color = '#000000';
const COLORS = ['#000000','#ffffff','#e2001a','#003a7d','#ffd700','#00843d','#ff6b00','#7b2d8e'];

const cv = document.getElementById('canvas');
const ctx = cv.getContext('2d');

function buildSwatches() {
  const box = document.getElementById('colors');
  box.innerHTML = '';
  COLORS.forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'swatch' + (i===0?' active':'');
    s.style.background = c;
    s.onclick = () => {
      color = c;
      document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('active'));
      s.classList.add('active');
      render();
    };
    box.appendChild(s);
  });
}

function switchSide(s) {
  side = s;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.side===s));
  render();
}

function render() {
  ctx.clearRect(0,0,cv.width,cv.height);
  // Shirt Silhouette
  ctx.fillStyle = '#1a1a1a';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(70,40); ctx.lineTo(110,15); ctx.lineTo(150,40); ctx.lineTo(195,70);
  ctx.lineTo(170,100); ctx.lineTo(155,88); ctx.lineTo(155,380);
  ctx.lineTo(75,380); ctx.lineTo(75,88); ctx.lineTo(60,100); ctx.lineTo(35,70);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Kragen
  ctx.beginPath();
  if (side==='front') { ctx.moveTo(95,20); ctx.quadraticCurveTo(115,48,135,20); }
  else { ctx.moveTo(95,18); ctx.quadraticCurveTo(115,30,135,18); }
  ctx.stroke();
  // Druckbereich
  ctx.strokeStyle = '#444'; ctx.setLineDash([5,5]);
  ctx.strokeRect(78, 110, 74, 200);
  ctx.setLineDash([]);
  // Seiten-Label
  ctx.fillStyle = '#555'; ctx.font = '11px sans-serif'; ctx.textAlign='center';
  ctx.fillText(side==='front'?'VORN':'HINTEN', 115, 60);

  drawText(ctx, false);
}

function drawText(context, isExport) {
  const text = document.getElementById('text').value;
  const size = +document.getElementById('size').value;
  const font = document.getElementById('font').value;
  const posY = +document.getElementById('posY').value;
  const rot = +document.getElementById('rot').value * Math.PI/180;
  const scale = isExport ? 4 : 1;
  const cx = isExport ? context.canvas.width/2 : 115;
  const cy = isExport ? context.canvas.height/2 : posY;

  context.save();
  context.translate(cx, cy);
  context.rotate(rot);
  context.fillStyle = color;
  context.font = `${size*scale}px "${font}"`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    context.fillText(line, 0, (i - (lines.length-1)/2) * size * scale * 1.2);
  });
  context.restore();
}

function exportPNG(withShirt=false) {
  const out = document.createElement('canvas');
  // Druckbereich 30x40cm bei 300dpi = ~3543x4724, wir nehmen handliche hohe Auflösung
  out.width = 1200; out.height = 1600;
  const octx = out.getContext('2d');

  if (withShirt) {
    octx.fillStyle = '#1a1a1a';
    octx.fillRect(0,0,out.width,out.height);
  }
  // transparent sonst — nur Text
  octx.save();
  drawTextExport(octx);
  octx.restore();

  const link = document.createElement('a');
  link.download = `platypus_${side}_${Date.now()}.png`;
  link.href = out.toDataURL('image/png');
  link.click();
}

function drawTextExport(context) {
  const text = document.getElementById('text').value;
  const size = +document.getElementById('size').value;
  const font = document.getElementById('font').value;
  const rot = +document.getElementById('rot').value * Math.PI/180;
  const scale = 8;
  context.translate(context.canvas.width/2, context.canvas.height/2);
  context.rotate(rot);
  context.fillStyle = color;
  context.font = `${size*scale}px "${font}"`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    context.fillText(line, 0, (i - (lines.length-1)/2) * size * scale * 1.2);
  });
}

buildSwatches();
render();
</script>
</body>
</html>
HTMLEOF

ok "Designer erstellt: ~/Schreibtisch/platypus-designer/designer.html"

# Im Browser öffnen
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open ~/Schreibtisch/platypus-designer/designer.html 2>/dev/null &
  ok "Wird im Browser geöffnet..."
else
  info "Manuell öffnen: Doppelklick auf ~/Schreibtisch/platypus-designer/designer.html"
fi

echo ""
echo "=================================================="
echo "  SHIRT DESIGNER FERTIG"
echo "=================================================="
echo ""
echo "  Datei: ~/Schreibtisch/platypus-designer/designer.html"
echo ""
echo "  Was du jetzt kannst:"
echo "    - Vorder-/Rückseite umschalten"
echo "    - Text, Größe, Schrift, Farbe, Position wählen"
echo "    - 'PNG EXPORTIEREN' → transparentes druckfertiges PNG"
echo "    - Diese PNG gibst du deinem Plotter-Partner"
echo ""
echo "  Läuft komplett lokal — kein Internet nötig."
echo "=================================================="

