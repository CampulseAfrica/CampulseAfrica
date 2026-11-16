import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import type { FeaturedNews } from '../../types';

interface FeaturedNewsCardProps {
  item: FeaturedNews;
  onBookmark: (item: FeaturedNews) => void;
  onPress?: (item: FeaturedNews) => void;
}

export const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({
  item,
  onBookmark,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface },
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: item.image }}
        style={[styles.heroImage, { backgroundColor: colors.skeleton }]}
        resizeMode="cover"
      />

      <View style={styles.body}>
        <Text
          style={[styles.headline, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={[styles.timeText, { color: colors.textTertiary }]}>
              {item.timeAgo}
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {item.category}
            </Text>
          </View>
          <Pressable
            onPress={() => onBookmark(item)}
            hitSlop={8}
            style={({ pressed: p }) => p && styles.pressed}
          >
            <Text style={styles.bookmarkIcon}>
              {item.isBookmarked ? '🔖' : '🔖'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  pressed: {
    opacity: 0.95,
  },
  heroImage: {
    width: '100%',
    height: 180,
  },
  body: {
    padding: spacing.lg,
  },
  headline: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.lineHeight,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: spacing.sm,
  },
  categoryText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.captionSemibold.fontWeight,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
});
