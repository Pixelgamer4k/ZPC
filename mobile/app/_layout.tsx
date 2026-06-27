import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { colors } from '../src/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: colors.void },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="agent/[id]"
            options={{ title: 'Agent Details', presentation: 'card' }}
          />
          <Stack.Screen
            name="task/[id]"
            options={{ title: 'Task Details', presentation: 'card' }}
          />
          <Stack.Screen
            name="approval/[id]"
            options={{ title: 'Approval', presentation: 'modal' }}
          />
          <Stack.Screen
            name="business/[id]"
            options={{ title: 'Business', presentation: 'card' }}
          />
          <Stack.Screen name="activity" options={{ title: 'Activity Log' }} />
          <Stack.Screen name="finance" options={{ title: 'Finance' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings', presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.void,
  },
});
