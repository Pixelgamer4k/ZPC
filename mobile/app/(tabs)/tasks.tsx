import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskCard } from '../../src/components/TaskCard';
import { agents, getAgentById } from '../../src/data/mockData';
import { useZPCStore } from '../../src/store/useZPCStore';
import { Task, TaskStatus } from '../../src/types';
import { colors, radius, spacing, typography } from '../../src/theme';

const statusFilters: (TaskStatus | 'all')[] = [
  'all',
  'in_progress',
  'ready',
  'review',
  'blocked',
  'done',
];

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const tasks = useZPCStore((s) => s.tasks);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: tasks.length };
    tasks.forEach((t) => {
      map[t.status] = (map[t.status] ?? 0) + 1;
    });
    return map;
  }, [tasks]);

  const renderTask = ({ item }: { item: Task }) => (
    <Pressable
      style={styles.cardWrap}
      onPress={() => router.push(`/task/${item.id}`)}
    >
      <TaskCard
        task={item}
        agentName={item.assigneeId ? getAgentById(item.assigneeId)?.name : undefined}
      />
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Task Queue</Text>
        <Text style={styles.subtitle}>
          {tasks.filter((t) => t.status === 'in_progress').length} in progress · atomic checkout enforced
        </Text>
      </View>

      <FlatList
        data={statusFilters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.filterChip, filter === item && styles.filterChipActive]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item === 'all' ? 'All' : item.replace('_', ' ')} ({counts[item] ?? 0})
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tasks match this filter.</Text>
          </View>
        }
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
  },
  filters: {
    maxHeight: 44,
    marginBottom: spacing.md,
  },
  filtersContent: {
    paddingHorizontal: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  cardWrap: {
    marginBottom: spacing.md,
  },
  empty: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
