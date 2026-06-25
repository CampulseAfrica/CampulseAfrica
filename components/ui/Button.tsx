import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: ButtonSize;
}

const sizeConfig: Record<ButtonSize, { paddingV: number; paddingH: number; text: TextStyle }> = {
  sm: {
    paddingV: spacing.sm,
    paddingH: spacing.lg,
    text: { fontSize: typography.buttonSmall.fontSize, fontWeight: typography.buttonSmall.fontWeight },
  },
  md: {
    paddingV: spacing.md,
    paddingH: spacing.xl,
    text: { fontSize: typography.button.fontSize, fontWeight: typography.button.fontWeight },
  },
  lg: {
    paddingV: spacing.lg,
    paddingH: spacing['2xl'],
    text: { fontSize: typography.button.fontSize, fontWeight: typography.button.fontWeight },
  },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'md',
}) => {
  const config = sizeConfig[size];

  const containerStyle: ViewStyle[] = [
    styles.base,
    {
      paddingVertical: config.paddingV,
      paddingHorizontal: config.paddingH,
    },
  ];

  const textStyle: TextStyle[] = [config.text];

  switch (variant) {
    case 'primary':
      containerStyle.push(styles.primaryContainer);
      textStyle.push(styles.primaryText);
      break;
    case 'secondary':
      containerStyle.push(styles.secondaryContainer);
      textStyle.push(styles.secondaryText);
      break;
    case 'ghost':
      containerStyle.push(styles.ghostContainer);
      textStyle.push(styles.ghostText);
      break;
  }

  if (disabled || loading) {
    containerStyle.push(styles.disabled);
  }

  if (fullWidth) {
    containerStyle.push(styles.fullWidth);
  }

  const spinnerColor = variant === 'primary' ? colors.textInverse : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        ...containerStyle,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  primaryText: {
    color: colors.textInverse,
  },
  secondaryText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
});
