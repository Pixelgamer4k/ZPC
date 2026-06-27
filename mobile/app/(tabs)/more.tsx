import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../src/components/ui';
import { colors, radius, spacing, typography } from '../../src/theme';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  route: string;
  accent: string;
}

const menuItems: MenuItem[] = [
  {
    icon: 'pulse',
    title: 'Activity Log',
    subtitle: 'Immutable audit trail of all agent actions',
    route: '/activity',
    accent: colors.primary,
  },
  {
    icon: 'wallet',
    title: 'Finance',
    subtitle: 'Budgets, spend limits, and cost routing',
    route: '/finance',
    accent: colors.warning,
  },
  {
    icon: 'settings',
    title: 'Settings',
    subtitle: 'Server connection and notifications',
    route: '/settings',
    accent: colors.accent,
  },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
    >
      <Text style={styles.title}>More</Text>
      <Text style={styles.subtitle}>Operations, finance, and configuration</Text>

      {menuItems.map((item) => (
        <Pressable key={item.route} onPress={() => router.push(item.route as never)}>
          <Card style={styles.menuCard}>
            <View style={[styles.iconWrap, { backgroundColor: `${item.accent}22` }]}>
              <Ionicons name={item.icon} size={24} color={item.accent} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Card>
        </Pressable>
      ))}

      <Card style={styles.aboutCard}>
        <Text style={styles.aboutLabel}>ZPC Mobile</Text>
        <Text style={styles.aboutTitle}>Zero Person Company</Text>
        <Text style={styles.aboutText}>
          Autonomous AI business operating system. Monitor your agent swarm,
          approve critical decisions, and track ventures from your pocket.
        </Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </Card>
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
    paddingBottom: spacing.xxxl,
  },
  title: {
    ...typography.hero,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  aboutCard: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  aboutLabel: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  aboutTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },
  version: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
});
