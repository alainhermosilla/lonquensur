#!/usr/bin/env bash
set -euo pipefail

BRANCH="${BRANCH:-origin/main}"
SERVER_IP="${SERVER_IP:-192.168.1.145}"
PREVIEW_PORT="${PREVIEW_PORT:-8088}"
ROOT="$(git rev-parse --show-toplevel)"
TEMP_DIR="$(mktemp -d)"
WORKTREE="$TEMP_DIR/repo"

cleanup() {
  git -C "$ROOT" worktree remove --force "$WORKTREE" >/dev/null 2>&1 || true
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

if ! ip -4 -o addr show | awk '{print $4}' | cut -d/ -f1 | grep -Fxq "$SERVER_IP"; then
  echo "La IP $SERVER_IP no está asignada a este servidor." >&2
  echo "Direcciones disponibles:" >&2
  ip -4 -o addr show | awk '{print "  " $2 ": " $4}' >&2
  exit 1
fi

if ss -lnt "( sport = :$PREVIEW_PORT )" | awk 'NR > 1' | grep -q .; then
  echo "El puerto $PREVIEW_PORT ya está ocupado." >&2
  ss -lntp "( sport = :$PREVIEW_PORT )" >&2 || true
  exit 1
fi

git -C "$ROOT" worktree add --detach "$WORKTREE" "$BRANCH"
(
  cd "$WORKTREE/gira-innovacion"
  npm ci
  PUBLIC_IA_API_URL=/api npm run build
)

sudo install -d -o root -g ia-gira -m 0750 /opt/ia-gira/site
sudo find /opt/ia-gira/site -mindepth 1 -delete
sudo cp -a "$WORKTREE/gira-innovacion/dist/." /opt/ia-gira/site/
sudo chown -R root:ia-gira /opt/ia-gira/site
sudo find /opt/ia-gira/site -type d -exec chmod 0750 {} +
sudo find /opt/ia-gira/site -type f -exec chmod 0640 {} +
sudo install -o root -g ia-gira -m 0640 "$WORKTREE/ia-gira/deploy/preview-server.mjs" /opt/ia-gira/preview-server.mjs

service_file="$TEMP_DIR/ia-gira-preview.service"
sed -e "s/PREVIEW_HOST=192.168.1.145/PREVIEW_HOST=$SERVER_IP/"     -e "s/PREVIEW_PORT=8088/PREVIEW_PORT=$PREVIEW_PORT/"     "$WORKTREE/ia-gira/deploy/ia-gira-preview.service" > "$service_file"
sudo install -o root -g root -m 0644 "$service_file" /etc/systemd/system/ia-gira-preview.service

sudo systemctl daemon-reload
sudo systemctl enable ia-gira-preview
sudo systemctl restart ia-gira-preview

for attempt in $(seq 1 15); do
  if curl -fsS "http://$SERVER_IP:$PREVIEW_PORT/asistente/" >/dev/null; then
    echo "Vista previa instalada correctamente."
    echo "Abre desde tu computador: http://$SERVER_IP:$PREVIEW_PORT/asistente/"
    exit 0
  fi
  sleep 1
done

sudo systemctl status ia-gira-preview --no-pager || true
sudo journalctl -u ia-gira-preview -n 60 --no-pager || true
exit 1
