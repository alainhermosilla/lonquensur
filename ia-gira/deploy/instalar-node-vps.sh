#!/usr/bin/env bash
set -euo pipefail

NODE_VERSION="${NODE_VERSION:-v24.20.0}"
ARCHIVE="node-${NODE_VERSION}-linux-x64.tar.xz"
BASE_URL="https://nodejs.org/dist/${NODE_VERSION}"
TEMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

if [ "$(uname -m)" != "x86_64" ]; then
  echo "Este instalador está preparado únicamente para Linux x86_64." >&2
  exit 1
fi

echo "Descargando Node.js ${NODE_VERSION} desde nodejs.org..."
curl -fsSLo "$TEMP_DIR/$ARCHIVE" "$BASE_URL/$ARCHIVE"
curl -fsSLo "$TEMP_DIR/SHASUMS256.txt" "$BASE_URL/SHASUMS256.txt"

(
  cd "$TEMP_DIR"
  grep "  $ARCHIVE\$" SHASUMS256.txt | sha256sum --check -
)

tar -xJf "$TEMP_DIR/$ARCHIVE" -C "$TEMP_DIR"
SOURCE_DIR="$TEMP_DIR/node-${NODE_VERSION}-linux-x64"
TARGET_DIR="/opt/node-${NODE_VERSION}"

if [ -e "$TARGET_DIR" ]; then
  echo "$TARGET_DIR ya existe; no se sobrescribirá." >&2
  exit 1
fi

sudo cp -a "$SOURCE_DIR" "$TARGET_DIR"
sudo chown -R root:root "$TARGET_DIR"
sudo ln -sfn "$TARGET_DIR/bin/node" /usr/local/bin/node
sudo ln -sfn "$TARGET_DIR/bin/npm" /usr/local/bin/npm
sudo ln -sfn "$TARGET_DIR/bin/npx" /usr/local/bin/npx
sudo ln -sfn "$TARGET_DIR/bin/corepack" /usr/local/bin/corepack

node --version
npm --version
echo "Node.js instalado y verificado."
