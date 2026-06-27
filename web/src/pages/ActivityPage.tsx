import { Card, ui } from '../components/ui';
import { activityEvents, getAgentById } from '../data/mockData';
import { formatCurrency, formatRelativeTime } from '../lib/format';

export function ActivityPage() {
  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <h1>Activity Log</h1>
        <p className={ui.pageSubtitle}>Immutable audit trail of all agent actions</p>
      </header>

      <div className={ui.stack}>
        {activityEvents.map((event) => {
          const agent = getAgentById(event.agentId);
          return (
            <Card key={event.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <strong>{event.action}</strong>
                <span className={ui.pageSubtitle}>{formatRelativeTime(event.timestamp)}</span>
              </div>
              <p className={ui.pageSubtitle}>{event.detail}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{agent?.name ?? event.agentId}</span>
                {event.financialImpact !== undefined && (
                  <span style={{ color: event.financialImpact >= 0 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {event.financialImpact >= 0 ? '+' : '-'}{formatCurrency(Math.abs(event.financialImpact))}
                  </span>
                )}
              </div>
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>#{event.hash}</code>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
