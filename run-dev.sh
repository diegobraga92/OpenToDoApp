#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/home/diego/dev/OpenToDoApp"

cleanup() {
  echo ""
  echo "Stopping services..."
  jobs -p | xargs -r kill
}

trap cleanup EXIT INT TERM

echo "Starting backend on http://localhost:3000 ..."
cargo run --manifest-path "$ROOT_DIR/backend/Cargo.toml" &

echo "Starting web frontend on http://localhost:5173 ..."
npm --prefix "$ROOT_DIR/web" run dev &

echo ""
echo "Both services started. Press Ctrl+C to stop both."

wait