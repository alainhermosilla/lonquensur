#!/usr/bin/env bash
set -euo pipefail

MODEL_NAME="${MODEL_NAME:-qwen3:1.7b}"

if [ "$(uname -m)" != "x86_64" ]; then
  echo "Arquitectura no contemplada: $(uname -m)" >&2
  exit 1
fi

available_kib="$(awk '/MemAvailable:/ {print $2}' /proc/meminfo)"
if [ "${available_kib:-0}" -lt 2500000 ]; then
  echo "Se requieren al menos 2,5 GiB de memoria disponible antes de instalar el modelo." >&2
  exit 1
fi

if ! command -v ollama >/dev/null 2>&1; then
  installer="$(mktemp)"
  trap 'rm -f "$installer"' EXIT
  curl --proto '=https' --tlsv1.2 -fsSL https://ollama.com/install.sh -o "$installer"
  echo "Instalando Ollama desde el instalador oficial..."
  sh "$installer"
fi

echo "Configurando Ollama exclusivamente en loopback..."
sudo install -d -m 0755 /etc/systemd/system/ollama.service.d
printf '%s\n' \
  '[Service]' \
  'Environment="OLLAMA_HOST=127.0.0.1:11434"' \
  'Environment="OLLAMA_KEEP_ALIVE=5m"' \
  'Environment="OLLAMA_CONTEXT_LENGTH=4096"' \
  'Environment="OLLAMA_NUM_PARALLEL=1"' \
  'Environment="OLLAMA_MAX_LOADED_MODELS=1"' \
  | sudo tee /etc/systemd/system/ollama.service.d/override.conf >/dev/null

sudo systemctl daemon-reload
sudo systemctl enable --now ollama

echo "Esperando la API local..."
for attempt in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:11434/api/version >/dev/null; then
    break
  fi
  if [ "$attempt" -eq 30 ]; then
    sudo systemctl status ollama --no-pager || true
    exit 1
  fi
  sleep 1
done

echo "Descargando el modelo $MODEL_NAME..."
ollama pull "$MODEL_NAME"

echo "Verificando que Ollama no escuche fuera de loopback..."
listeners="$(ss -lntp '( sport = :11434 )' 2>/dev/null || true)"
echo "$listeners"
if echo "$listeners" | awk 'NR > 1 {print $4}' | grep -Evq '^(127\.0\.0\.1|\[::1\]):11434$'; then
  echo "Ollama parece escuchar fuera de loopback; se detiene por seguridad." >&2
  sudo systemctl stop ollama
  exit 1
fi

echo
ollama --version
ollama list
echo
echo "Instalación local completada. El puerto 11434 permanece limitado a 127.0.0.1."
