import { Card, MetricTile, ProgressBar, SectionHeader, ui } from '../components/ui';
import { agents, businesses, dashboardMetrics } from '../data/mockData';
import { formatCurrency, getBudgetPercent } from '../lib/format';

export function FinancePage() {
  const totalUsed = agents.reduce((sum, a) => sum + a.budgetUsed, 0);
  const totalLimit = agents.reduce((sum, a) => sum + a.budgetLimit, 0);

  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <h1>Finance</h1>
        <p className={ui.pageSubtitle}>Budgets, spend limits, and LLM routing tiers</p>
      </header>

      <div className={ui.metricGrid}>
        <MetricTile label="Total spend" value={formatCurrency(dashboardMetrics.totalSpend, true)} subtext="This month" accent="var(--color-warning)" />
        <MetricTile label="Revenue" value={formatCurrency(dashboardMetrics.totalRevenue, true)} subtext="All ventures" accent="var(--color-success)" />
      </div>

      <SectionHeader title="Daily kill switch" />
      <Card style={{ borderColor: 'var(--color-success)', marginBottom: 24 }}>
        <h3 style={{ color: 'var(--color-success)' }}>Spend limit active</h3>
        <p className={ui.pageSubtitle}>All agent spending halts when daily threshold is exceeded</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}>
          <span className={ui.pageSubtitle}>Remaining today</span>
          <strong>{formatCurrency(dashboardMetrics.dailyBudgetRemaining)}</strong>
        </div>
        <ProgressBar progress={42} color="var(--color-success)" />
      </Card>

      <SectionHeader title="Agent budgets" />
      <div className={ui.stack}>
        {agents.map((agent) => {
          const pct = getBudgetPercent(agent.budgetUsed, agent.budgetLimit);
          return (
            <Card key={agent.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{agent.name}</strong>
                <span className={ui.pageSubtitle}>${agent.budgetUsed.toFixed(1)} / ${agent.budgetLimit}</span>
              </div>
              <ProgressBar progress={pct} color={pct > 80 ? 'var(--color-danger)' : undefined} />
            </Card>
          );
        })}
      </div>

      <SectionHeader title="Venture spend" />
      <div className={ui.stack}>
        {businesses.map((biz) => (
          <Card key={biz.id}>
            <strong>{biz.name}</strong>
            <p className={ui.pageSubtitle}>
              {formatCurrency(biz.monthlySpend)}/mo · Daily {formatCurrency(biz.dailySpendUsed)}/{formatCurrency(biz.dailySpendLimit)}
            </p>
          </Card>
        ))}
      </div>

      <p className={ui.pageSubtitle} style={{ textAlign: 'center', marginTop: 32 }}>
        Swarm budget utilization: {getBudgetPercent(totalUsed, totalLimit)}%
      </p>
    </div>
  );
}
