import { useState } from 'react';
import { Card, ui } from '../components/ui';
import { useZPCStore } from '../store/useZPCStore';

export function SettingsPage() {
  const { serverUrl, setServerUrl } = useZPCStore();
  const [url, setUrl] = useState(serverUrl || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setServerUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <h1>Settings</h1>
        <p className={ui.pageSubtitle}>Server connection and local network access</p>
      </header>

      <Card>
        <label htmlFor="server-url">
          <strong>Orchestration server URL</strong>
        </label>
        <input
          id="server-url"
          className={ui.input}
          style={{ marginTop: 12 }}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-zpc-server.com"
        />
        <p className={ui.pageSubtitle} style={{ marginTop: 8 }}>
          Leave empty for offline demo mode with sample data.
        </p>
        <button type="button" className={`${ui.btn} ${ui.btnPrimary}`} style={{ marginTop: 16 }} onClick={save}>
          Save connection
        </button>
        {saved && <p role="status" style={{ color: 'var(--color-success)', marginTop: 8 }}>Saved</p>}
      </Card>

      <Card style={{ marginTop: 24 }}>
        <h2>Termux on local network</h2>
        <p className={ui.pageSubtitle}>
          After <code>git pull</code>, run <code>./scripts/start-termux.sh</code> from the repo root.
          Open the LAN URL shown in the terminal on any device on your Wi‑Fi.
        </p>
      </Card>
    </div>
  );
}
