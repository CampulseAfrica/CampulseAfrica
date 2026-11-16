import React, { memo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../theme';
import type { Post, VoteType } from '../../types';
import { Avatar } from '../ui/Avatar';
import {
  VerifiedBadge,
  CommentsIcon,
  ShareIcon,
  BookmarkIcon,
  MoreHorizontalIcon,
} from '../ui/Icons';
import { CommunityCheck } from './CommunityCheck';
import { useAuthStore } from '../../store';

const formatTimeAgo = (dateString: string) => {
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
};

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: VoteType) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onFollow?: (userId: string) => void;
  onOptions?: (postId: string) => void;
  onPress: (postId: string) => void;
  isGuest?: boolean;
}

const renderContent = (content: string, hashtags: string[], textColor: string, hashtagColor: string) => {
  if (!hashtags || hashtags.length === 0) {
    return <Text style={[styles.postText, { color: textColor }]}>{content}</Text>;
  }

  const parts: React.ReactNode[] = [];
  let remaining = content;
  let keyIndex = 0;

  hashtags.forEach((tag) => {
    const hashTag = tag.startsWith('#') ? tag : `#${tag}`;
    const idx = remaining.indexOf(hashTag);
    if (idx !== -1) {
      if (idx > 0) {
        parts.push(
          <Text key={`t-${keyIndex++}`} style={[styles.postText, { color: textColor }]}>
            {remaining.substring(0, idx)}
          </Text>,
        );
      }
      parts.push(
        <Text key={`h-${keyIndex++}`} style={[styles.hashtag, { color: hashtagColor }]}>
          {hashTag}
        </Text>,
      );
      remaining = remaining.substring(idx + hashTag.length);
    }
  });

  if (remaining) {
    parts.push(
      <Text key={`r-${keyIndex}`} style={[styles.postText, { color: textColor }]}>
        {remaining}
      </Text>,
    );
  }

  return <Text style={[styles.postText, { color: textColor }]}>{parts}</Text>;
};

export const PostCard: React.FC<PostCardProps> = memo(({
  post,
  onVote,
  onComment,
  onShare,
  onBookmark,
  onFollow,
  onOptions,
  onPress,
  isGuest = false,
}) => {
  const { currentUser } = useAuthStore();
  const { colors, isDark } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked ?? false);

  const timeAgo = formatTimeAgo(post.createdAt);
  const isOwnPost = currentUser?.id === post.user.id;

  const handleFollowPress = () => {
    setIsFollowing((prev) => !prev);
    onFollow?.(post.user.id);
  };

  const handleBookmarkPress = () => {
    setBookmarked((prev) => !prev);
    onBookmark?.(post.id);
  };

  return (
    <Pressable
      onPress={() => onPress(post.id)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isDark ? colors.border : '#E5E7EB',
        },
        pressed && styles.cardPressed,
      ]}
    >
      {/* Header: Avatar + Info + (Follow) + Options */}
      <View style={styles.header}>
        <Avatar uri={post.user.avatar} size="md" />

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
              {post.user.fullName}
            </Text>
            {post.user.isVerified && <VerifiedBadge width={16} height={16} />}
          </View>
          <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
            {post.user.university?.name || post.university} · {timeAgo}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {!isOwnPost && !isFollowing && (
            <Pressable
              onPress={handleFollowPress}
              style={({ pressed }) => [
                styles.followButton,
                {
                  backgroundColor: isDark ? colors.surfaceElevated : '#EBF3FF',
                  borderColor: isDark ? colors.border : '#D0E3FF',
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.followText, { color: colors.primary }]}>+ Follow</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => onOptions?.(post.id)}
            hitSlop={8}
            style={styles.optionsButton}
          >
            <MoreHorizontalIcon width={20} height={20} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderContent(post.content, post.hashtags, colors.textPrimary, colors.primary)}
      </View>

      {/* Optional Post Image */}
      {post.images && post.images.length > 0 && (
        <Image
          source={{ uri: post.images[0] }}
          style={[styles.postImage, { backgroundColor: colors.skeleton }]}
          contentFit="cover"
          cachePolicy="disk"
        />
      )}

      {/* Community Check Voting Section */}
      <CommunityCheck
        trueCount={post.trueCount}
        misleadingCount={post.misleadingCount}
        falseCount={post.falseCount}
        userVote={post.userVote}
        onVote={(voteType) => onVote(post.id, voteType)}
        isOwnPost={isOwnPost}
      />

      {/* Action Footer Row */}
      <View style={[styles.footerRow, { borderTopColor: colors.divider }]}>
        {/* Comments Count */}
        <Pressable
          style={styles.footerAction}
          onPress={() => onComment?.(post.id)}
          hitSlop={8}
        >
          <CommentsIcon color={colors.textSecondary} width={18} height={18} />
          <Text style={[styles.footerActionText, { color: colors.textSecondary }]}>
            {post.commentsCount} comments
          </Text>
        </Pressable>

        {/* Share Action */}
        <Pressable
          style={styles.footerAction}
          onPress={() => onShare?.(post.id)}
          hitSlop={8}
        >
          <ShareIcon color={colors.textSecondary} width={16} height={16} />
          <Text style={[styles.footerActionText, { color: colors.textSecondary }]}>
            Share
          </Text>
        </Pressable>

        {/* Save / Bookmark Action */}
        <Pressable
          style={styles.footerAction}
          onPress={handleBookmarkPress}
          hitSlop={8}
        >
          <BookmarkIcon
            color={bookmarked ? colors.primary : colors.textSecondary}
            width={16}
            height={18}
            filled={bookmarked}
          />
        </Pressable>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.98,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
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
  meta: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  followButton: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  followText: {
    fontSize: 13,
    fontWeight: '700',
  },
  optionsButton: {
    padding: 4,
  },
  content: {
    marginBottom: 12,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  hashtag: {
    fontWeight: '700',
    fontSize: 15,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerActionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
});
