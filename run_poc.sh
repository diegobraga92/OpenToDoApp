#!/usr/bin/env bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Project root: $ROOT_DIR"

### 1. Build Rust core
echo "=== Building Rust core ==="
cd "$ROOT_DIR/rust-core"
cargo build --release

### 2. Export LD_LIBRARY_PATH for Go runtime
export LD_LIBRARY_PATH="$ROOT_DIR/rust-core/target/release:$LD_LIBRARY_PATH"
echo "LD_LIBRARY_PATH set to: $LD_LIBRARY_PATH"

### 3. Start Go backend
echo "=== Starting Go backend on port 8080 ==="
cd "$ROOT_DIR/backend"
go run main.go &
BACKEND_PID=$!

### 4. Start Vite frontend
echo "=== Starting Vite frontend on port 5173 ==="
cd "$ROOT_DIR/frontend"
npm install --silent
npm run dev & 
FRONTEND_PID=$!

### 5. Wait for user to stop
echo ""
echo "========================================"
echo "  PoC is running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8080/process"
echo "  Press Ctrl+C to stop everything"
echo "========================================"
echo ""

# Trap Ctrl+C to clean up both processes
trap "echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

wait
