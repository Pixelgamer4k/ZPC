import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TaskCard } from '../../src/components/TaskCard';
import { Badge, SectionHeader } from '../../src/components/ui';
import { getAgentById, getBusinessById } from '../../src/data/mockData';
import { useZPCStore } from '../../src/store/useZPCStore';
import { colors, spacing, typography } from '../../src/theme';
import { formatCurrency, getPhaseLabel } from '../../src/utils/format';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tasks = useZPCStore((s) => s.tasks);
  const task = tasks.find((t) => t.id === id);
  const agent = task?.assigneeId ? getAgentById(task.assigneeId) : null;
  const business = task ? getBusinessById(task.businessId) : null;

  if (!task) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Task not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TaskCard task={task} agentName={agent?.name} />

      <SectionHeader title="Details" />
      <View style={styles.detailGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Business</Text>
          <Text style={styles.detailValue}>{business?.name ?? 'Unknown'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Phase</Text>
          <Text style={styles.detailValue}>{getPhaseLabel(task.phase)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Est. cost</Text>
          <Text style={styles.detailValue}>{formatCurrency(task.estimatedCost)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Assignee</Text>
          <Text style={styles.detailValue}>{agent?.name ?? 'Unassigned'}</Text>
        </View>
      </View>

      <SectionHeader title="Goal ancestry" />
      <Text style={styles.desc}>
        Agents see full goal context, not just the task title:
      </Text>
      {task.goalChain.map((goal, i) => (
        <View key={goal} style={styles.goalStep}>
          <Badge label={`${i + 1}`} color={colors.primary} />
          <Text style={styles.goalText}>{goal}</Text>
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
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  detailItem: {
    width: '47%',
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },
  detailValue: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  desc: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  goalStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  goalText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    fontSize: 14,
  },
});
