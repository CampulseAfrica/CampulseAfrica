import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store';

export default function Index() {
  const { isAuthenticated, isGuest, hasCompletedOnboarding } = useAuthStore();

  if (isAuthenticated || isGuest) {
    return <Redirect href="/(tabs)/home" />;
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/(auth)/select-university" />;
  }

  return <Redirect href="/onboarding" />;
}
