import { useNavigate } from 'react-router-dom';
import { ApprovalCard, OrgNode } from '../components/cards';
import { Card, MetricTile, ProgressBar, SectionHeader, ui } from '../components/ui';
import {
  activityEvents,
  agents,
  businesses,
  dashboardMetrics,
  getAgentById,
} from '../data/mockData';
import { useZPCStore } from '../store/useZPCStore';
import { formatCurrency, getPhaseLabel } from '../lib/format';

export function CommandPage() {
  const navigate = useNavigate();
  const { selectedBusinessId, resolveApproval } = useZPCStore();
  const storeApprovals = useZPCStore((s) => s.approvals);

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId) ?? businesses[0];
  const pendingApprovals = storeApprovals.filter((a) => a.status === 'pending').slice(0, 2);
  const ceo = agents.find((a) => a.managerId === null)!;

  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <h1>Command Center</h1>
        <p className={ui.pageSubtitle}>Monitor ventures, agents, and pending decisions</p>
      </header>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className={ui.pageSubtitle}>Active venture</div>
            <h2>{selectedBusiness.name}</h2>
            <p className={ui.pageSubtitle}>{selectedBusiness.tagline}</p>
          </div>
          <BadgeInline label={getPhaseLabel(selectedBusiness.phase)} />
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className={ui.pageSubtitle}>Lifecycle progress</span>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{selectedBusiness.phaseProgress}%</span>
          </div>
          <ProgressBar progress={selectedBusiness.phaseProgress} />
        </div>
        <button type="button" className={`${ui.btn} ${ui.btnPrimary}`} style={{ marginTop: 16 }} onClick={() => navigate(`/business/${selectedBusiness.id}`)}>
          View business details
        </button>
      </Card>

      <div className={ui.metricGrid} style={{ marginTop: 24 }}>
        <MetricTile label="Revenue" value={formatCurrency(dashboardMetrics.totalRevenue, true)} subtext="Across ventures" accent="var(--color-success)" />
        <MetricTile label="Spend" value={formatCurrency(dashboardMetrics.totalSpend, true)} subtext="This month" accent="var(--color-warning)" />
        <MetricTile label="Agents live" value={String(dashboardMetrics.runningAgents)} subtext={`${agents.length} total`} />
        <MetricTile label="Daily budget" value={formatCurrency(dashboardMetrics.dailyBudgetRemaining)} subtext="Remaining today" accent="var(--color-accent)" />
      </div>

      <SectionHeader title="Pending approvals" action="See all" onAction={() => navigate('/approvals')} />
      <div className={ui.stack}>
        {pendingApprovals.length === 0 ? (
          <Card><p className={ui.pageSubtitle}>No pending decisions.</p></Card>
        ) : (
          pendingApprovals.map((a) => (
            <ApprovalCard
              key={a.id}
              approval={a}
              agentName={getAgentById(a.agentId)?.name}
              onApprove={() => resolveApproval(a.id, 'approved')}
              onReject={() => resolveApproval(a.id, 'rejected')}
              onDefer={() => resolveApproval(a.id, 'deferred')}
            />
          ))
        )}
      </div>

      <SectionHeader title="Org hierarchy" action="Full swarm" onAction={() => navigate('/agents')} />
      <Card><OrgNode agent={ceo} allAgents={agents} /></Card>

      <SectionHeader title="Recent activity" action="Log" onAction={() => navigate('/activity')} />
      <div className={ui.stack}>
        {activityEvents.slice(0, 4).map((e) => (
          <Card key={e.id}>
            <strong>{e.action}</strong>
            <p className={ui.pageSubtitle}>{e.detail}</p>
            {e.financialImpact !== undefined && (
              <span style={{ color: e.financialImpact >= 0 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                {e.financialImpact >= 0 ? '+' : ''}{formatCurrency(Math.abs(e.financialImpact))}
              </span>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function BadgeInline({ label }: { label: string }) {
  return (
    <span style={{
      padding: '8px 16px',
      borderRadius: 999,
      border: '1px solid var(--color-primary-dim)',
      color: 'var(--color-primary)',
      fontSize: '0.875rem',
      fontWeight: 600,
      alignSelf: 'flex-start',
    }}>
      {label}
    </span>
  );
}
