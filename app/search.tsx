import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../theme';
import { discoverService } from '../services';
import { TrendingTopic } from '../types';
import { Skeleton } from '../components/ui/Skeleton';
export default function SearchScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts, users, topics..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>

      {query.length === 0 ? (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Trending Topics</Text>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <View key={i} style={styles.topicItem}>
                <Skeleton width="40%" height={16} />
                <Skeleton width={60} height={14} />
              </View>
            ))
          ) : (
            trending.slice(0, 5).map((topic) => (
              <Pressable key={topic.id} style={styles.topicItem}>
                <Text style={styles.topicHashtag}>{topic.hashtag}</Text>
                <Text style={styles.topicCount}>{topic.postsCount.toLocaleString()} posts</Text>
              </Pressable>
            ))
          )}
        </View>
      ) : (
        <FlatList
          data={filteredTopics}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.results}
          renderItem={({ item }) => (
            <Pressable style={styles.resultItem}>
              <Text style={styles.resultIcon}>📈</Text>
              <View>
                <Text style={styles.resultTitle}>{item.hashtag}</Text>
                <Text style={styles.resultMeta}>{item.postsCount.toLocaleString()} posts</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  searchContainer: {
    padding: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius['3xl'],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  recentSection: {
    paddingHorizontal: spacing.lg,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  topicHashtag: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  topicCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  results: {
    paddingHorizontal: spacing.lg,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  resultIcon: {
    fontSize: 20,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  resultMeta: {
    fontSize: 12,
    color: colors.textSecondary,
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
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
