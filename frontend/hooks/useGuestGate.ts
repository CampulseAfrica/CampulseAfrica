import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../store';

/**
 * Hook that gates actions behind authentication.
 * When a guest tries a gated action, shows an alert prompting sign up.
 * Returns a function that wraps any callback with the gate check.
 */
export function useGuestGate() {
  const { isAuthenticated, isGuest } = useAuthStore();
  const [showGateModal, setShowGateModal] = useState(false);

  const gateAction = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
        return;
      }
      // Show gate modal for guests
      setShowGateModal(true);
    },
    [isAuthenticated]
  );

  const dismissGateModal = useCallback(() => {
    setShowGateModal(false);
  }, []);

  return {
    gateAction,
    showGateModal,
    dismissGateModal,
    isGuest: !isAuthenticated,
  };
}
