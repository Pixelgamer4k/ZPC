import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Approval } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import {
  formatCurrency,
  formatRelativeTime,
  getRiskColor,
} from '../utils/format';
import { Badge, ProgressBar } from './ui';

interface ApprovalCardProps {
  approval: Approval;
  agentName?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onDefer?: () => void;
}

export function ApprovalCard({
  approval,
  agentName,
  onApprove,
  onReject,
  onDefer,
}: ApprovalCardProps) {
  const isPending = approval.status === 'pending';
  const riskColor = getRiskColor(approval.riskLevel);

  const handleAction = (action: () => void | undefined) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action?.();
  };

  return (
    <View style={[styles.card, isPending && styles.pendingCard]}>
      <View style={styles.header}>
        <Badge label={`Gate ${approval.gate}`} color={colors.accent} />
        <Badge label={approval.riskLevel} color={riskColor} />
        {!isPending && (
          <Badge label={approval.status} color={colors.textMuted} />
        )}
      </View>

      <Text style={styles.title}>{approval.title}</Text>
      <Text style={styles.summary}>{approval.summary}</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Impact</Text>
          <Text style={styles.statValue}>
            {approval.financialImpact > 0
              ? formatCurrency(approval.financialImpact, true)
              : 'None'}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Confidence</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {approval.confidence}%
          </Text>
        </View>
      </View>

      <ProgressBar progress={approval.confidence} color={colors.primary} height={4} />

      <View style={styles.recommendation}>
        <Text style={styles.recLabel}>Agent recommendation</Text>
        <Text style={styles.recText}>{approval.recommendation}</Text>
        {agentName && (
          <Text style={styles.agentRef}>From {agentName} · {formatRelativeTime(approval.createdAt)}</Text>
        )}
      </View>

      {isPending && onApprove && onReject && (
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleAction(onReject)}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </Pressable>
          {onDefer && (
            <Pressable
              style={[styles.actionBtn, styles.deferBtn]}
              onPress={() => handleAction(onDefer)}
            >
              <Text style={styles.deferText}>Later</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => handleAction(onApprove)}
          >
            <Text style={styles.approveText}>Approve</Text>
          </Pressable>
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
    gap: spacing.md,
  },
  pendingCard: {
    borderColor: colors.warning,
    backgroundColor: colors.warningDim,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  summary: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stat: {
    flex: 1,
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
  recommendation: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  recLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  recText: {
    ...typography.body,
    color: colors.text,
    fontSize: 14,
  },
  agentRef: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: colors.dangerDim,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deferBtn: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  approveBtn: {
    backgroundColor: colors.primary,
  },
  rejectText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '600',
  },
  deferText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  approveText: {
    ...typography.caption,
    color: colors.void,
    fontWeight: '700',
  },
});
