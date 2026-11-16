import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { NewsItem as NewsItemType } from '../../types';

interface NewsItemProps {
  item: NewsItemType;
  onPress?: (item: NewsItemType) => void;
}

export const NewsItem: React.FC<NewsItemProps> = ({ item, onPress }) => {
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
      <View style={styles.dateColumn}>
        <Text style={[styles.date, { color: colors.textPrimary }]}>{item.date}</Text>
        <Text style={[styles.dayOfWeek, { color: colors.textSecondary }]}>
          {item.dayOfWeek}
        </Text>
      </View>
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
      </View>
      {item.isNew && (
        <View style={[styles.badge, { backgroundColor: colors.badgeNew }]}>
          <Text style={[styles.badgeText, { color: colors.badgeNewText }]}>New</Text>
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
  },
  dateColumn: {
    width: 48,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  date: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
  },
  dayOfWeek: {
    fontSize: typography.tiny.fontSize,
    fontWeight: typography.tiny.fontWeight,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.lineHeight,
  },
  badge: {
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    marginLeft: spacing.sm,
  },
  badgeText: {
    fontSize: typography.tiny.fontSize,
    fontWeight: typography.captionSemibold.fontWeight,
  },
});
