import { Link } from 'react-router-dom';
import type { Agent, Task, Approval } from '../types';
import {
  formatRelativeTime,
  getAgentStatusColor,
  getBudgetPercent,
  getDivisionLabel,
  getPhaseLabel,
  getTaskStatusColor,
  getTrustLabel,
  formatCurrency,
  getRiskColor,
} from '../lib/format';
import { Badge, Card, ProgressBar } from './ui';
import styles from './cards.module.css';

export function AgentCard({ agent, compact = false }: { agent: Agent; compact?: boolean }) {
  const statusColor = getAgentStatusColor(agent.status);
  const budgetPct = getBudgetPercent(agent.budgetUsed, agent.budgetLimit);

  return (
    <Card className={compact ? styles.compact : undefined}>
      <div className={styles.agentHeader}>
        <div className={styles.avatar} style={{ background: `${statusColor}22`, color: statusColor }}>
          {agent.name.charAt(0)}
        </div>
        <div className={styles.agentInfo}>
          <Link to={`/agents/${agent.id}`} className={styles.agentName}>{agent.name}</Link>
          <div className={styles.agentRole}>{agent.role}</div>
        </div>
        <span className={styles.statusDot} style={{ background: statusColor }} aria-hidden />
      </div>
      {!compact && (
        <>
          <div className={styles.meta}>
            <Badge label={getDivisionLabel(agent.division)} color="var(--color-accent)" />
            <Badge label={getTrustLabel(agent.trustLevel)} color="var(--color-text-secondary)" />
            <Badge label={agent.modelTier} color="var(--color-primary-dim)" />
          </div>
          <div className={styles.budgetRow}>
            <span>Budget</span>
            <span>${agent.budgetUsed.toFixed(1)} / ${agent.budgetLimit}</span>
          </div>
          <ProgressBar progress={budgetPct} color={budgetPct > 80 ? 'var(--color-warning)' : undefined} />
          <div className={styles.muted}>Last pulse {formatRelativeTime(agent.lastHeartbeat)}</div>
        </>
      )}
    </Card>
  );
}

export function TaskCard({ task, agentName }: { task: Task; agentName?: string }) {
  return (
    <Card>
      <div className={styles.meta}>
        <Badge label={task.status.replace('_', ' ')} color={getTaskStatusColor(task.status)} />
        <Badge label={task.priority} color={task.priority === 'critical' ? 'var(--color-danger)' : 'var(--color-text-muted)'} />
      </div>
      <h3 className={styles.cardTitle}>{task.title}</h3>
      <p className={styles.cardDesc}>{task.description}</p>
      <div className={styles.footer}>
        <span className={styles.muted}>{getPhaseLabel(task.phase)}{agentName ? ` · ${agentName}` : ''}</span>
        <span className={styles.muted}>{formatRelativeTime(task.updatedAt)}</span>
      </div>
    </Card>
  );
}

export function ApprovalCard({
  approval,
  agentName,
  onApprove,
  onReject,
  onDefer,
}: {
  approval: Approval;
  agentName?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onDefer?: () => void;
}) {
  const isPending = approval.status === 'pending';

  return (
    <Card className={isPending ? styles.pending : undefined}>
      <div className={styles.meta}>
        <Badge label={`Gate ${approval.gate}`} color="var(--color-accent)" />
        <Badge label={approval.riskLevel} color={getRiskColor(approval.riskLevel)} />
        {!isPending && <Badge label={approval.status} color="var(--color-text-muted)" />}
      </div>
      <h3 className={styles.cardTitle}>{approval.title}</h3>
      <p className={styles.cardDesc}>{approval.summary}</p>
      <div className={styles.stats}>
        <div>
          <div className={styles.statLabel}>Impact</div>
          <div>{approval.financialImpact > 0 ? formatCurrency(approval.financialImpact, true) : 'None'}</div>
        </div>
        <div>
          <div className={styles.statLabel}>Confidence</div>
          <div style={{ color: 'var(--color-primary)' }}>{approval.confidence}%</div>
        </div>
      </div>
      <ProgressBar progress={approval.confidence} />
      <div className={styles.recBox}>
        <div className={styles.statLabel}>Agent recommendation</div>
        <p>{approval.recommendation}</p>
        {agentName && <div className={styles.muted}>From {agentName} · {formatRelativeTime(approval.createdAt)}</div>}
      </div>
      {isPending && onApprove && onReject && (
        <div className={styles.actions}>
          <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={onReject}>Reject</button>
          {onDefer && <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={onDefer}>Later</button>}
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onApprove}>Approve</button>
        </div>
      )}
    </Card>
  );
}

export function OrgNode({ agent, depth = 0, allAgents }: { agent: Agent; depth?: number; allAgents: Agent[] }) {
  const reports = allAgents.filter((a) => a.managerId === agent.id);
  const statusColor = getAgentStatusColor(agent.status);

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div className={styles.orgCard} style={{ borderLeftColor: statusColor }}>
        <strong>{agent.name}</strong>
        <div className={styles.muted}>{agent.role}</div>
      </div>
      {reports.map((r) => (
        <OrgNode key={r.id} agent={r} depth={depth + 1} allAgents={allAgents} />
      ))}
    </div>
  );
}
