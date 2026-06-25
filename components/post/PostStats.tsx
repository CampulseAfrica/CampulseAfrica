import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface PostStatsProps {
  trueCount: number;
  misleadingCount: number;
  falseCount: number;
  commentsCount: number;
  sharesCount: number;
}

const formatCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

export const PostStats: React.FC<PostStatsProps> = ({
  trueCount,
  misleadingCount,
  falseCount,
  commentsCount,
  sharesCount,
}) => {
  const totalVotes = trueCount + misleadingCount + falseCount;

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.statIcon}>✓</Text>
        <Text style={styles.statText}>{formatCount(totalVotes)}</Text>
      </View>

      <View style={styles.dot} />

      <View style={styles.stat}>
        <Text style={styles.statIcon}>💬</Text>
        <Text style={styles.statText}>{formatCount(commentsCount)}</Text>
      </View>

      <View style={styles.dot} />

      <View style={styles.stat}>
        <Text style={styles.statIcon}>↗</Text>
        <Text style={styles.statText}>{formatCount(sharesCount)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
  },
});
