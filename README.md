# ZPC — Zero Person Company

Autonomous AI business operating system. This repository contains the **ZPC Mobile** Android app — a mobile-first command center for monitoring agent swarms, approving critical decisions, and tracking autonomous ventures.

## Mobile App

Built with **React Native (Expo)** and optimized for Android with a touch-first UX designed for founders who need to govern AI operations from anywhere.

### Features

- **Command Center** — Real-time dashboard with venture lifecycle, metrics, and activity feed
- **Agent Swarm** — Browse and inspect your agent org chart with trust levels and budgets
- **Task Queue** — Monitor work assignments with atomic checkout and goal ancestry
- **Approval Gateway** — Human-in-the-loop decisions with one-tap approve/reject/defer
- **Finance** — Per-agent budgets, daily spend kill switch, LLM routing tiers
- **Audit Trail** — Immutable activity log with cryptographic hashes

### Quick Start

```bash
cd mobile
npm install --legacy-peer-deps
npm start
```

Press `a` to open on Android emulator, or scan the QR code with Expo Go.

### Local Android Build

```bash
cd mobile
npm run build:android
```

APK output: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

## CI/CD — GitHub Actions

Every push to `main` triggers an automated Android APK build.

### Trigger a build manually via gh

```bash
# From repo root
chmod +x scripts/build-android.sh
./scripts/build-android.sh

# Or directly
gh workflow run android-build.yml

# Watch build status
gh run list --workflow=android-build.yml

# Download the APK artifact
gh run download
```

### Workflow details

- **Workflow file:** `.github/workflows/android-build.yml`
- **Output:** Debug APK artifact (retained 30 days)
- **Package ID:** `com.zpc.mobile`

## Architecture

The mobile app connects to the ZPC orchestration backend (FastAPI + LangGraph) via REST/WebSocket. Demo mode ships with realistic mock data so you can explore the full UX offline.

```
mobile/          React Native app (Expo Router)
  app/           File-based routes & screens
  src/           Components, theme, store, types
scripts/         Build automation helpers
.github/         CI workflows
```

## Connect to Backend

Open **Settings** in the app and enter your orchestration server URL. When empty, the app runs in offline demo mode with sample ventures and agents.

## License

MIT
