import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  RefreshControl,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store';
import { useGuestGate } from '../../hooks';
import { postService } from '../../services';
import { Post, VoteType, FeedTab } from '../../types';
import { CampulseLogo } from '../../components/ui/Logo';
import { SearchIcon, TrueIcon, MisleadingIcon, FalseIcon, CommentsIcon, ShareIcon, VerifiedBadge } from '../../components/ui/Icons';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { PostCard } from '../../components/post/PostCard';

const { width } = Dimensions.get('window');

const FEED_TABS: { key: FeedTab; label: string }[] = [
  { key: 'mySchool', label: 'My School' },
  { key: 'otherCampus', label: 'Other campus' },
];

const FeedTabContent = ({ tab, isActive }: { tab: FeedTab; isActive: boolean }) => {
  const { selectedUniversity, isAuthenticated } = useAuthStore();
  const { gateAction } = useGuestGate();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!isActive && !hasFetched.current) return;
    hasFetched.current = true;
    
    let isMounted = true;
    setLoading(true);
    postService.getPosts(tab, selectedUniversity?.name).then((newPosts) => {
      if (isMounted) {
        setPosts(newPosts);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [isActive, tab, selectedUniversity]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const newPosts = await postService.getPosts(tab, selectedUniversity?.name);
    setPosts(newPosts);
    setRefreshing(false);
  }, [tab, selectedUniversity]);

  const handleVote = (postId: string, voteType: VoteType) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              userVote: p.userVote === voteType ? null : voteType,
              trueCount: voteType === 'true'
                ? p.userVote === 'true' ? p.trueCount - 1 : p.trueCount + 1
                : p.trueCount,
              misleadingCount: voteType === 'misleading'
                ? p.userVote === 'misleading' ? p.misleadingCount - 1 : p.misleadingCount + 1
                : p.misleadingCount,
              falseCount: voteType === 'false'
                ? p.userVote === 'false' ? p.falseCount - 1 : p.falseCount + 1
                : p.falseCount,
            }
          : p
      )
    );
  };

  if (loading) {
    return (
      <View style={[styles.feedContent, { width }]}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <View key={idx} style={[styles.postCard, { marginBottom: spacing.sm }]}>
            <View style={styles.postHeader}>
              <Skeleton width={44} height={44} borderRadius={22} style={{ marginRight: spacing.md }} />
              <View style={{ flex: 1, gap: 4 }}>
                <Skeleton width="40%" height={14} />
                <Skeleton width="25%" height={12} />
              </View>
            </View>
            <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
            <Skeleton width="80%" height={14} style={{ marginBottom: spacing.md }} />
            <Skeleton width="100%" height={200} borderRadius={borderRadius.md} style={{ marginBottom: spacing.md }} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={{ width, flex: 1 }}>
      <FlashList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onVote={(postId, voteType) => gateAction(() => handleVote(postId, voteType))}
            onPress={(postId) => router.push(`/post/${postId}`)}
            onFollow={() => gateAction(() => {})}
            onComment={() => gateAction(() => {})}
            onShare={() => gateAction(() => {})}
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
            title="No posts yet"
            subtitle="Be the first to share something on campus!"
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { selectedUniversity, isAuthenticated } = useAuthStore();
  const { gateAction, showGateModal, dismissGateModal } = useGuestGate();
  const [activeTab, setActiveTab] = useState<FeedTab>('mySchool');
  
  const contentListRef = useRef<FlatList>(null);
  const tabLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});
  const isTappingTab = useRef(false);

  const indicatorLeft = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      left: withSpring(indicatorLeft.value, { mass: 1, damping: 15, stiffness: 120 }),
      width: withSpring(indicatorWidth.value, { mass: 1, damping: 15, stiffness: 120 }),
    };
  });

  const syncTabBar = useCallback((key: FeedTab) => {
    setActiveTab(key);
    const layout = tabLayouts.current[key];
    if (layout) {
      indicatorLeft.value = layout.x + layout.width * 0.2;
      indicatorWidth.value = layout.width * 0.6;
    }
  }, []);

  const handleTabLayout = (key: FeedTab, layout: { x: number; width: number }) => {
    tabLayouts.current[key] = layout;
    if (key === activeTab) {
      indicatorLeft.value = layout.x + layout.width * 0.2;
      indicatorWidth.value = layout.width * 0.6;
    }
  };

  const handleTabPress = (key: FeedTab, index: number) => {
    isTappingTab.current = true;
    syncTabBar(key);
    contentListRef.current?.scrollToIndex({ index, animated: true });
  };

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && !isTappingTab.current) {
      syncTabBar(viewableItems[0].item.key);
    }
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CampulseLogo width={131} height={26} />
        <Pressable onPress={() => router.push('/search')}>
          <SearchIcon />
        </Pressable>
      </View>

      {/* Feed Tabs */}
      <View style={styles.feedTabs}>
        {FEED_TABS.map((tab, index) => (
          <Pressable
            key={tab.key}
            style={styles.feedTab}
            onPress={() => handleTabPress(tab.key, index)}
            onLayout={(e) => handleTabLayout(tab.key, e.nativeEvent.layout)}
          >
            <Text
              style={[
                styles.feedTabText,
                activeTab === tab.key && styles.feedTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
        <Reanimated.View
          style={[styles.feedTabIndicator, animatedIndicatorStyle]}
        />
      </View>

      {/* Posts Feed */}
      <FlatList
        ref={contentListRef}
        data={FEED_TABS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <FeedTabContent tab={item.key} isActive={activeTab === item.key} />
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollAnimationEnd={() => { isTappingTab.current = false; }}
        onMomentumScrollEnd={() => { isTappingTab.current = false; }}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
      />

      {/* Guest Gate Modal */}
      <Modal
        visible={showGateModal}
        transparent
        animationType="slide"
        onRequestClose={dismissGateModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={dismissGateModal} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create an account to continue</Text>
            <Text style={styles.modalSubtitle}>
              Sign up to vote, comment, post, and connect with your campus community.
            </Text>
            <Pressable
              style={styles.modalSignUp}
              onPress={() => {
                dismissGateModal();
                router.push('/(auth)/sign-up');
              }}
            >
              <Text style={styles.modalSignUpText}>Sign Up</Text>
            </Pressable>
            <Pressable style={styles.modalLater} onPress={dismissGateModal}>
              <Text style={styles.modalLaterText}>Maybe Later</Text>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
  },
  feedTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  feedTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    position: 'relative',
  },
  feedTabText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  feedTabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  feedTabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  feedContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Extra padding to allow scrolling past the floating tab bar
  },
  // PostCard styles
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.md,
  },
  postUserInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  verifiedBadge: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
  },
  universityText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  followButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius['3xl'],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  postContent: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    resizeMode: 'cover',
  },
  voteContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  voteButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  voteIcon: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  voteIconActive: {
    color: colors.primary,
  },
  voteLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  voteLabelActive: {
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  // Guest Gate Modal
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing['3xl'],
    paddingBottom: spacing['5xl'],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing['2xl'],
  },
  modalSignUp: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius['3xl'],
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalSignUpText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  modalLater: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalLaterText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
});
