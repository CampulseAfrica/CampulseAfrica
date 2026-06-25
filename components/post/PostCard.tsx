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
import { PostStats } from './PostStats';

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: VoteType) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onFollow: (userId: string) => void;
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
  const timeAgo = post.createdAt;

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
          isVerified={post.user.isVerified}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {post.user.fullName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {post.user.university.shortName} · {timeAgo}
          </Text>
        </View>
        <Pressable
          onPress={() => onFollow(post.user.id)}
          style={({ pressed }) => [
            styles.followButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.followText}>Follow</Text>
        </Pressable>
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
      <View style={styles.voteSection}>
        <VoteButtons
          userVote={post.userVote}
          onVote={(voteType) => onVote(post.id, voteType)}
        />
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <PostStats
          trueCount={post.trueCount}
          misleadingCount={post.misleadingCount}
          falseCount={post.falseCount}
          commentsCount={post.commentsCount}
          sharesCount={post.sharesCount}
        />

        <View style={styles.actions}>
          <Pressable onPress={() => onComment(post.id)} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
          </Pressable>
          <Pressable onPress={() => onShare(post.id)} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>↗</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionBtn: {
    padding: spacing.xs,
  },
  actionIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});
