import { Stack } from 'expo-router';
import { CredentialEngineProvider } from '../context/CredentialEngineContext';
import { createMockCredentialEngine } from '@did-workers/credential-engine';

const engine = createMockCredentialEngine();

export default function RootLayout() {
  return (
    <CredentialEngineProvider engine={engine}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="(auth)/language"
      >
        <Stack.Screen name="(auth)/language" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(auth)/pin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="credential" options={{ presentation: 'card' }} />
        <Stack.Screen name="connect" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings" options={{ presentation: 'card' }} />
      </Stack>
    </CredentialEngineProvider>
  );
}

export function unstable_settings() {
  return {
    initialRouteName: '(auth)/language',
  };
}
