#!/bin/bash
set -e
cd ~/Schreibtisch/platypus-shirt-shop
DBURL=$(neonctl connection-string 2>/dev/null)

node -e '
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.argv[1]);
const fs = require("fs");
sql.query("SELECT id, amount_total, status, items, shipping_country, created_at FROM orders ORDER BY created_at DESC")
.then(rows => {
  const fmt = d => new Date(d).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"});
  const sm = {paid:"Bezahlt",production:"In Produktion",shipped:"Versandt",delivered:"Zugestellt",pending:"Offen",cancelled:"Storniert"};
  const total = rows.reduce((s,r)=>s+Number(r.amount_total||0),0);
  const tr = rows.map((r,i)=>{
    let it=""; try{const a=typeof r.items==="string"?JSON.parse(r.items):r.items; it=(a||[]).map(x=>`${x.quantity||1}× ${x.name||""} (${x.size||"-"})`).join(", ");}catch{}
    return `<tr><td>${i+1}</td><td>${r.id}</td><td>${fmt(r.created_at)}</td><td>${it}</td><td>${sm[r.status]||r.status}</td><td>${r.shipping_country||"DE"}</td><td style="text-align:right">&euro; ${Number(r.amount_total).toFixed(2)}</td></tr>`;
  }).join("");
  const html=`<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><style>
  @page{margin:2cm} body{font-family:Arial,sans-serif;color:#111;font-size:12px}
  h1{font-size:20px;margin-bottom:2px} .sub{color:#555;font-size:11px;margin-bottom:20px}
  .meta{margin-bottom:20px;line-height:1.6} table{width:100%;border-collapse:collapse;font-size:11px}
  th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;vertical-align:top} th{background:#f0f0f0}
  .summe{margin-top:16px;font-size:14px;font-weight:bold;text-align:right}
  .hinweis{margin-top:24px;font-size:10px;color:#666;border-top:1px solid #ccc;padding-top:10px}
  </style></head><body>
  <h1>PLATYPUS Shirt Shop &mdash; Bestell&uuml;bersicht</h1>
  <div class="sub">On Me &mdash; Maßanfertigung T-Shirts &middot; Interner Systemtest-Nachweis</div>
  <div class="meta"><strong>Betreiber:</strong> Jonny (butasioan@googlemail.com)<br>
  <strong>Online-Shop:</strong> https://platypus-shirt-shop.vercel.app<br>
  <strong>Erstellt am:</strong> ${fmt(new Date())}<br>
  <strong>Anzahl erfasster Bestellungen:</strong> ${rows.length}</div>
  <table><thead><tr><th>Nr.</th><th>Bestell-ID</th><th>Datum</th><th>Artikel</th><th>Status</th><th>Land</th><th>Betrag</th></tr></thead><tbody>${tr}</tbody></table>
  <div class="summe">Gesamtsumme: &euro; ${total.toFixed(2)}</div>
  <div class="hinweis">Dieser Bericht wurde automatisch aus der Bestelldatenbank (Neon Postgres) des Online-Shops erzeugt. Die aufgef&uuml;hrten Bestellungen entstanden im Rahmen interner Funktions- und Systemtests des Bestell- und Bezahlablaufs (Stripe-Testmodus) und belegen die technische Funktionsf&auml;higkeit der Bestellabwicklung.</div>
  </body></html>`;
  fs.writeFileSync("/tmp/bestell-nachweis.html",html);
  console.log("HTML erstellt:",rows.length,"Bestellungen, Summe EUR "+total.toFixed(2));
}).catch(e=>{console.log("FEHLER:",e.message);process.exit(1);});
' "$DBURL"

google-chrome --headless --disable-gpu --print-to-pdf="$HOME/Schreibtisch/Platypus-Bestellnachweis.pdf" /tmp/bestell-nachweis.html 2>/dev/null \
 || google-chrome-stable --headless --disable-gpu --print-to-pdf="$HOME/Schreibtisch/Platypus-Bestellnachweis.pdf" /tmp/bestell-nachweis.html 2>/dev/null

echo "Fertig: ~/Schreibtisch/Platypus-Bestellnachweis.pdf"
