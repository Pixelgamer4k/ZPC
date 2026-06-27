import { FlatList, StyleSheet, Text, View } from 'react-native';
import { activityEvents, getAgentById } from '../src/data/mockData';
import { colors, spacing, typography } from '../src/theme';
import { formatCurrency, formatRelativeTime } from '../src/utils/format';

export default function ActivityScreen() {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={activityEvents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const agent = getAgentById(item.agentId);
        return (
          <View style={styles.event}>
            <View style={styles.eventHeader}>
              <Text style={styles.action}>{item.action}</Text>
              <Text style={styles.time}>{formatRelativeTime(item.timestamp)}</Text>
            </View>
            <Text style={styles.detail}>{item.detail}</Text>
            <View style={styles.eventFooter}>
              <Text style={styles.agent}>{agent?.name ?? item.agentId}</Text>
              {item.financialImpact !== undefined && (
                <Text
                  style={[
                    styles.impact,
                    { color: item.financialImpact >= 0 ? colors.success : colors.warning },
                  ]}
                >
                  {item.financialImpact >= 0 ? '+' : '-'}
                  {formatCurrency(Math.abs(item.financialImpact))}
                </Text>
              )}
            </View>
            <Text style={styles.hash}>#{item.hash}</Text>
          </View>
        );
      }}
    />
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
  event: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  action: {
    ...typography.subtitle,
    color: colors.text,
    flex: 1,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  detail: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  agent: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  impact: {
    ...typography.caption,
    fontWeight: '600',
  },
  hash: {
    ...typography.mono,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.sm,
  },
});
