#!/usr/bin/env bash
# Launch ZPC web console on Termux — accessible on your local network.
# Usage: ./scripts/start-termux.sh [--dev|--prod] [--no-pull]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="prod"
DO_PULL=1
PORT="${ZPC_PORT:-4173}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dev) MODE="dev"; PORT="${ZPC_PORT:-5173}"; shift ;;
    --prod) MODE="prod"; shift ;;
    --no-pull) DO_PULL=0; shift ;;
    -h|--help)
      echo "Usage: $0 [--dev|--prod] [--no-pull]"
      echo "  --dev      Vite dev server (hot reload) on port 5173"
      echo "  --prod     Build + preview (default) on port 4173"
      echo "  --no-pull  Skip git pull"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

cd "$ROOT"

if [[ "$DO_PULL" -eq 1 ]] && command -v git >/dev/null 2>&1 && [[ -d .git ]]; then
  echo "→ Pulling latest changes..."
  git pull --ff-only || echo "Warning: git pull failed, continuing with local code"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. In Termux run: pkg update && pkg install nodejs git"
  exit 1
fi

echo "→ Installing dependencies..."
cd web
npm install

if [[ "$MODE" == "dev" ]]; then
  echo ""
  echo "Starting dev server on 0.0.0.0:${PORT}"
  echo "Open http://<your-phone-ip>:${PORT} from any device on the same Wi‑Fi"
  echo ""
  exec npm run dev -- --host 0.0.0.0 --port "$PORT"
else
  echo "→ Building production bundle..."
  npm run build
  echo ""
  echo "Starting preview server on 0.0.0.0:${PORT}"
  echo "Open http://<your-phone-ip>:${PORT} from any device on the same Wi‑Fi"
  echo ""
  exec npm run preview -- --host 0.0.0.0 --port "$PORT"
fi
