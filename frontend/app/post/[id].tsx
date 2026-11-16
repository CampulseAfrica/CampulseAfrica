import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Share,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ChevronLeft, MoreHorizontal } from 'lucide-react-native';
import { spacing, useTheme } from '../../theme';
import { useAuthStore } from '../../store';
import { useGuestGate } from '../../hooks';
import { postService } from '../../services';
import { Post, Comment, VoteType } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { CommunityCheck } from '../../components/post/CommunityCheck';
import {
  VerifiedBadge,
  CommentsIcon,
  ShareIcon,
  BookmarkIcon,
} from '../../components/ui/Icons';
import { CommentThreadCard } from '../../components/comment/CommentThreadCard';
import { CommentInputBar } from '../../components/comment/CommentInputBar';

const formatTimeAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(seconds / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;
    const years = Math.floor(months / 12);
    return `${years}y`;
  } catch {
    return '1y';
  }
};

const renderContent = (content: string, hashtags: string[], textColor: string, hashtagColor: string) => {
  if (!hashtags || hashtags.length === 0) {
    return <Text style={[styles.postContent, { color: textColor }]}>{content}</Text>;
  }

  const parts: React.ReactNode[] = [];
  let remaining = content;
  let keyIndex = 0;

  const escapedTags = hashtags.map((t) => t.replace('#', '')).sort((a, b) => b.length - a.length);

  for (const tag of escapedTags) {
    const tagPattern = `#${tag}`;
    const idx = remaining.indexOf(tagPattern);
    if (idx !== -1) {
      if (idx > 0) {
        parts.push(
          <Text key={keyIndex++} style={[styles.postContent, { color: textColor }]}>
            {remaining.substring(0, idx)}
          </Text>
        );
      }
      parts.push(
        <Text
          key={keyIndex++}
          style={[styles.postContent, styles.hashtag, { color: hashtagColor }]}
        >
          {tagPattern}
        </Text>
      );
      remaining = remaining.substring(idx + tagPattern.length);
    }
  }

  if (remaining.length > 0) {
    parts.push(
      <Text key={keyIndex++} style={[styles.postContent, { color: textColor }]}>
        {remaining}
      </Text>
    );
  }

  return <Text style={styles.contentWrapper}>{parts}</Text>;
};

function insertReplyInTree(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  return comments.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        replies: [...(item.replies || []), reply],
        totalRepliesCount: (item.totalRepliesCount || 0) + 1,
      };
    }
    if (item.replies && item.replies.length > 0) {
      return {
        ...item,
        replies: insertReplyInTree(item.replies, parentId, reply),
      };
    }
    return item;
  });
}

function updateCommentVoteInTree(
  comments: Comment[],
  targetId: string,
  result: { upvotesCount: number; downvotesCount: number; userVote: 'up' | 'down' | null }
): Comment[] {
  return comments.map((item) => {
    if (item.id === targetId) {
      return {
        ...item,
        upvotesCount: result.upvotesCount,
        downvotesCount: result.downvotesCount,
        userVote: result.userVote,
      };
    }
    if (item.replies && item.replies.length > 0) {
      return {
        ...item,
        replies: updateCommentVoteInTree(item.replies, targetId, result),
      };
    }
    return item;
  });
}

function countTotalComments(list: Comment[]): number {
  let count = 0;
  for (const c of list) {
    count += 1;
    if (c.replies && c.replies.length > 0) {
      count += countTotalComments(c.replies);
    }
  }
  return count;
}

