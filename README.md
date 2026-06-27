# ZPC — Zero Person Company

Autonomous AI business operating system. This repository contains the **ZPC Web Console** — a React dashboard you can run locally on Termux and access from any device on your local network.

## Features

- **Command Center** — Venture lifecycle, metrics, and activity feed
- **Agent Swarm** — Org chart with trust levels and budgets
- **Task Queue** — Work assignments with goal ancestry
- **Approval Gateway** — Human-in-the-loop approve / reject / defer
- **Finance** — Per-agent budgets, daily spend kill switch
- **Activity Log** — Immutable audit trail

## Termux — Run on Local Network

One-time setup in Termux:

```bash
pkg update && pkg upgrade -y
pkg install -y nodejs git
git clone https://github.com/Pixelgamer4k/ZPC.git
cd ZPC
chmod +x scripts/start-termux.sh
```

Launch (pulls latest, builds, serves on LAN):

```bash
./scripts/start-termux.sh
```

Open the URL shown in the terminal — e.g. `http://192.168.x.x:4173` — from your phone browser or any device on the same Wi‑Fi.

### Options

```bash
./scripts/start-termux.sh --dev       # Hot reload dev server (port 5173)
./scripts/start-termux.sh --no-pull # Skip git pull
ZPC_PORT=8080 ./scripts/start-termux.sh  # Custom port
```

Update after changes:

```bash
git pull
./scripts/start-termux.sh --no-pull
```

## Local Development (Desktop)

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:5173` — the dev server binds to `0.0.0.0` so LAN devices can also connect.

Production build:

```bash
cd web
npm run build
npm run preview
```

## CI/CD — GitHub Actions

Every push to `main` builds the static web bundle.

```bash
# Trigger manually
gh workflow run web-build.yml

# Or use helper script
./scripts/build-web.sh

# Watch build
gh run list --workflow=web-build.yml

# Download built site
gh run download
```

Serve the downloaded `dist/` folder on Termux:

```bash
cd dist && npx --yes serve -l 0.0.0.0:4173
```

## Project Structure

```
web/              React + Vite web console
  src/
    pages/        Route screens
    components/   Shared UI
    data/         Demo mock data
    store/        Zustand state
scripts/          Termux launch & CI helpers
.github/          Web build workflow
.cursor/rules/    Quality & architecture rules
```

## Connect to Backend

Open **Settings** and enter your orchestration server URL. When empty, the app runs in offline demo mode.

## License

MIT
