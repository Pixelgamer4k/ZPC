import { useMemo } from 'react';
import { ApprovalCard } from '../components/cards';
import { Card, ui } from '../components/ui';
import { getAgentById } from '../data/mockData';
import { useZPCStore } from '../store/useZPCStore';

export function ApprovalsPage() {
  const approvals = useZPCStore((s) => s.approvals);
  const resolveApproval = useZPCStore((s) => s.resolveApproval);
  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  const sorted = useMemo(() => [...approvals].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (b.status === 'pending' && a.status !== 'pending') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }), [approvals]);

  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <h1>Approval Queue</h1>
        <p className={ui.pageSubtitle}>
          Human-in-the-loop gateway · {pendingCount} pending decision{pendingCount !== 1 ? 's' : ''}
        </p>
      </header>

      <Card style={{ marginBottom: 24 }}>
        <p className={ui.pageSubtitle}>Gate 1 · Research validation</p>
        <p className={ui.pageSubtitle}>Gate 2 · Budget & plan</p>
        <p className={ui.pageSubtitle}>Gate 3 · Contracts & spend</p>
      </Card>

      <div className={ui.stack}>
        {sorted.map((a) => (
          <ApprovalCard
            key={a.id}
            approval={a}
            agentName={getAgentById(a.agentId)?.name}
            onApprove={a.status === 'pending' ? () => resolveApproval(a.id, 'approved') : undefined}
            onReject={a.status === 'pending' ? () => resolveApproval(a.id, 'rejected') : undefined}
            onDefer={a.status === 'pending' ? () => resolveApproval(a.id, 'deferred') : undefined}
          />
        ))}
      </div>
    </div>
  );
}
