import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Agent } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import {
  formatRelativeTime,
  getAgentStatusColor,
  getBudgetPercent,
  getDivisionLabel,
  getTrustLabel,
} from '../utils/format';
import { Badge, ProgressBar } from './ui';

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
  onPress?: () => void;
}

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  const statusColor = getAgentStatusColor(agent.status);
  const budgetPct = getBudgetPercent(agent.budgetUsed, agent.budgetLimit);

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: `${statusColor}22` }]}>
          <Text style={[styles.avatarText, { color: statusColor }]}>
            {agent.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{agent.name}</Text>
          <Text style={styles.role}>{agent.role}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      {!compact && (
        <>
          <View style={styles.meta}>
            <Badge label={getDivisionLabel(agent.division)} color={colors.accent} />
            <Badge label={getTrustLabel(agent.trustLevel)} color={colors.textSecondary} />
            <Badge label={agent.modelTier} color={colors.primaryDim} />
          </View>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Budget</Text>
            <Text style={styles.budgetValue}>
              ${agent.budgetUsed.toFixed(1)} / ${agent.budgetLimit}
            </Text>
          </View>
          <ProgressBar
            progress={budgetPct}
            color={budgetPct > 80 ? colors.warning : colors.primary}
          />

          <Text style={styles.heartbeat}>
            Last pulse {formatRelativeTime(agent.lastHeartbeat)}
          </Text>
        </>
      )}
    </View>
  );
}

interface OrgNodeProps {
  agent: Agent;
  depth?: number;
  allAgents: Agent[];
  onSelect?: (agent: Agent) => void;
}

export function OrgNode({ agent, depth = 0, allAgents, onSelect }: OrgNodeProps) {
  const reports = allAgents.filter((a) => a.managerId === agent.id);
  const statusColor = getAgentStatusColor(agent.status);

  return (
    <View style={{ marginLeft: depth * 16 }}>
      <View style={styles.orgRow}>
        {depth > 0 && <View style={styles.connector} />}
        <View style={[styles.orgCard, { borderColor: statusColor }]}>
          <Text style={styles.orgName}>{agent.name}</Text>
          <Text style={styles.orgRole}>{agent.role}</Text>
        </View>
      </View>
      {reports.map((report) => (
        <OrgNode
          key={report.id}
          agent={report}
          depth={depth + 1}
          allAgents={allAgents}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

export function AgentStatusIcon({ status }: { status: Agent['status'] }) {
  const iconMap: Record<Agent['status'], keyof typeof Ionicons.glyphMap> = {
    active: 'radio-button-on',
    idle: 'moon',
    running: 'pulse',
    paused: 'pause-circle',
    error: 'alert-circle',
    terminated: 'close-circle',
  };

  return (
    <Ionicons
      name={iconMap[status]}
      size={16}
      color={getAgentStatusColor(status)}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  compact: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
  },
  role: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  budgetValue: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  heartbeat: {
    ...typography.caption,
    color: colors.textMuted,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  connector: {
    width: 12,
    height: 1,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
  },
  orgCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
  },
  orgName: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  orgRole: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
