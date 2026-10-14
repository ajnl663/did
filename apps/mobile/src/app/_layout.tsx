import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { CredentialEngineProvider } from '../context/CredentialEngineContext';
import { createMockCredentialEngine } from '@did-workers/credential-engine';

const engine = createMockCredentialEngine();

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
      </Stack>
    </CredentialEngineProvider>
  );
}

// Web fallback for initial route
export function unstable_settings() {
  return {
    initialRouteName: '(auth)/language',
  };
}