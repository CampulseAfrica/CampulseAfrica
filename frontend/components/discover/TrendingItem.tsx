import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { TrendingTopic } from '../../types';

interface TrendingItemProps {
  item: TrendingTopic;
  onPress?: (item: TrendingTopic) => void;
}

export const TrendingItem: React.FC<TrendingItemProps> = ({ item, onPress }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: colors.divider },
        pressed && { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.rank, { color: colors.textTertiary }]}>{item.rank}</Text>
      <View style={styles.info}>
        <Text style={[styles.hashtag, { color: colors.textPrimary }]} numberOfLines={1}>
          #{item.hashtag}
        </Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {item.postsCount.toLocaleString()} posts
        </Text>
      </View>
      <Text style={styles.trendIcon}>📈</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  rank: {
    width: 28,
    fontSize: typography.bodyLarge.fontSize,
    fontWeight: typography.bodyLarge.fontWeight,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  hashtag: {
    fontSize: typography.bodySemibold.fontSize,
    fontWeight: typography.bodySemibold.fontWeight,
  },
  count: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    marginTop: spacing.xxs,
  },
  trendIcon: {
    fontSize: 18,
    marginLeft: spacing.sm,
  },
});
