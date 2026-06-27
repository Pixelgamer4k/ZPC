import type { AgentStatus, ApprovalStatus, Division, LifecyclePhase, TaskStatus, TrustLevel } from '../types';

const colors = {
  primary: '#14f5d0',
  accent: '#7c6cff',
  warning: '#fbbf24',
  danger: '#f87171',
  success: '#34d399',
  textMuted: '#64748b',
};

export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getAgentStatusColor(status: AgentStatus): string {
  const map: Record<AgentStatus, string> = {
    active: colors.success,
    idle: colors.textMuted,
    running: colors.primary,
    paused: colors.warning,
    error: colors.danger,
    terminated: colors.textMuted,
  };
  return map[status];
}

export function getTaskStatusColor(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    backlog: colors.textMuted,
    ready: colors.accent,
    in_progress: colors.primary,
    review: colors.warning,
    done: colors.success,
    blocked: colors.danger,
  };
  return map[status];
}

export function getApprovalStatusColor(status: ApprovalStatus): string {
  const map: Record<ApprovalStatus, string> = {
    pending: colors.warning,
    approved: colors.success,
    rejected: colors.danger,
    deferred: colors.textMuted,
  };
  return map[status];
}

export function getPhaseLabel(phase: LifecyclePhase): string {
  const map: Record<LifecyclePhase, string> = {
    research: 'Research',
    planning: 'Planning',
    procurement: 'Procurement',
    launch: 'Launch',
    optimize: 'Optimize',
  };
  return map[phase];
}

export function getDivisionLabel(division: Division): string {
  const map: Record<Division, string> = {
    strategy: 'Strategy',
    finance: 'Finance',
    operations: 'Operations',
    growth: 'Growth',
    orchestration: 'Orchestration',
  };
  return map[division];
}

export function getTrustLabel(level: TrustLevel): string {
  const map: Record<TrustLevel, string> = {
    observer: 'Observer',
    advisor: 'Advisor',
    operator: 'Operator',
    trusted: 'Trusted',
  };
  return map[level];
}

export function getRiskColor(risk: 'low' | 'medium' | 'high' | 'critical'): string {
  const map = {
    low: colors.success,
    medium: colors.warning,
    high: colors.danger,
    critical: '#EF4444',
  };
  return map[risk];
}

export function getBudgetPercent(used: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}
