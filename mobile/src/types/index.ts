export type AgentStatus = 'active' | 'idle' | 'running' | 'paused' | 'error' | 'terminated';
export type TrustLevel = 'observer' | 'advisor' | 'operator' | 'trusted';
export type TaskStatus = 'backlog' | 'ready' | 'in_progress' | 'review' | 'done' | 'blocked';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'deferred';
export type LifecyclePhase = 'research' | 'planning' | 'procurement' | 'launch' | 'optimize';
export type Division =
  | 'strategy'
  | 'finance'
  | 'operations'
  | 'growth'
  | 'orchestration';

export interface Agent {
  id: string;
  name: string;
  role: string;
  division: Division;
  status: AgentStatus;
  trustLevel: TrustLevel;
  managerId: string | null;
  budgetUsed: number;
  budgetLimit: number;
  tasksCompleted: number;
  lastHeartbeat: string;
  capabilities: string[];
  modelTier: 'local' | 'mid' | 'premium';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
  businessId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  phase: LifecyclePhase;
  goalChain: string[];
  estimatedCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  title: string;
  summary: string;
  agentId: string;
  businessId: string;
  status: ApprovalStatus;
  financialImpact: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  createdAt: string;
  gate: 1 | 2 | 3;
}

export interface Business {
  id: string;
  name: string;
  tagline: string;
  phase: LifecyclePhase;
  phaseProgress: number;
  revenue: number;
  monthlySpend: number;
  dailySpendLimit: number;
  dailySpendUsed: number;
  margin: number;
  activeAgents: number;
  pendingApprovals: number;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  agentId: string;
  action: string;
  detail: string;
  financialImpact?: number;
  hash: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalSpend: number;
  activeBusinesses: number;
  runningAgents: number;
  pendingApprovals: number;
  dailyBudgetRemaining: number;
}