export default function PostDetailScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser } = useAuthStore();
  const { gateAction } = useGuestGate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      Promise.all([
        postService.getPostById(id),
        postService.getComments(id),
      ]).then(([fetchedPost, fetchedComments]) => {
        if (isMounted) {
          setPost(fetchedPost);
          if (fetchedPost) {
            setIsBookmarked(fetchedPost.isBookmarked ?? false);
          }
          setComments(fetchedComments);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleVotePost = async (voteType: VoteType) => {
    if (!post) return;
    if (currentUser && post.user.id === currentUser.id) return;
    const updated = await postService.votePost(post.id, voteType);
    setPost(updated);
  };

  const handleBookmark = async () => {
    if (!post) return;
    setIsBookmarked((prev) => !prev);
    await postService.bookmarkPost(post.id);
  };

  const handleShare = async () => {
    if (!post) return;
    try {
      await Share.share({
        message: `${post.user.fullName} on Campulse: "${post.content}"`,
      });
      await postService.sharePost(post.id);
    } catch {
      // Ignored
    }
  };

  const handleReplyPress = (comment: Comment) => {
    gateAction(() => {
      setReplyingTo(comment);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    });
  };

  const handleVoteComment = async (commentId: string, voteType: 'up' | 'down') => {
    gateAction(async () => {
      if (!post) return;
      const result = await postService.voteComment(post.id, commentId, voteType);
      setComments((prev) => updateCommentVoteInTree(prev, commentId, result));
    });
  };

  const handleSubmitComment = async () => {
    if (!newCommentText.trim() || !post) return;
    const content = newCommentText.trim();
    // Parent ID is the exact comment being replied to
    const parentId = replyingTo ? replyingTo.id : undefined;

    setNewCommentText('');
    setReplyingTo(null);

    const createdComment = await postService.addComment(post.id, content, parentId, currentUser);

    if (parentId) {
      setComments((prev) => insertReplyInTree(prev, parentId, createdComment));
    } else {
      setComments((prev) => [createdComment, ...prev]);
    }
  };

  // Recursively calculate total comments count (root comments + all nested replies)
  const totalCommentsCount = countTotalComments(comments);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={styles.circleButton}>
            <ChevronLeft color={colors.textPrimary} size={20} />
          </Pressable>
          <Text style={[styles.topBarTitle, { color: colors.textPrimary }]}>Post</Text>
          <View style={styles.circleButton}>
            <MoreHorizontal color={colors.textPrimary} size={20} />
          </View>
        </View>
        <View style={{ padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Skeleton width={44} height={44} borderRadius={22} style={{ marginRight: spacing.md }} />
            <View style={{ flex: 1, gap: 6 }}>
              <Skeleton width="45%" height={16} />
              <Skeleton width="30%" height={13} />
            </View>
          </View>
          <Skeleton width="100%" height={16} style={{ marginBottom: 6 }} />
          <Skeleton width="85%" height={16} style={{ marginBottom: spacing.lg }} />
          <Skeleton width="100%" height={200} borderRadius={16} />
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Post not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOwnPost = currentUser?.id === post.user.id;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Top Bar Navigation */}
        <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.circleButton,
              { backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6' },
              pressed && styles.pressed,
            ]}
          >
            <ChevronLeft color={colors.textPrimary} size={20} />
          </Pressable>

          <Text style={[styles.topBarTitle, { color: colors.textPrimary }]}>Post</Text>

          <Pressable
            style={({ pressed }) => [
              styles.circleButton,
              { backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6' },
              pressed && styles.pressed,
            ]}
          >
            <MoreHorizontal color={colors.textPrimary} size={20} />
          </Pressable>
        </View>

        {/* Scrollable Feed Area */}
        <FlashList
          data={comments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <View>
              {/* Hero Post Card */}
              <View
                style={[
                  styles.heroPostCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isDark ? colors.border : '#E5E7EB',
                  },
                ]}
              >
                {/* Author Info */}
                <View style={styles.postHeader}>
                  <Image
                    source={{ uri: post.user.avatar }}
                    style={[styles.authorAvatar, { backgroundColor: colors.surfaceElevated }]}
                  />
                  <View style={styles.postUserInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
                        {post.user.fullName}
                      </Text>
                      {post.user.isVerified && <VerifiedBadge width={16} height={16} />}
                    </View>
                    <Text style={[styles.universityMeta, { color: colors.textSecondary }]} numberOfLines={1}>
                      {post.user.university?.name || post.university} · {formatTimeAgo(post.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Content Text */}
                <View style={styles.contentSection}>
                  {renderContent(post.content, post.hashtags, colors.textPrimary, colors.primary)}
                </View>

                {/* Optional Media Image */}
                {post.images && post.images.length > 0 && (
                  <Image
                    source={{ uri: post.images[0] }}
                    style={[styles.postMediaImage, { backgroundColor: colors.skeleton }]}
                    contentFit="cover"
                  />
                )}

                {/* Community Check */}
                <CommunityCheck
                  trueCount={post.trueCount}
                  misleadingCount={post.misleadingCount}
                  falseCount={post.falseCount}
                  userVote={post.userVote}
                  onVote={(voteType) => gateAction(() => handleVotePost(voteType))}
                  isOwnPost={isOwnPost}
                />

                {/* Card Action Footer */}
                <View style={[styles.cardFooter, { borderTopColor: colors.divider }]}>
                  <View style={styles.footerActionLeft}>
                    <CommentsIcon color={colors.textSecondary} width={18} height={18} />
                    <Text style={[styles.footerActionText, { color: colors.textSecondary }]}>
                      Comments
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleShare}
                    style={({ pressed }) => [styles.footerActionButton, pressed && styles.pressed]}
                    hitSlop={8}
                  >
                    <ShareIcon color={colors.textSecondary} width={15} height={15} />
                    <Text style={[styles.footerActionText, { color: colors.textSecondary }]}>
                      Share
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleBookmark}
                    style={({ pressed }) => [styles.footerActionButton, pressed && styles.pressed]}
                    hitSlop={8}
                  >
                    <BookmarkIcon
                      color={isBookmarked ? colors.primary : colors.textSecondary}
                      filled={isBookmarked}
                      width={16}
                      height={18}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Comments Section Header */}
              <View style={styles.commentsSectionHeader}>
                <Text style={[styles.commentsSectionTitle, { color: colors.textPrimary }]}>
                  Comments
                </Text>
                <View style={[styles.commentsCountBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.commentsCountText, { color: colors.primary }]}>
                    {totalCommentsCount}
                  </Text>
                </View>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.commentItemWrapper}>
              <CommentThreadCard
                comment={item}
                postAuthorId={post.user.id}
                onVote={handleVoteComment}
                onReply={handleReplyPress}
              />
            </View>
          )}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Sticky Comment / Reply Input Bar */}
        <CommentInputBar
          userAvatar={currentUser?.avatar}
          value={newCommentText}
          onChangeText={setNewCommentText}
          onSubmit={() => gateAction(handleSubmitComment)}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          inputRef={inputRef}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heroPostCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  universityMeta: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  contentSection: {
    marginBottom: 12,
  },
  contentWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  hashtag: {
    fontWeight: '600',
  },
  postMediaImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  footerActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerActionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  commentsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  commentsCountBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  commentsCountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  commentItemWrapper: {
    marginHorizontal: 16,
  },
  listContentContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.8,
  },
});
