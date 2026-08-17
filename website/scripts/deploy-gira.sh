#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$HOME/proyectos/lonquensur/gira-innovacion"

cd "$PROJECT_DIR"

echo "======================================"
echo " DEPLOY GIRA INNOVACIÓN 2026"
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
open -u $GIRA_FTP_USER,$GIRA_FTP_PASSWORD ftp://$FTP_HOST;
mirror -R --verbose gira-innovacion/dist .;
bye
"

echo
echo "======================================"
echo " DEPLOY GIRA COMPLETADO"
echo "======================================"
