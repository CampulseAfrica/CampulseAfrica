import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../../theme';
import { Notification } from '../../types';
import { notificationService } from '../../services';
import { Skeleton } from '../../components/ui/Skeleton';

function NotificationItem({ item }: { item: Notification }) {
  return (
    <Pressable style={[styles.notifItem, !item.isRead && styles.notifItemUnread]}>
      {!item.isRead && <View style={styles.unreadDot} />}
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, !item.isRead && styles.notifTitleUnread]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.notifTime}>{item.timeAgo}</Text>
      </View>
    </Pressable>
  );
}

export default function NotificationScreen() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let isMounted = true;
    notificationService.getNotifications().then((data) => {
      if (isMounted) {
        setNotifications(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>

      {loading ? (
        <View style={styles.listContent}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={[styles.notifItem, { marginBottom: spacing.sm }]}>
              <View style={styles.unreadDot} />
              <View style={styles.notifContent}>
                <Skeleton width="90%" height={14} style={{ marginBottom: spacing.xs }} />
                <Skeleton width="40%" height={12} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
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
    backgroundColor: colors.unreadDot,
    marginTop: 6,
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  notifTitleUnread: {
    fontWeight: '600',
  },
  notifTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  separator: {
    height: spacing.sm,
  },
});
