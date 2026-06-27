import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TaskCard } from '../../src/components/TaskCard';
import { ProgressBar, SectionHeader } from '../../src/components/ui';
import { agents, getAgentById, getTasksForBusiness } from '../../src/data/mockData';
import { businesses } from '../../src/data/mockData';
import { colors, spacing, typography } from '../../src/theme';
import { formatCurrency, getPhaseLabel } from '../../src/utils/format';

const phases = ['research', 'planning', 'procurement', 'launch', 'optimize'] as const;

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const business = businesses.find((b) => b.id === id);
  const businessTasks = getTasksForBusiness(id ?? '');
  const businessAgents = agents.filter((a) =>
    businessTasks.some((t) => t.assigneeId === a.id),
  );

  if (!business) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Business not found</Text>
      </View>
    );
  }

  const currentPhaseIndex = phases.indexOf(business.phase);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.name}>{business.name}</Text>
      <Text style={styles.tagline}>{business.tagline}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Revenue</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {formatCurrency(business.revenue)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Monthly spend</Text>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            {formatCurrency(business.monthlySpend)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Margin</Text>
          <Text style={styles.statValue}>{business.margin}%</Text>
        </View>
      </View>

      <SectionHeader title="Lifecycle" />
      <View style={styles.lifecycle}>
        {phases.map((phase, i) => (
          <View key={phase} style={styles.phaseStep}>
            <View
              style={[
                styles.phaseDot,
                i <= currentPhaseIndex && styles.phaseDotActive,
                i === currentPhaseIndex && styles.phaseDotCurrent,
              ]}
            />
            <Text
              style={[
                styles.phaseName,
                i <= currentPhaseIndex && styles.phaseNameActive,
              ]}
            >
              {getPhaseLabel(phase)}
            </Text>
          </View>
        ))}
      </View>
      <ProgressBar progress={business.phaseProgress} />

      <SectionHeader title={`Active agents (${businessAgents.length})`} />
      {businessAgents.map((agent) => (
        <Text key={agent.id} style={styles.agentLine}>
          {agent.name} · {agent.role}
        </Text>
      ))}

      <SectionHeader title={`Tasks (${businessTasks.length})`} />
      {businessTasks.map((task) => (
        <View key={task.id} style={styles.taskWrap}>
          <TaskCard
            task={task}
            agentName={task.assigneeId ? getAgentById(task.assigneeId)?.name : undefined}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  content: {
    padding: spacing.lg,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.void,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
  name: {
    ...typography.hero,
    color: colors.text,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },
  statValue: {
    ...typography.subtitle,
    color: colors.text,
    marginTop: spacing.xs,
  },
  lifecycle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  phaseStep: {
    alignItems: 'center',
    flex: 1,
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  phaseDotActive: {
    backgroundColor: colors.primaryDim,
  },
  phaseDotCurrent: {
    backgroundColor: colors.primary,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  phaseName: {
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
  },
  phaseNameActive: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  agentLine: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontSize: 14,
  },
  taskWrap: {
    marginBottom: spacing.md,
  },
});
