#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 PLATYPUS Project Setup startet...${NC}"

read -p "Projektname: " project_name
read -p "Projekttyp (web | python | node | next | php | docker): " project_type

BASE_DIR="$HOME/projekte"
PROJECT_DIR="$BASE_DIR/$project_name"

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo -e "${GREEN}✅ Projekt erstellt: $PROJECT_DIR${NC}"

git init

cat > .gitignore << 'GITIGNORE'
node_modules/
.next/
out/
dist/
build/
.env
.env.local
*.log
.DS_Store
Thumbs.db
venv/
__pycache__/
*.pyc
.vscode/
GITIGNORE

case "$project_type" in
  web)
    mkdir -p css js images assets
    cat > index.html << 'HTML'
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neues Webprojekt</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <h1>Projekt läuft</h1>
  <script src="js/main.js"></script>
</body>
</html>
HTML

    cat > css/style.css << 'CSS'
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #f5f5f5; padding: 2rem; }
h1 { color: #111; }
CSS

    cat > js/main.js << 'JS'
console.log("Projekt geladen");
JS
    ;;

  python)
    python3 -m venv venv
    cat > requirements.txt << 'REQ'
flask
fastapi
uvicorn
pytest
black
REQ
    cat > main.py << 'PY'
print("Python Projekt läuft")
PY
    ;;

  node)
    npm init -y
    mkdir -p src
    cat > src/index.js << 'JS'
console.log("Node Projekt läuft");
JS
    ;;

  next)
    npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias="@/*"
    ;;

  php)
    mkdir -p public
    cat > public/index.php << 'PHP'
<?php echo "PHP Projekt läuft"; ?>
PHP
    ;;

  docker)
    cat > docker-compose.yml << 'DOCKER'
services:
  app:
    image: nginx:latest
    ports:
      - "8080:80"
DOCKER
    ;;

  *)
    echo -e "${RED}❌ Unbekannter Projekttyp${NC}"
    exit 1
    ;;
esac

cat > README.md << EOFREADME
# $project_name

Typ: $project_type

## Start
Projekt erstellt mit PLATYPUS Setup Script.
EOFREADME

git add .
git commit -m "initial project setup" || true

echo -e "${GREEN}✅ Setup fertig: $PROJECT_DIR${NC}"
