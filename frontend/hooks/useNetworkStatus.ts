import { useState, useEffect, useCallback } from 'react';
import * as Network from 'expo-network';

/**
 * Hook that provides network connectivity status.
 * Polls every 10 seconds while the component is mounted and provides
 * an on-demand checkConnection() for interaction gating.
 */
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true); // Optimistic default

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const state = await Network.getNetworkStateAsync();
      const connected = state.isConnected === true && state.isInternetReachable !== false;
      setIsConnected(connected);
      return connected;
    } catch {
      // If the check itself fails, assume connected (don't block the user)
      return true;
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkConnection();

    // Poll every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  return { isConnected, checkConnection };
}
