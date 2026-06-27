import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { ApprovalCard } from '../../src/components/ApprovalCard';
import { OrgNode } from '../../src/components/AgentCard';
import { Card, MetricTile, ProgressBar, SectionHeader } from '../../src/components/ui';
import {
  activityEvents,
  agents,
  approvals,
  businesses,
  dashboardMetrics,
  getAgentById,
} from '../../src/data/mockData';
import { useZPCStore } from '../../src/store/useZPCStore';
import { colors, radius, spacing, typography } from '../../src/theme';
import { formatCurrency, getPhaseLabel } from '../../src/utils/format';

export default function CommandScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { selectedBusinessId, resolveApproval } = useZPCStore();
  const storeApprovals = useZPCStore((s) => s.approvals);

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId) ?? businesses[0];
  const pendingApprovals = storeApprovals.filter((a) => a.status === 'pending').slice(0, 2);
  const ceo = agents.find((a) => a.managerId === null)!;
  const recentActivity = activityEvents.slice(0, 4);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Zero Person Company</Text>
          <Text style={styles.headline}>Command Center</Text>
        </View>
        <Pressable
          style={styles.settingsBtn}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <LinearGradient
        colors={[colors.primaryGlow, 'transparent']}
        style={styles.heroGradient}
      >
        <Card style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Active venture</Text>
              <Text style={styles.heroTitle}>{selectedBusiness.name}</Text>
              <Text style={styles.heroTagline}>{selectedBusiness.tagline}</Text>
            </View>
            <View style={styles.phaseBadge}>
              <Text style={styles.phaseText}>{getPhaseLabel(selectedBusiness.phase)}</Text>
            </View>
          </View>
          <View style={styles.phaseProgress}>
            <View style={styles.phaseRow}>
              <Text style={styles.phaseLabel}>Lifecycle progress</Text>
              <Text style={styles.phasePct}>{selectedBusiness.phaseProgress}%</Text>
            </View>
            <ProgressBar progress={selectedBusiness.phaseProgress} />
          </View>
          <Pressable onPress={() => router.push(`/business/${selectedBusiness.id}`)}>
            <Text style={styles.viewLink}>View business details →</Text>
          </Pressable>
        </Card>
      </LinearGradient>

      <View style={styles.metricsRow}>
        <MetricTile
          label="Revenue"
          value={formatCurrency(dashboardMetrics.totalRevenue, true)}
          subtext="Across ventures"
          accent={colors.success}
        />
        <View style={styles.metricGap} />
        <MetricTile
          label="Spend"
          value={formatCurrency(dashboardMetrics.totalSpend, true)}
          subtext="This month"
          accent={colors.warning}
        />
      </View>

      <View style={styles.metricsRow}>
        <MetricTile
          label="Agents live"
          value={String(dashboardMetrics.runningAgents)}
          subtext={`${agents.length} total`}
          accent={colors.primary}
        />
        <View style={styles.metricGap} />
        <MetricTile
          label="Daily budget"
          value={formatCurrency(dashboardMetrics.dailyBudgetRemaining)}
          subtext="Remaining today"
          accent={colors.accent}
        />
      </View>

      <SectionHeader
        title="Pending approvals"
        action="See all"
        onAction={() => router.push('/(tabs)/approvals')}
      />
      {pendingApprovals.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No pending decisions. Your swarm is running smoothly.</Text>
        </Card>
      ) : (
        pendingApprovals.map((approval) => (
          <View key={approval.id} style={styles.cardSpacing}>
            <ApprovalCard
              approval={approval}
              agentName={getAgentById(approval.agentId)?.name}
              onApprove={() => resolveApproval(approval.id, 'approved')}
              onReject={() => resolveApproval(approval.id, 'rejected')}
              onDefer={() => resolveApproval(approval.id, 'deferred')}
            />
          </View>
        ))
      )}

      <SectionHeader title="Org hierarchy" action="Full swarm" onAction={() => router.push('/(tabs)/agents')} />
      <Card style={styles.orgCard}>
        <OrgNode agent={ceo} allAgents={agents} />
      </Card>

      <SectionHeader title="Recent activity" action="Log" onAction={() => router.push('/activity')} />
      {recentActivity.map((event) => (
        <View key={event.id} style={styles.activityRow}>
          <View style={styles.activityDot} />
          <View style={styles.activityContent}>
            <Text style={styles.activityAction}>{event.action}</Text>
            <Text style={styles.activityDetail} numberOfLines={1}>{event.detail}</Text>
          </View>
          {event.financialImpact !== undefined && (
            <Text
              style={[
                styles.activityImpact,
                { color: event.financialImpact >= 0 ? colors.success : colors.warning },
              ]}
            >
              {event.financialImpact >= 0 ? '+' : ''}
              {formatCurrency(Math.abs(event.financialImpact))}
            </Text>
          )}
        </View>
      ))}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  headline: {
    ...typography.hero,
    color: colors.text,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroGradient: {
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
  },
  heroCard: {
    borderColor: colors.borderFocus,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  heroLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    ...typography.title,
    color: colors.text,
  },
  heroTagline: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  phaseBadge: {
    backgroundColor: colors.primaryGlow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryDim,
  },
  phaseText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  phaseProgress: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phaseLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  phasePct: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  viewLink: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  metricGap: {
    width: spacing.md,
  },
  cardSpacing: {
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  orgCard: {
    marginBottom: spacing.xl,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  activityDetail: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  activityImpact: {
    ...typography.caption,
    fontWeight: '600',
  },
  bottomPad: {
    height: spacing.xxxl,
  },
});
