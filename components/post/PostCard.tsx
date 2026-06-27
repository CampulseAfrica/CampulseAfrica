import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import type { Post, VoteType } from '../../types';
import { Avatar } from '../ui/Avatar';
import { VoteButtons } from './VoteButtons';
import { VerifiedBadge, TrueIcon, MisleadingIcon, FalseIcon, CommentsIcon, ShareIcon } from '../ui/Icons';
import { useAuthStore } from '../../store';

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `Just now`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: VoteType) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onFollow?: (userId: string) => void;
  onPress: (postId: string) => void;
  isGuest?: boolean;
}

const renderContent = (content: string, hashtags: string[]) => {
  if (hashtags.length === 0) {
    return <Text style={styles.postText}>{content}</Text>;
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
          <Text key={`t-${keyIndex++}`} style={styles.postText}>
            {remaining.substring(0, idx)}
          </Text>,
        );
      }
      parts.push(
        <Text key={`h-${keyIndex++}`} style={styles.hashtag}>
          {hashTag}
        </Text>,
      );
      remaining = remaining.substring(idx + hashTag.length);
    }
  });

  if (remaining) {
    parts.push(
      <Text key={`r-${keyIndex}`} style={styles.postText}>
        {remaining}
      </Text>,
    );
  }

  return <Text style={styles.postText}>{parts}</Text>;
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onVote,
  onComment,
  onShare,
  onFollow,
  onPress,
  isGuest = false,
}) => {
  const { currentUser } = useAuthStore();
  const timeAgo = formatTimeAgo(post.createdAt);
  const isOwnPost = currentUser?.id === post.user.id;

  return (
    <Pressable
      onPress={() => onPress(post.id)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Header: Avatar + Name + Follow */}
      <View style={styles.header}>
        <Avatar
          uri={post.user.avatar}
          size="md"
        />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {post.user.fullName}
            </Text>
            {post.user.isVerified && <VerifiedBadge />}
          </View>
          <Text style={styles.meta} numberOfLines={1}>
            {post.user.university.name}. {timeAgo}
          </Text>
        </View>
        {!isOwnPost && (
          <Pressable
            onPress={() => onFollow?.(post.user.id)}
            style={({ pressed }) => [
              styles.followButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.followText}>Follow</Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderContent(post.content, post.hashtags)}
      </View>

      {/* Optional Image */}
      {post.images.length > 0 && (
        <Image
          source={{ uri: post.images[0] }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* Vote Buttons */}
      {!isOwnPost && (
        <View style={styles.voteSection}>
          <VoteButtons
            userVote={post.userVote}
            onVote={(voteType) => onVote(post.id, voteType)}
          />
        </View>
      )}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <TrueIcon color="#757575" width={16} height={16} />
          <Text style={styles.statText}>{post.trueCount}</Text>
        </View>
        <View style={styles.stat}>
          <MisleadingIcon color="#757575" width={16} height={16} />
          <Text style={styles.statText}>{post.misleadingCount}</Text>
        </View>
        <View style={styles.stat}>
          <FalseIcon color="#757575" width={16} height={16} />
          <Text style={styles.statText}>{post.falseCount}</Text>
        </View>
        <Pressable style={styles.stat} onPress={() => onComment?.(post.id)}>
          <CommentsIcon color="#757575" width={16} height={16} />
          <Text style={styles.statText}>{post.commentsCount}</Text>
        </Pressable>
        <Pressable style={styles.stat} onPress={() => onShare?.(post.id)}>
          <ShareIcon color="#757575" width={16} height={16} />
          <Text style={styles.statText}>Share</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardPressed: {
    opacity: 0.97,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  userName: {
    fontSize: typography.bodySemibold.fontSize,
    fontWeight: typography.bodySemibold.fontWeight,
    color: colors.textPrimary,
  },
  meta: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  followButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  followText: {
    fontSize: typography.captionSemibold.fontSize,
    fontWeight: typography.captionSemibold.fontWeight,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  content: {
    marginBottom: spacing.md,
  },
  postText: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textPrimary,
    lineHeight: typography.body.lineHeight,
  },
  hashtag: {
    color: colors.primary,
    fontWeight: typography.bodySemibold.fontWeight,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    backgroundColor: colors.skeleton,
  },
  voteSection: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
  },
});
