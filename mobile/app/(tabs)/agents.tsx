import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgentCard, OrgNode } from '../../src/components/AgentCard';
import { SectionHeader } from '../../src/components/ui';
import { agents } from '../../src/data/mockData';
import { Agent, Division } from '../../src/types';
import { colors, radius, spacing, typography } from '../../src/theme';
import { getDivisionLabel } from '../../src/utils/format';

const divisions: (Division | 'all')[] = [
  'all',
  'orchestration',
  'strategy',
  'finance',
  'operations',
  'growth',
];

export default function AgentsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Division | 'all'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'org'>('list');

  const filtered = useMemo(() => {
    return agents.filter((agent) => {
      const matchesDivision = filter === 'all' || agent.division === filter;
      const matchesSearch =
        search === '' ||
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.role.toLowerCase().includes(search.toLowerCase());
      return matchesDivision && matchesSearch;
    });
  }, [filter, search]);

  const ceo = agents.find((a) => a.managerId === null)!;

  const renderAgent = ({ item }: { item: Agent }) => (
    <Pressable
      style={styles.cardWrap}
      onPress={() => router.push(`/agent/${item.id}`)}
    >
      <AgentCard agent={item} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Agent Swarm</Text>
        <Text style={styles.subtitle}>{agents.length} agents · {agents.filter(a => a.status === 'running').length} active</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search agents..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.viewToggle}>
          <Pressable
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>List</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, viewMode === 'org' && styles.toggleActive]}
            onPress={() => setViewMode('org')}
          >
            <Text style={[styles.toggleText, viewMode === 'org' && styles.toggleTextActive]}>Org</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={divisions}
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
              {item === 'all' ? 'All' : getDivisionLabel(item)}
            </Text>
          </Pressable>
        )}
      />

      {viewMode === 'org' ? (
        <View style={styles.orgContainer}>
          <SectionHeader title="Reporting structure" />
          <View style={styles.orgTree}>
            <OrgNode agent={ceo} allAgents={agents} />
          </View>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderAgent}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.body,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  toggleBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  toggleActive: {
    backgroundColor: colors.primaryGlow,
  },
  toggleText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.primary,
  },
  filters: {
    maxHeight: 44,
    marginBottom: spacing.md,
  },
  filtersContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
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
  orgContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  orgTree: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
