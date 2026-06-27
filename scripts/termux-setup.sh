#!/usr/bin/env bash
# One-time Termux setup for ZPC
set -euo pipefail

echo "ZPC Termux setup"
echo "================"
echo ""
echo "Install required packages:"
echo "  pkg update && pkg upgrade -y"
echo "  pkg install -y nodejs git"
echo ""
echo "Clone the repo (if not already):"
echo "  git clone https://github.com/Pixelgamer4k/ZPC.git"
echo "  cd ZPC"
echo ""
echo "Launch on local network:"
echo "  chmod +x scripts/start-termux.sh"
echo "  ./scripts/start-termux.sh"
echo ""
echo "Dev mode (hot reload):"
echo "  ./scripts/start-termux.sh --dev"
echo ""
echo "Update and relaunch:"
echo "  git pull && ./scripts/start-termux.sh --no-pull"
