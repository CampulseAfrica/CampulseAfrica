import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors } from '../../theme/colors';
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
  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <View style={styles.body}>
        <Text style={styles.headline} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.timeText}>{item.timeAgo}</Text>
            <View style={styles.dot} />
            <Text style={styles.categoryText}>{item.category}</Text>
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
    backgroundColor: colors.surface,
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
    backgroundColor: colors.skeleton,
  },
  body: {
    padding: spacing.lg,
  },
  headline: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textSecondary,
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
    color: colors.textTertiary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: spacing.sm,
  },
  categoryText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.captionSemibold.fontWeight,
    color: colors.primary,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
});
