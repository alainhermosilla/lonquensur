#!/usr/bin/env bash
set -euo pipefail

BRANCH="${BRANCH:-origin/codex/fuente-unica-gira}"
ROOT="$(git rev-parse --show-toplevel)"
NODE_BINARY="$(command -v node)"
TEMP_DIR="$(mktemp -d)"
WORKTREE="$TEMP_DIR/repo"

cleanup() {
  git -C "$ROOT" worktree remove --force "$WORKTREE" >/dev/null 2>&1 || true
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

node_major="$("$NODE_BINARY" -p 'process.versions.node.split(".")[0]')"
if [ "$node_major" -lt 22 ]; then
  echo "Se requiere Node.js 22 o superior." >&2
  exit 1
fi

git -C "$ROOT" worktree add --detach "$WORKTREE" "$BRANCH"
(
  cd "$WORKTREE/gira-innovacion"
  npm ci
  npm run build
)

sudo useradd --system --no-create-home --home-dir /nonexistent --shell /usr/sbin/nologin ia-gira 2>/dev/null || true
sudo install -d -o root -g ia-gira -m 0750 /opt/ia-gira /opt/ia-gira/app /opt/ia-gira/app/src /opt/ia-gira/bin
sudo install -d -o root -g ia-gira -m 0750 /etc/ia-gira

sudo install -o root -g ia-gira -m 0750 "$NODE_BINARY" /opt/ia-gira/bin/node
sudo install -o root -g ia-gira -m 0640 "$WORKTREE/ia-gira/package.json" /opt/ia-gira/app/package.json
sudo cp -a "$WORKTREE/ia-gira/src/." /opt/ia-gira/app/src/
sudo chown -R root:ia-gira /opt/ia-gira/app/src
sudo find /opt/ia-gira/app/src -type d -exec chmod 0750 {} +
sudo find /opt/ia-gira/app/src -type f -exec chmod 0640 {} +
sudo install -o root -g ia-gira -m 0640 "$WORKTREE/gira-innovacion/dist/conocimiento.json" /opt/ia-gira/conocimiento.json

env_file="$TEMP_DIR/ia-gira.env"
cat > "$env_file" <<'ENV'
HOST=127.0.0.1
PORT=8787
KNOWLEDGE_PATH=/opt/ia-gira/conocimiento.json
ALLOWED_ORIGIN=https://gira.lonquensur.cl
MODEL_BASE_URL=http://127.0.0.1:11434
MODEL_NAME=qwen3:1.7b
MODEL_NUM_CTX=4096
MODEL_NUM_PREDICT=220
TOP_K=5
MIN_SCORE=0.16
MAX_QUESTION_LENGTH=500
RATE_LIMIT_PER_MINUTE=20
ENV
sudo install -o root -g ia-gira -m 0640 "$env_file" /etc/ia-gira/ia-gira.env
sudo install -o root -g root -m 0644 "$WORKTREE/ia-gira/deploy/ia-gira.service" /etc/systemd/system/ia-gira.service

sudo systemctl daemon-reload
sudo systemctl enable ia-gira
sudo systemctl restart ia-gira

for attempt in $(seq 1 20); do
  if curl -fsS http://127.0.0.1:8787/health; then
    echo
    break
  fi
  if [ "$attempt" -eq 20 ]; then
    sudo systemctl status ia-gira --no-pager || true
    sudo journalctl -u ia-gira -n 60 --no-pager || true
    exit 1
  fi
  sleep 1
done

listeners="$(ss -lntp '( sport = :8787 )' 2>/dev/null || true)"
echo "$listeners"
if echo "$listeners" | awk 'NR > 1 {print $4}' | grep -Evq '^(127\.0\.0\.1|\[::1\]):8787$'; then
  echo "La API parece escuchar fuera de loopback; se detiene por seguridad." >&2
  sudo systemctl stop ia-gira
  exit 1
fi

echo "API de desarrollo instalada en 127.0.0.1:8787."
