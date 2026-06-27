import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AgentCard } from '../../src/components/AgentCard';
import { TaskCard } from '../../src/components/TaskCard';
import { Badge, SectionHeader } from '../../src/components/ui';
import { agents, getAgentById, getDirectReports, tasks } from '../../src/data/mockData';
import { colors, spacing, typography } from '../../src/theme';
import { getTrustLabel } from '../../src/utils/format';

export default function AgentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const agent = getAgentById(id ?? '');
  const reports = getDirectReports(id ?? '');
  const manager = agent?.managerId ? getAgentById(agent.managerId) : null;
  const agentTasks = tasks.filter((t) => t.assigneeId === id);

  if (!agent) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Agent not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AgentCard agent={agent} />

      <SectionHeader title="Trust level" />
      <View style={styles.trustCard}>
        <Ionicons name="shield" size={20} color={colors.primary} />
        <View style={styles.trustInfo}>
          <Text style={styles.trustTitle}>{getTrustLabel(agent.trustLevel)}</Text>
          <Text style={styles.trustDesc}>
            Progressive autonomy — agents earn trust through reliable performance
          </Text>
        </View>
      </View>

      {manager && (
        <>
          <SectionHeader title="Reports to" />
          <Text style={styles.linkText}>{manager.name} · {manager.role}</Text>
        </>
      )}

      {reports.length > 0 && (
        <>
          <SectionHeader title={`Direct reports (${reports.length})`} />
          {reports.map((r) => (
            <Text key={r.id} style={styles.linkText}>{r.name} · {r.role}</Text>
          ))}
        </>
      )}

      <SectionHeader title="Capabilities" />
      <View style={styles.capabilities}>
        {agent.capabilities.map((cap) => (
          <Badge key={cap} label={cap} color={colors.accent} />
        ))}
      </View>

      <SectionHeader title={`Assigned tasks (${agentTasks.length})`} />
      {agentTasks.map((task) => (
        <View key={task.id} style={styles.taskWrap}>
          <TaskCard task={task} />
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
    gap: spacing.md,
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
  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trustInfo: {
    flex: 1,
  },
  trustTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  trustDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  linkText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  capabilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  taskWrap: {
    marginBottom: spacing.md,
  },
});
