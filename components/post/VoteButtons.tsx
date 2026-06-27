import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import type { VoteType } from '../../types';
import { TrueIcon, MisleadingIcon, FalseIcon } from '../ui/Icons';

interface VoteButtonsProps {
  userVote: VoteType | null;
  onVote: (voteType: VoteType) => void;
}

interface VoteOption {
  type: VoteType;
  label: string;
  IconComponent: React.FC<{ width?: number; height?: number; color?: string }>;
  activeColor: string;
}

const voteOptions: VoteOption[] = [
  { type: 'true', label: 'True', IconComponent: TrueIcon, activeColor: colors.voteTrue },
  { type: 'misleading', label: 'Misleading', IconComponent: MisleadingIcon, activeColor: colors.voteMisleading },
  { type: 'false', label: 'False', IconComponent: FalseIcon, activeColor: colors.voteFalse },
];

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  userVote,
  onVote,
}) => {
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
              color={isActive ? colors.surface : colors.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.surface : colors.textPrimary }
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    fontSize: typography.bodySemibold.fontSize,
    fontWeight: typography.bodySemibold.fontWeight,
  },
  pressed: {
    opacity: 0.85,
  },
});
