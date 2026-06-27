#!/usr/bin/env bash
set -euo pipefail

REPO="${1:-}"
REF="${2:-main}"

if [[ -z "$REPO" ]]; then
  REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)
fi

if [[ -z "$REPO" ]]; then
  echo "Usage: ./scripts/build-android.sh [owner/repo] [ref]"
  echo "Run from the ZPC repository root, or pass owner/repo explicitly."
  exit 1
fi

echo "Triggering Android build for ${REPO}@${REF}..."
gh workflow run android-build.yml \
  --repo "$REPO" \
  --ref "$REF"

echo ""
echo "Build triggered. Watch progress:"
echo "  gh run list --repo $REPO --workflow=android-build.yml"
echo ""
echo "Download APK when complete:"
echo "  gh run download --repo $REPO"
