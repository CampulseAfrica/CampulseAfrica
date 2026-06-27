import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store';
import { useGuestGate } from '../../hooks';
import { postService } from '../../services';
import { Post, VoteType, FeedTab } from '../../types';
import { mockPosts } from '../../mocks';
import { CampulseLogo } from '../../components/ui/Logo';
import { SearchIcon, TrueIcon, MisleadingIcon, FalseIcon, CommentsIcon, ShareIcon } from '../../components/ui/Icons';

function PostCard({
  post,
  onVote,
  onPress,
  isGuest,
  gateAction,
}: {
  post: Post;
  onVote: (postId: string, voteType: VoteType) => void;
  onPress: () => void;
  isGuest: boolean;
  gateAction: (action: () => void) => void;
}) {
  const timeAgo = '2h ago';

  return (
    <Pressable style={styles.postCard} onPress={onPress}>
      {/* Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.postUserInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{post.user.fullName}</Text>
            {post.user.isVerified && (
              <Text style={styles.verifiedBadge}>✓</Text>
            )}
          </View>
          <Text style={styles.universityText}>
            {post.user.university.name}. {timeAgo}
          </Text>
        </View>
        <Pressable
          style={styles.followButton}
          onPress={() => gateAction(() => {})}
        >
          <Text style={styles.followButtonText}>Follow</Text>
        </Pressable>
      </View>

      {/* Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Image */}
      {post.images.length > 0 && (
        <Image source={{ uri: post.images[0] }} style={styles.postImage} />
      )}

      {/* Vote Buttons */}
      <View style={styles.voteContainer}>
        {(['true', 'misleading', 'false'] as VoteType[]).map((voteType) => {
          const isActive = post.userVote === voteType;
          const IconComponent = voteType === 'true' ? TrueIcon : voteType === 'misleading' ? MisleadingIcon : FalseIcon;
          const iconColor = isActive ? colors.primary : '#757575';
          const label = voteType === 'true' ? 'True' : voteType === 'misleading' ? 'Misleading' : 'False';

          return (
            <Pressable
              key={voteType}
              style={[
                styles.voteButton,
                isActive && styles.voteButtonActive,
              ]}
              onPress={() => gateAction(() => onVote(post.id, voteType))}
            >
              <IconComponent color={iconColor} />
              <Text
                style={[
                  styles.voteLabel,
                  isActive && styles.voteLabelActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <TrueIcon color="#757575" />
          <Text style={styles.statText}>{post.trueCount}</Text>
        </View>
        <View style={styles.stat}>
          <MisleadingIcon color="#757575" />
          <Text style={styles.statText}>{post.misleadingCount}</Text>
        </View>
        <View style={styles.stat}>
          <FalseIcon color="#757575" />
          <Text style={styles.statText}>{post.falseCount}</Text>
        </View>
        <View style={styles.stat}>
          <CommentsIcon color="#757575" />
          <Text style={styles.statText}>{post.commentsCount}</Text>
        </View>
        <Pressable style={styles.stat}>
          <ShareIcon color="#757575" />
          <Text style={styles.statText}>Share</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { selectedUniversity, isAuthenticated } = useAuthStore();
  const { gateAction, showGateModal, dismissGateModal } = useGuestGate();
  const [activeTab, setActiveTab] = useState<FeedTab>('mySchool');
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const filteredPosts = activeTab === 'mySchool' && selectedUniversity
    ? posts.filter((p) => p.university === selectedUniversity.name)
    : activeTab === 'otherCampus' && selectedUniversity
    ? posts.filter((p) => p.university !== selectedUniversity.name)
    : posts;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const newPosts = await postService.getPosts(activeTab, selectedUniversity?.name);
    setPosts(newPosts);
    setRefreshing(false);
  }, [activeTab, selectedUniversity]);

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
        <Pressable
          style={styles.feedTab}
          onPress={() => setActiveTab('mySchool')}
        >
          <Text
            style={[
              styles.feedTabText,
              activeTab === 'mySchool' && styles.feedTabTextActive,
            ]}
          >
            My School
          </Text>
          {activeTab === 'mySchool' && <View style={styles.feedTabIndicator} />}
        </Pressable>
        <Pressable
          style={styles.feedTab}
          onPress={() => setActiveTab('otherCampus')}
        >
          <Text
            style={[
              styles.feedTabText,
              activeTab === 'otherCampus' && styles.feedTabTextActive,
            ]}
          >
            Other campus
          </Text>
          {activeTab === 'otherCampus' && <View style={styles.feedTabIndicator} />}
        </Pressable>
      </View>

      {/* Posts Feed */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onVote={handleVote}
            onPress={() => router.push(`/post/${item.id}`)}
            isGuest={!isAuthenticated}
            gateAction={gateAction}
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
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
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
    bottom: 0,
    left: '20%',
    right: '20%',
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
