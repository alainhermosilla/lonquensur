#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$HOME/proyectos/lonquensur/website"

cd "$PROJECT_DIR"

echo "======================================"
echo " DEPLOY LONQUENSUR.CL"
echo "======================================"

echo
echo "==> Instalando dependencias..."
npm ci

echo
echo "==> Generando sitio..."
npm run build

echo
echo "==> Build correcto."

cd "$HOME/proyectos/lonquensur"

set -a
source .env
set +a

echo
echo "==> Publicando en HostGator..."

lftp -e "
set ftp:passive-mode true;
set ftp:ssl-force true;
set ssl:verify-certificate true;
set ssl:check-hostname false;
open -u $LONQUENSUR_FTP_USER,$LONQUENSUR_FTP_PASSWORD ftp://$FTP_HOST;
mirror -R --verbose website/dist .;
bye
"

echo
echo "======================================"
echo " DEPLOY LONQUENSUR COMPLETADO"
echo "======================================"
