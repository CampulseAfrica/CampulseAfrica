import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';

interface GuestGateModalProps {
  visible: boolean;
  onSignUp: () => void;
  onDismiss: () => void;
}

export const GuestGateModal: React.FC<GuestGateModalProps> = ({
  visible,
  onSignUp,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onDismiss} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.emoji}>🔒</Text>
          <Text style={styles.title}>Create an account to continue</Text>
          <Text style={styles.subtitle}>
            Sign up to vote, comment, share, and interact with the Campulse community.
          </Text>

          <Pressable
            onPress={onSignUp}
            style={({ pressed }) => [
              styles.signUpButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </Pressable>

          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.dismissButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.dismissText}>Maybe Later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.md,
    paddingBottom: spacing['4xl'],
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.border,
    marginBottom: spacing['2xl'],
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.body.lineHeight,
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.md,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  signUpText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.textInverse,
  },
  dismissButton: {
    paddingVertical: spacing.md,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  dismissText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.85,
  },
});
