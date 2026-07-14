# PLATYPUS — Claude Code Anweisungen

## Toolchain

### Pflicht (vor jedem Deploy)
```bash
./p tools          # oder: bash scripts/tools-check.sh
./p build
./p deploy "msg"
```

| Tool | Befehl | Zweck |
|------|--------|-------|
| Node 20 + npm | `node`, `npm` | Build |
| git | `git` | Versionierung |
| python3 | `python3` | Assert in paste.rs-Skripten |
| Vercel CLI | `vercel` | Deploy |
| ./p | `./p health` | Projekt-Helfer |

### Nice-to-have
| Tool | Zweck |
|------|-------|
| `gh` | GitHub PR/Issues |
| `stripe` | Webhook lokal: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| `claude` | Diese Session |
| `grok` | Zweitmeinung / Patches |
| `code` | VS Code Editor |

### Nicht für Platypus
Flutter, Docker, pm2, @nex-ai/nex, npm-global claude-code, anthropic Python SDK.

## Vault (Obsidian)
`~/Schreibtisch/MeinVault/ClaudeData/` — Übergaben, nie Code.

## Harte Signaturen
- `calcUnitPrice(front?, back?)` — keine Seitenzahl
- `proxy.ts` (nicht middleware.ts)
- `lib/print-spec.ts` — Druckfläche 210 × 297 mm
- designs-DB: nur front_image, back_image — keine Positionsdaten

## Aktive Scripts
Nur Scripts in `scripts/ACTIVE_SCRIPTS.txt`. Rest in `scripts/_archive/`.

## Workflow
1. Backup vor Patch
2. python3-Assert (nie blind ersetzen)
3. Build-Gate
4. Deploy nur bei grün