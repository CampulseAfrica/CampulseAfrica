import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors as defaultColors, spacing, borderRadius, useTheme } from '../theme';
import { discoverService } from '../services';
import { TrendingTopic } from '../types';
import { Skeleton } from '../components/ui/Skeleton';

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState<TrendingTopic[]>([]);

  useEffect(() => {
    let isMounted = true;
    discoverService.getTrending().then((data) => {
      if (isMounted) {
        setTrending(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const filteredTopics = trending.filter((t) =>
    t.hashtag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ padding: spacing.xs }}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
          placeholder="Search posts, users, topics..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>

      {query.length === 0 ? (
        <View style={styles.recentSection}>
          <Text style={[styles.recentTitle, { color: colors.textPrimary }]}>Trending Topics</Text>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <View key={i} style={[styles.topicItem, { borderBottomColor: colors.border }]}>
                <Skeleton width="40%" height={16} />
                <Skeleton width={60} height={14} />
              </View>
            ))
          ) : (
            trending.slice(0, 5).map((topic) => (
              <Pressable key={topic.id} style={[styles.topicItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.topicHashtag, { color: colors.textPrimary }]}>{topic.hashtag}</Text>
                <Text style={[styles.topicCount, { color: colors.textSecondary }]}>{topic.postsCount.toLocaleString()} posts</Text>
              </Pressable>
            ))
          )}
        </View>
      ) : (
        <FlashList
          data={filteredTopics}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.results}
          renderItem={({ item }) => (
            <Pressable style={[styles.resultItem, { borderBottomColor: colors.border }]}>
              <Text style={styles.resultIcon}>📈</Text>
              <View>
                <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>{item.hashtag}</Text>
                <Text style={[styles.resultMeta, { color: colors.textSecondary }]}>{item.postsCount.toLocaleString()} posts</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No results found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try different keywords or check the spelling
              </Text>
            </View>
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
    paddingTop: spacing.md,
  },
  backText: {
    fontSize: 16,
    color: defaultColors.primary,
    fontWeight: '500',
  },
  searchContainer: {
    padding: spacing.lg,
  },
  searchInput: {
    backgroundColor: defaultColors.surface,
    borderWidth: 1,
    borderColor: defaultColors.border,
    borderRadius: borderRadius['3xl'],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: defaultColors.textPrimary,
  },
  recentSection: {
    paddingHorizontal: spacing.lg,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: defaultColors.textPrimary,
    marginBottom: spacing.lg,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.divider,
  },
  topicHashtag: {
    fontSize: 15,
    fontWeight: '600',
    color: defaultColors.textPrimary,
  },
  topicCount: {
    fontSize: 13,
    color: defaultColors.textSecondary,
  },
  results: {
    paddingHorizontal: spacing.lg,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.divider,
    gap: spacing.md,
  },
  resultIcon: {
    fontSize: 20,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: defaultColors.textPrimary,
  },
  resultMeta: {
    fontSize: 12,
    color: defaultColors.textSecondary,
    marginTop: 2,
  },
  emptyResults: {
    alignItems: 'center',
    paddingTop: spacing['7xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: defaultColors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: defaultColors.textSecondary,
    textAlign: 'center',
  },
});
