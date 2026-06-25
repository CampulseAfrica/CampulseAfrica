import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { NewsItem as NewsItemType } from '../../types';

interface NewsItemProps {
  item: NewsItemType;
  onPress?: (item: NewsItemType) => void;
}

export const NewsItem: React.FC<NewsItemProps> = ({ item, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.dateColumn}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.dayOfWeek}>{item.dayOfWeek}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
      {item.isNew && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>New</Text>
        </View>
      )}
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
    borderBottomColor: colors.divider,
  },
  pressed: {
    backgroundColor: colors.background,
  },
  dateColumn: {
    width: 48,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  date: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.textPrimary,
  },
  dayOfWeek: {
    fontSize: typography.tiny.fontSize,
    fontWeight: typography.tiny.fontWeight,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textPrimary,
    lineHeight: typography.body.lineHeight,
  },
  badge: {
    backgroundColor: colors.badgeNew,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    marginLeft: spacing.sm,
  },
  badgeText: {
    fontSize: typography.tiny.fontSize,
    fontWeight: typography.captionSemibold.fontWeight,
    color: colors.badgeNewText,
  },
});
