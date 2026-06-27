import { useMemo, useState } from 'react';
import { TaskCard } from '../components/cards';
import { ui } from '../components/ui';
import { getAgentById } from '../data/mockData';
import { useZPCStore } from '../store/useZPCStore';
import type { TaskStatus } from '../types';

const filters: (TaskStatus | 'all')[] = ['all', 'in_progress', 'ready', 'review', 'blocked', 'done'];

export function TasksPage() {
  const tasks = useZPCStore((s) => s.tasks);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const filtered = useMemo(() =>
    filter === 'all' ? tasks : tasks.filter((t) => t.status === filter),
  [tasks, filter]);

  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <h1>Task Queue</h1>
        <p className={ui.pageSubtitle}>
          {tasks.filter((t) => t.status === 'in_progress').length} in progress · atomic checkout enforced
        </p>
      </header>

      <div className={ui.filterRow}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`${ui.filterChip} ${filter === f ? ui.filterChipActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className={ui.grid2}>
        {filtered.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            agentName={t.assigneeId ? getAgentById(t.assigneeId)?.name : undefined}
          />
        ))}
      </div>
    </div>
  );
}
