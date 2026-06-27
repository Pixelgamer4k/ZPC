import { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApprovalCard } from '../../src/components/ApprovalCard';
import { getAgentById } from '../../src/data/mockData';
import { useZPCStore } from '../../src/store/useZPCStore';
import { Approval } from '../../src/types';
import { colors, spacing, typography } from '../../src/theme';

export default function ApprovalsScreen() {
  const insets = useSafeAreaInsets();
  const approvals = useZPCStore((s) => s.approvals);
  const resolveApproval = useZPCStore((s) => s.resolveApproval);

  const sorted = useMemo(() => {
    return [...approvals].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [approvals]);

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  const renderApproval = ({ item }: { item: Approval }) => (
    <View style={styles.cardWrap}>
      <ApprovalCard
        approval={item}
        agentName={getAgentById(item.agentId)?.name}
        onApprove={
          item.status === 'pending'
            ? () => resolveApproval(item.id, 'approved')
            : undefined
        }
        onReject={
          item.status === 'pending'
            ? () => resolveApproval(item.id, 'rejected')
            : undefined
        }
        onDefer={
          item.status === 'pending'
            ? () => resolveApproval(item.id, 'deferred')
            : undefined
        }
      />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Approval Queue</Text>
        <Text style={styles.subtitle}>
          Human-in-the-loop gateway · {pendingCount} pending decision{pendingCount !== 1 ? 's' : ''}
        </Text>
        <View style={styles.gateInfo}>
          <Text style={styles.gateText}>Gate 1 · Research validation</Text>
          <Text style={styles.gateText}>Gate 2 · Budget & plan</Text>
          <Text style={styles.gateText}>Gate 3 · Contracts & spend</Text>
        </View>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderApproval}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  gateInfo: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  gateText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  cardWrap: {
    marginBottom: spacing.md,
  },
});
