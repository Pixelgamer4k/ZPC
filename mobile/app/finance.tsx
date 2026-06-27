import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AgentCard } from '../src/components/AgentCard';
import { MetricTile, ProgressBar, SectionHeader } from '../src/components/ui';
import { agents, businesses, dashboardMetrics } from '../src/data/mockData';
import { colors, spacing, typography } from '../src/theme';
import { formatCurrency, getBudgetPercent } from '../src/utils/format';

export default function FinanceScreen() {
  const totalBudgetUsed = agents.reduce((sum, a) => sum + a.budgetUsed, 0);
  const totalBudgetLimit = agents.reduce((sum, a) => sum + a.budgetLimit, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.metricsRow}>
        <MetricTile
          label="Total spend"
          value={formatCurrency(dashboardMetrics.totalSpend, true)}
          subtext="This month"
          accent={colors.warning}
        />
        <View style={styles.gap} />
        <MetricTile
          label="Revenue"
          value={formatCurrency(dashboardMetrics.totalRevenue, true)}
          subtext="All ventures"
          accent={colors.success}
        />
      </View>

      <SectionHeader title="Daily kill switch" />
      <View style={styles.killSwitch}>
        <Text style={styles.killTitle}>Spend limit active</Text>
        <Text style={styles.killDesc}>
          All agent spending halts when daily threshold is exceeded
        </Text>
        <View style={styles.killRow}>
          <Text style={styles.killLabel}>Remaining today</Text>
          <Text style={styles.killValue}>
            {formatCurrency(dashboardMetrics.dailyBudgetRemaining)}
          </Text>
        </View>
        <ProgressBar
          progress={42}
          color={colors.success}
        />
      </View>

      <SectionHeader title="Agent budgets" />
      {agents.map((agent) => {
        const pct = getBudgetPercent(agent.budgetUsed, agent.budgetLimit);
        return (
          <View key={agent.id} style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetName}>{agent.name}</Text>
              <Text style={styles.budgetAmount}>
                ${agent.budgetUsed.toFixed(1)} / ${agent.budgetLimit}
              </Text>
            </View>
            <ProgressBar
              progress={pct}
              color={pct > 80 ? colors.danger : colors.primary}
            />
          </View>
        );
      })}

      <SectionHeader title="Venture spend" />
      {businesses.map((biz) => (
        <View key={biz.id} style={styles.ventureCard}>
          <Text style={styles.ventureName}>{biz.name}</Text>
          <Text style={styles.ventureSpend}>
            {formatCurrency(biz.monthlySpend)}/mo · Daily {formatCurrency(biz.dailySpendUsed)}/{formatCurrency(biz.dailySpendLimit)}
          </Text>
        </View>
      ))}

      <SectionHeader title="LLM routing tiers" />
      <View style={styles.tierCard}>
        <Text style={styles.tierTitle}>Tier 1 · Local</Text>
        <Text style={styles.tierDesc}>Simple tasks · ~$0.10/M tokens</Text>
      </View>
      <View style={styles.tierCard}>
        <Text style={styles.tierTitle}>Tier 2 · Mid-range</Text>
        <Text style={styles.tierDesc}>Standard ops · ~$0.60/M tokens</Text>
      </View>
      <View style={styles.tierCard}>
        <Text style={styles.tierTitle}>Tier 3 · Premium</Text>
        <Text style={styles.tierDesc}>Complex reasoning · $3-15/M tokens</Text>
      </View>

      <Text style={styles.totalBudget}>
        Swarm budget utilization: {getBudgetPercent(totalBudgetUsed, totalBudgetLimit)}%
      </Text>
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
    paddingBottom: spacing.xxxl,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  gap: {
    width: spacing.md,
  },
  killSwitch: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.success,
    marginBottom: spacing.xl,
  },
  killTitle: {
    ...typography.subtitle,
    color: colors.success,
  },
  killDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginVertical: spacing.sm,
  },
  killRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  killLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  killValue: {
    ...typography.subtitle,
    color: colors.text,
  },
  budgetCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetName: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  budgetAmount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  ventureCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ventureName: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  ventureSpend: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  tierCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  tierTitle: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  tierDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  totalBudget: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
