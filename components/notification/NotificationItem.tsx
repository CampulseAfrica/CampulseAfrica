import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { Notification } from '../../types';

interface NotificationItemProps {
  item: Notification;
  onPress: (item: Notification) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: colors.divider },
        pressed && { backgroundColor: colors.background },
        !item.isRead && { backgroundColor: colors.primaryLight },
      ]}
    >
      {/* Unread indicator dot */}
      <View style={styles.dotColumn}>
        {!item.isRead && (
          <View style={[styles.dot, { backgroundColor: colors.unreadDot }]} />
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
            !item.isRead && styles.unreadTitle,
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {item.timeAgo}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  dotColumn: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  title: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.lineHeight,
  },
  unreadTitle: {
    fontWeight: typography.bodySemibold.fontWeight,
  },
  time: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    marginTop: spacing.xs,
  },
});
