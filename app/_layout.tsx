import React from 'react';
import { LogBox } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeStore } from '../store/themeStore';
import { Toast } from '../components/ui/Toast';

// Suppress expo-router's internal unhandled promise rejections and React 19 timing warnings during route initialization
LogBox.ignoreLogs([
  'Uncaught (in promise',
  'TypeError: undefined is not a function',
  "Can't perform a React state update on a component that hasn't mounted yet",
]);

function ThemedStatusBar() {
  const isDark = useThemeStore((s) => s.mode === 'dark');
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemedStatusBar />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#12121A' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="search"
            options={{ animation: 'fade', presentation: 'modal' }}
          />
        </Stack>
      </SafeAreaProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
