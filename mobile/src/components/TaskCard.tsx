import { StyleSheet, Text, View } from 'react-native';
import { Task } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import {
  formatRelativeTime,
  getPhaseLabel,
  getTaskStatusColor,
} from '../utils/format';
import { Badge } from './ui';

interface TaskCardProps {
  task: Task;
  agentName?: string;
}

export function TaskCard({ task, agentName }: TaskCardProps) {
  const statusColor = getTaskStatusColor(task.status);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Badge
          label={task.status.replace('_', ' ')}
          color={statusColor}
        />
        <Badge
          label={task.priority}
          color={
            task.priority === 'critical'
              ? colors.danger
              : task.priority === 'high'
                ? colors.warning
                : colors.textMuted
          }
        />
      </View>

      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          {getPhaseLabel(task.phase)}
          {agentName ? ` · ${agentName}` : ''}
        </Text>
        <Text style={styles.meta}>{formatRelativeTime(task.updatedAt)}</Text>
      </View>

      {task.goalChain.length > 0 && (
        <View style={styles.goalChain}>
          <Text style={styles.goalLabel}>Goal chain</Text>
          <Text style={styles.goalText} numberOfLines={1}>
            {task.goalChain.join(' → ')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  goalChain: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  goalLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  goalText: {
    ...typography.caption,
    color: colors.primaryDim,
    fontSize: 12,
  },
});
