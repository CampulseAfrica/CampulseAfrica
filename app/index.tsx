import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';
import { useAuthStore } from '../store';
import { CampulseLogo } from '../components/ui/Logo';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isGuest, hasCompletedOnboarding } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;

    // Wrap in requestAnimationFrame to ensure layout is mounted
    requestAnimationFrame(() => {
      if (isAuthenticated || isGuest) {
        router.replace('/(tabs)/home');
      } else if (hasCompletedOnboarding) {
        router.replace('/(auth)/select-university');
      } else {
        router.replace('/onboarding');
      }
    });
  }, [ready]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <CampulseLogo width={200} height={40} />
        <Text style={styles.tagline}>Your Campus, Connected</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 0,
  },
});
