#!/usr/bin/env bash
set -euo pipefail

REPO="${1:-}"
REF="${2:-main}"

if [[ -z "$REPO" ]]; then
  REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)
fi

if [[ -z "$REPO" ]]; then
  echo "Usage: ./scripts/build-web.sh [owner/repo] [ref]"
  exit 1
fi

echo "Triggering web build for ${REPO}@${REF}..."
gh workflow run web-build.yml --repo "$REPO" --ref "$REF"

echo ""
echo "Watch: gh run list --repo $REPO --workflow=web-build.yml"
echo "Download: gh run download --repo $REPO"
