import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
  Modal,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useTheme } from '../../theme';
import { useAuthStore, useCacheStore, useToastStore } from '../../store';
import { useGuestGate, useNetworkStatus } from '../../hooks';
import { postService } from '../../services';
import { Post, VoteType, FeedTab } from '../../types';
import { CampulseLogo } from '../../components/ui/Logo';
import { EmptyState } from '../../components/ui/EmptyState';
import { PostCard } from '../../components/post/PostCard';
import { HomeTabSwitcher } from '../../components/home/HomeTabSwitcher';
import { CampusFilterBar } from '../../components/home/CampusFilterBar';
import { Skeleton } from '../../components/ui/Skeleton';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { currentUser, selectedUniversity, isAuthenticated } = useAuthStore();
  const { gateAction, showGateModal, dismissGateModal } = useGuestGate();
  const { checkConnection } = useNetworkStatus();
  const showToast = useToastStore((s) => s.show);

  // Active feed tab: 'mySchool' | 'otherCampus'
  const [activeTab, setActiveTab] = useState<FeedTab>('mySchool');

  // Campus filters for "Other campuses"
  const [campuses, setCampuses] = useState<string[]>(['All campuses']);
  const [selectedCampus, setSelectedCampus] = useState<string>('All campuses');

  // Cache store
  const cachedPosts = useCacheStore((s) =>
    activeTab === 'mySchool' ? s.mySchoolPosts : s.otherCampusPosts
  );
  const setCachedPosts = useCacheStore((s) =>
    activeTab === 'mySchool' ? s.setMySchoolPosts : s.setOtherCampusPosts
  );

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(cachedPosts.length === 0);
  const [posts, setPosts] = useState<Post[]>(cachedPosts);

  // Sync posts immediately from cache when activeTab switches
  useEffect(() => {
    const currentCached = activeTab === 'mySchool'
      ? useCacheStore.getState().mySchoolPosts
      : useCacheStore.getState().otherCampusPosts;
    if (currentCached.length > 0) {
      setPosts(currentCached);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [activeTab]);

  // Fetch available campuses on mount
  useEffect(() => {
    let isMounted = true;
    postService.getCampusFilters().then((list) => {
      if (isMounted && list && list.length > 0) {
        setCampuses(list);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch posts whenever activeTab, selectedCampus, or selectedUniversity changes
  const fetchPosts = useCallback(async (showLoadingIndicator = true) => {
    if (showLoadingIndicator && posts.length === 0) {
      setLoading(true);
    }
    try {
      const data = await postService.getPosts(
        activeTab,
        selectedUniversity?.name,
        activeTab === 'otherCampus' ? selectedCampus : undefined
      );
      setPosts(data);
      setCachedPosts(data);
    } catch (err) {
      console.error('[HomeScreen] Error fetching posts:', err);
      showToast('Could not refresh feed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, selectedCampus, selectedUniversity, posts.length, setCachedPosts, showToast]);

  useEffect(() => {
    fetchPosts(true);
  }, [activeTab, selectedCampus, selectedUniversity]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(false);
  }, [fetchPosts]);

  const offlineGate = useCallback(
    async (action: () => void) => {
      const connected = await checkConnection();
      if (!connected) {
        showToast('No internet connection');
        return;
      }
      action();
    },
    [checkConnection, showToast]
  );

  const handleVote = (postId: string, voteType: VoteType) => {
    // Users cannot vote on their own posts
    const targetPost = posts.find((p) => p.id === postId);
    if (targetPost && currentUser && targetPost.user.id === currentUser.id) {
      return;
    }

    // Optimistic vote update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const currentVote = p.userVote;
        const isRemoving = currentVote === voteType;
        const newVote = isRemoving ? null : voteType;

        let trueChange = 0;
        let misleadingChange = 0;
        let falseChange = 0;

        if (currentVote === 'true') trueChange -= 1;
        if (currentVote === 'misleading') misleadingChange -= 1;
        if (currentVote === 'false') falseChange -= 1;

        if (newVote === 'true') trueChange += 1;
        if (newVote === 'misleading') misleadingChange += 1;
        if (newVote === 'false') falseChange += 1;

        return {
          ...p,
          userVote: newVote,
          trueCount: Math.max(0, p.trueCount + trueChange),
          misleadingCount: Math.max(0, p.misleadingCount + misleadingChange),
          falseCount: Math.max(0, p.falseCount + falseChange),
        };
      })
    );

    // Call service in background
    postService.votePost(postId, voteType).catch(() => {
      // Revert if error
      fetchPosts(false);
    });
  };

  const handleFollow = (userId: string) => {
    postService.toggleFollow(userId).catch(() => {});
  };

  const handleBookmark = (postId: string) => {
    postService.bookmarkPost(postId).catch(() => {});
  };

  const handleShare = (postId: string) => {
    postService.sharePost(postId).catch(() => {});
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <CampulseLogo height={32} />
        <Pressable
          onPress={() => router.push('/search')}
          style={({ pressed }) => [
            styles.searchButton,
            { backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6' },
            pressed && styles.pressed,
          ]}
        >
          <Search color={colors.primary} size={20} strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Top Segmented Tab Switcher ("My school" vs "Other campuses") */}
      <HomeTabSwitcher
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'otherCampus') {
            setSelectedCampus('All campuses');
          }
        }}
      />

      {/* Campus Filter Pills Bar (Only shown on "Other campuses") */}
      {activeTab === 'otherCampus' && (
        <CampusFilterBar
          campuses={campuses}
          selectedCampus={selectedCampus}
          onSelectCampus={(c) => setSelectedCampus(c)}
        />
      )}

      {/* Feed List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          {Array.from({ length: 2 }).map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.skeletonCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isDark ? colors.border : '#E5E7EB',
                },
              ]}
            >
              <View style={styles.skeletonHeader}>
                <Skeleton width={40} height={40} borderRadius={20} />
                <View style={{ flex: 1, marginLeft: 12, gap: 6 }}>
                  <Skeleton width="45%" height={14} borderRadius={4} />
                  <Skeleton width="30%" height={12} borderRadius={4} />
                </View>
              </View>
              <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
              <Skeleton width="75%" height={14} borderRadius={4} style={{ marginBottom: 14 }} />
              <Skeleton width="100%" height={180} borderRadius={12} style={{ marginBottom: 14 }} />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Skeleton width="31%" height={48} borderRadius={10} />
                <Skeleton width="31%" height={48} borderRadius={10} />
                <Skeleton width="31%" height={48} borderRadius={10} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlashList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onVote={(postId, voteType) =>
                gateAction(() => offlineGate(() => handleVote(postId, voteType)))
              }
              onPress={(postId) => router.push(`/post/${postId}`)}
              onFollow={(userId) =>
                gateAction(() => offlineGate(() => handleFollow(userId)))
              }
              onBookmark={(postId) =>
                gateAction(() => offlineGate(() => handleBookmark(postId)))
              }
              onComment={(postId) =>
                gateAction(() => router.push(`/post/${postId}`))
              }
              onShare={(postId) =>
                gateAction(() => offlineGate(() => handleShare(postId)))
              }
              isGuest={!isAuthenticated}
            />
          )}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="📭"
              title="No posts found"
              subtitle={
                activeTab === 'otherCampus' && selectedCampus !== 'All campuses'
                  ? `No posts from ${selectedCampus} yet.`
                  : 'Be the first to share something on campus!'
              }
            />
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {/* Guest Gate Modal */}
      <Modal
        visible={showGateModal}
        transparent
        animationType="slide"
        onRequestClose={dismissGateModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={dismissGateModal} />
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: isDark ? 1 : 0,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Create an account to continue
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Sign up to vote, comment, post, and connect with your campus community.
            </Text>
            <Pressable
              style={[styles.modalSignUp, { backgroundColor: colors.primary }]}
              onPress={() => {
                dismissGateModal();
                router.push('/(auth)/sign-up');
              }}
            >
              <Text style={styles.modalSignUpText}>Sign Up</Text>
            </Pressable>
            <Pressable style={styles.modalLater} onPress={dismissGateModal}>
              <Text style={[styles.modalLaterText, { color: colors.textSecondary }]}>
                Maybe Later
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  skeletonCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalSignUp: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSignUpText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalLater: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalLaterText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
