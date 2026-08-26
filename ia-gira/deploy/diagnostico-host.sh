#!/usr/bin/env bash
set -euo pipefail

echo "== Sistema =="
uname -a
if [ -r /etc/os-release ]; then
  sed -n '1,12p' /etc/os-release
fi

echo
echo "== CPU =="
lscpu | sed -n -E '/^(Architecture|CPU\(s\)|Model name|Thread|Core|Socket|CPU max MHz|Virtualization):/p'

echo
echo "== Memoria =="
free -h

echo
echo "== Disco disponible =="
df -hT / /opt 2>/dev/null || df -hT /

echo
echo "== GPU NVIDIA =="
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi --query-gpu=name,memory.total,memory.free,driver_version --format=csv,noheader
else
  echo "No se encontró nvidia-smi"
fi

echo
echo "== Aceleradores Linux =="
for device in /dev/dri/renderD* /dev/kfd; do
  if [ -e "$device" ]; then
    ls -l "$device"
  fi
done

echo
echo "== Runtime =="
if command -v node >/dev/null 2>&1; then node --version; else echo "Node.js no instalado en PATH"; fi
if command -v ollama >/dev/null 2>&1; then ollama --version; else echo "Ollama no instalado en PATH"; fi

echo
echo "== Servicios escuchando solo en puertos relevantes =="
if command -v ss >/dev/null 2>&1; then
  ss -lnt '( sport = :8787 or sport = :11434 )' || true
fi
