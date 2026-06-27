import { create } from 'zustand';
import { approvals as initialApprovals, tasks as initialTasks } from '../data/mockData';
import { Approval, ApprovalStatus, Task, TaskStatus } from '../types';

interface ZPCState {
  serverUrl: string;
  setServerUrl: (url: string) => void;

  tasks: Task[];
  approvals: Approval[];

  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  resolveApproval: (approvalId: string, status: Exclude<ApprovalStatus, 'pending'>) => void;

  selectedBusinessId: string | null;
  setSelectedBusinessId: (id: string | null) => void;
}

export const useZPCStore = create<ZPCState>((set) => ({
  serverUrl: '',
  setServerUrl: (url) => set({ serverUrl: url }),

  tasks: initialTasks,
  approvals: initialApprovals,

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t,
      ),
    })),

  resolveApproval: (approvalId, status) =>
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === approvalId ? { ...a, status } : a,
      ),
    })),

  selectedBusinessId: 'biz-1',
  setSelectedBusinessId: (id) => set({ selectedBusinessId: id }),
}));
