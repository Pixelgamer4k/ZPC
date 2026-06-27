import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ApprovalCard } from '../../src/components/ApprovalCard';
import { getAgentById } from '../../src/data/mockData';
import { useZPCStore } from '../../src/store/useZPCStore';
import { colors, spacing, typography } from '../../src/theme';

export default function ApprovalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const approvals = useZPCStore((s) => s.approvals);
  const resolveApproval = useZPCStore((s) => s.resolveApproval);
  const approval = approvals.find((a) => a.id === id);

  if (!approval) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Approval not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ApprovalCard
        approval={approval}
        agentName={getAgentById(approval.agentId)?.name}
        onApprove={
          approval.status === 'pending'
            ? () => resolveApproval(approval.id, 'approved')
            : undefined
        }
        onReject={
          approval.status === 'pending'
            ? () => resolveApproval(approval.id, 'rejected')
            : undefined
        }
        onDefer={
          approval.status === 'pending'
            ? () => resolveApproval(approval.id, 'deferred')
            : undefined
        }
      />
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
});
