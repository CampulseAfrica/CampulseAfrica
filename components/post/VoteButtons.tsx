import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ThemeColors, lightColors } from '../../theme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import type { VoteType } from '../../types';
import { TrueIcon, MisleadingIcon, FalseIcon } from '../ui/Icons';

interface VoteButtonsProps {
  userVote: VoteType | null;
  onVote: (voteType: VoteType) => void;
  colors?: ThemeColors;
}

interface VoteOption {
  type: VoteType;
  label: string;
  IconComponent: React.FC<{ width?: number; height?: number; color?: string }>;
  activeColor: string;
}

export const VoteButtons: React.FC<VoteButtonsProps> = memo(({
  userVote,
  onVote,
  colors = lightColors,
}) => {
  const voteOptions: VoteOption[] = [
    { type: 'true', label: 'True', IconComponent: TrueIcon, activeColor: colors.voteTrue },
    { type: 'misleading', label: 'Misleading', IconComponent: MisleadingIcon, activeColor: colors.voteMisleading },
    { type: 'false', label: 'False', IconComponent: FalseIcon, activeColor: colors.voteFalse },
  ];

  return (
    <View style={styles.container}>
      {voteOptions.map((option) => {
        const isActive = userVote === option.type;
        return (
          <Pressable
            key={option.type}
            onPress={() => onVote(option.type)}
            style={({ pressed }) => [
              styles.button,
              isActive && {
                backgroundColor: option.activeColor,
                borderColor: option.activeColor,
              },
              !isActive && {
                borderColor: colors.border,
              },
              pressed && styles.pressed,
            ]}
          >
            <option.IconComponent
              width={16}
              height={16}
              color={isActive ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? '#FFFFFF' : colors.textPrimary }
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: typography.bodySemibold.fontSize,
    fontWeight: typography.bodySemibold.fontWeight,
  },
});
