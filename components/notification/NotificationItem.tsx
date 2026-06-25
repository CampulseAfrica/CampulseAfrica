import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
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
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        !item.isRead && styles.unreadBg,
      ]}
    >
      {/* Unread indicator dot */}
      <View style={styles.dotColumn}>
        {!item.isRead && <View style={styles.dot} />}
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            !item.isRead && styles.unreadTitle,
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={styles.time}>{item.timeAgo}</Text>
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
    borderBottomColor: colors.divider,
  },
  pressed: {
    backgroundColor: colors.background,
  },
  unreadBg: {
    backgroundColor: colors.divider,
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
    backgroundColor: colors.unreadDot,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  title: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textPrimary,
    lineHeight: typography.body.lineHeight,
  },
  unreadTitle: {
    fontWeight: typography.bodySemibold.fontWeight,
  },
  time: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
