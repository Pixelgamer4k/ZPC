import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useZPCStore } from '../src/store/useZPCStore';
import { colors, radius, spacing, typography } from '../src/theme';

export default function SettingsScreen() {
  const { serverUrl, setServerUrl } = useZPCStore();
  const [url, setUrl] = useState(serverUrl || 'https://api.zpc.local');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const save = () => {
    setServerUrl(url);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Section label="Orchestration server">
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://your-zpc-server.com"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="url"
        />
        <Text style={styles.hint}>
          Connect to your ZPC orchestration backend. Leave empty for offline demo mode.
        </Text>
      </Section>

      <Section label="Notifications">
        <Row
          icon="notifications"
          title="Push alerts"
          subtitle="Approval requests and spend warnings"
          trailing={
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ true: colors.primaryDim, false: colors.border }}
              thumbColor={pushEnabled ? colors.primary : colors.textMuted}
            />
          }
        />
        <Row
          icon="phone-portrait"
          title="Haptic feedback"
          subtitle="Vibration on approval actions"
          trailing={
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ true: colors.primaryDim, false: colors.border }}
              thumbColor={hapticsEnabled ? colors.primary : colors.textMuted}
            />
          }
        />
      </Section>

      <Section label="Security">
        <Row
          icon="lock-closed"
          title="Biometric lock"
          subtitle="Require fingerprint to approve spend"
        />
        <Row
          icon="key"
          title="API credentials"
          subtitle="Manage board operator tokens"
        />
      </Section>

      <Pressable style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Save & connect</Text>
      </Pressable>
    </ScrollView>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Row({
  icon,
  title,
  subtitle,
  trailing,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  trailing?: ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={colors.textSecondary} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {trailing ?? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
    </View>
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
  section: {
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.lg,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.body,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  rowSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveText: {
    ...typography.subtitle,
    color: colors.void,
    fontWeight: '700',
  },
});
