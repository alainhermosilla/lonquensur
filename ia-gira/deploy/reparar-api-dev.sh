#!/usr/bin/env bash
set -euo pipefail

BRANCH="${BRANCH:-origin/codex/fuente-unica-gira}"
ROOT="$(git rev-parse --show-toplevel)"
UNIT_TEMP="$(mktemp)"
trap 'rm -f "$UNIT_TEMP"' EXIT

git -C "$ROOT" show "$BRANCH:ia-gira/deploy/ia-gira.service" > "$UNIT_TEMP"
if grep -q '^MemoryDenyWriteExecute=true' "$UNIT_TEMP"; then
  echo "La unidad recuperada aún contiene la directiva incompatible." >&2
  exit 1
fi

sudo systemctl stop ia-gira || true
sudo install -o root -g root -m 0644 "$UNIT_TEMP" /etc/systemd/system/ia-gira.service
sudo systemctl daemon-reload
sudo systemctl reset-failed ia-gira
sudo systemctl start ia-gira

for attempt in $(seq 1 20); do
  if health="$(curl -fsS http://127.0.0.1:8787/health)"; then
    echo "$health"
    break
  fi
  if [ "$attempt" -eq 20 ]; then
    sudo systemctl status ia-gira --no-pager || true
    sudo journalctl -u ia-gira -n 80 --no-pager || true
    exit 1
  fi
  sleep 1
done

sudo systemctl status ia-gira --no-pager
ss -lntp '( sport = :8787 )' || true
