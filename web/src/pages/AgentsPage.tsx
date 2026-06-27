import { useMemo, useState } from 'react';
import { AgentCard, OrgNode } from '../components/cards';
import { SectionHeader, ui } from '../components/ui';
import { agents } from '../data/mockData';
import type { Division } from '../types';
import { getDivisionLabel } from '../lib/format';

const divisions: (Division | 'all')[] = ['all', 'orchestration', 'strategy', 'finance', 'operations', 'growth'];

export function AgentsPage() {
  const [filter, setFilter] = useState<Division | 'all'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'org'>('list');
  const ceo = agents.find((a) => a.managerId === null)!;

  const filtered = useMemo(() => agents.filter((a) => {
    const matchDivision = filter === 'all' || a.division === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
    return matchDivision && matchSearch;
  }), [filter, search]);

  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <h1>Agent Swarm</h1>
        <p className={ui.pageSubtitle}>{agents.length} agents · {agents.filter((a) => a.status === 'running').length} active</p>
      </header>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          className={ui.input}
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search agents"
          style={{ flex: 1, minWidth: 200 }}
        />
        <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
          {(['list', 'org'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={viewMode === mode ? ui.filterChipActive : ui.filterChip}
              style={{ border: 'none', borderRadius: 0 }}
              onClick={() => setViewMode(mode)}
            >
              {mode === 'list' ? 'List' : 'Org'}
            </button>
          ))}
        </div>
      </div>

      <div className={ui.filterRow}>
        {divisions.map((d) => (
          <button
            key={d}
            type="button"
            className={`${ui.filterChip} ${filter === d ? ui.filterChipActive : ''}`}
            onClick={() => setFilter(d)}
          >
            {d === 'all' ? 'All' : getDivisionLabel(d)}
          </button>
        ))}
      </div>

      {viewMode === 'org' ? (
        <>
          <SectionHeader title="Reporting structure" />
          <OrgNode agent={ceo} allAgents={agents} />
        </>
      ) : (
        <div className={ui.grid2}>
          {filtered.map((a) => <AgentCard key={a.id} agent={a} />)}
        </div>
      )}
    </div>
  );
}
