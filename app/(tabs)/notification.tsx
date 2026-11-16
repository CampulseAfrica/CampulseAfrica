import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors as defaultColors, spacing, borderRadius, useTheme } from '../../theme';
import { Notification } from '../../types';
import { notificationService } from '../../services';
import { useCacheStore } from '../../store';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

const NotificationItem = React.memo(({ item, colors, isDark }: { item: Notification; colors: any; isDark: boolean }) => {
  return (
    <Pressable
      style={[
        styles.notifItem,
        {
          backgroundColor: item.isRead
            ? colors.surface
            : isDark
            ? colors.primaryLight
            : '#F0EEFF',
          borderColor: colors.border,
          borderWidth: isDark ? 1 : 0,
        },
      ]}
    >
      {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.unreadDot }]} />}
      <View style={styles.notifContent}>
        <Text
          style={[
            styles.notifTitle,
            { color: colors.textPrimary },
            !item.isRead && styles.notifTitleUnread,
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={[styles.notifTime, { color: colors.textSecondary }]}>{item.timeAgo}</Text>
      </View>
    </Pressable>
  );
});

export default function NotificationScreen() {
  const { colors, isDark } = useTheme();
  const cachedNotifications = useCacheStore((s) => s.notifications);
  const setCachedNotifications = useCacheStore((s) => s.setNotifications);

  const [loading, setLoading] = useState(cachedNotifications.length === 0);
  const [notifications, setNotifications] = useState<Notification[]>(cachedNotifications);

  useEffect(() => {
    let isMounted = true;
    notificationService.getNotifications()
      .then((data) => {
        if (isMounted) {
          setNotifications(data);
          setCachedNotifications(data);
          setLoading(false);
        }
      })
      .catch(() => {
        // Network failed — keep showing cached data
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notification</Text>
      </View>

      {loading ? (
        <View style={styles.listContent}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.notifItem,
                {
                  marginBottom: spacing.sm,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: isDark ? 1 : 0,
                },
              ]}
            >
              <View style={[styles.unreadDot, { backgroundColor: colors.unreadDot }]} />
              <View style={styles.notifContent}>
                <Skeleton width="90%" height={14} style={{ marginBottom: spacing.xs }} />
                <Skeleton width="40%" height={12} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlashList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} colors={colors} isDark={isDark} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
          ListEmptyComponent={
            <EmptyState
              icon="🔔"
              title="No notifications"
              subtitle="You're all caught up!"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: defaultColors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: defaultColors.surface,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  notifItemUnread: {
    backgroundColor: '#F0EEFF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: defaultColors.unreadDot,
    marginTop: 6,
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    color: defaultColors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  notifTitleUnread: {
    fontWeight: '600',
  },
  notifTime: {
    fontSize: 12,
    color: defaultColors.textSecondary,
  },
  separator: {
    height: spacing.sm,
  },
});
