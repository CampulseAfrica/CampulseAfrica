import React, { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme';
import { Comment } from '../../types';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ReplyCurveIcon,
  CornerDownRightIcon,
} from '../ui/Icons';

interface CommentThreadCardProps {
  comment: Comment;
  postAuthorId: string;
  onVote: (commentId: string, voteType: 'up' | 'down') => void;
  onReply: (comment: Comment) => void;
}

function formatRelativeTime(isoDate: string): string {
  try {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    return `${Math.floor(days / 30)}mo`;
  } catch {
    return '1h';
  }
}

interface ReplyItemProps {
  reply: Comment;
  postAuthorId: string;
  onVote: (commentId: string, voteType: 'up' | 'down') => void;
  onReply: (comment: Comment) => void;
  onAnchorLayout?: (id: string, y: number) => void;
}

const ReplyItem: React.FC<ReplyItemProps> = memo(({
  reply,
  postAuthorId,
  onVote,
  onReply,
  onAnchorLayout,
}) => {
  const { colors, isDark } = useTheme();
  const isAuthor = reply.user.id === postAuthorId;
  const lineColor = isDark ? colors.border : '#E5E7EB';

  const nestedReplies = reply.replies || [];
  const [nestedContainerY, setNestedContainerY] = useState<number | null>(null);
  const [nestedAnchors, setNestedAnchors] = useState<Record<string, number>>({});

  const handleNestedAnchorLayout = useCallback((id: string, y: number) => {
    setNestedAnchors((prev) => {
      if (prev[id] === y) return prev;
      return { ...prev, [id]: y };
    });
  }, []);

  const nestedPathD = useMemo(() => {
    if (nestedReplies.length === 0 || nestedContainerY === null) return null;
    const yList: number[] = [];
    for (const nested of nestedReplies) {
      if (typeof nestedAnchors[nested.id] === 'number') {
        yList.push(nestedContainerY + nestedAnchors[nested.id]);
      }
    }
    if (yList.length === 0) return null;

    const ROOT_X = 18;   // Center of replyAvatar (36 / 2 = 18)
    const START_Y = 36;  // Bottom of replyAvatar
    const TARGET_X = 46; // Left edge of nested avatars (36 + 10 = 46)
    const RADIUS = 12;   // Curve radius

    const lastY = yList[yList.length - 1];
    const intermediates = yList.slice(0, -1);

    // Spine runs from directly under replyAvatar down to the last curve, turning into the last avatar
    const spine = `M ${ROOT_X} ${START_Y} L ${ROOT_X} ${Math.max(START_Y, lastY - RADIUS)} Q ${ROOT_X} ${lastY} ${ROOT_X + RADIUS} ${lastY} L ${TARGET_X} ${lastY}`;
    const branches = intermediates
      .map((y) => `M ${ROOT_X} ${Math.max(START_Y, y - RADIUS)} Q ${ROOT_X} ${y} ${ROOT_X + RADIUS} ${y} L ${TARGET_X} ${y}`)
      .join(' ');

    return `${spine} ${branches}`.trim();
  }, [nestedReplies, nestedContainerY, nestedAnchors]);

  return (
    <View
      style={styles.replyRow}
      onLayout={(e) => {
        onAnchorLayout?.(reply.id, e.nativeEvent.layout.y + 18);
      }}
    >
      {/* Nested sub-thread SVG line originating directly from beneath this reply's avatar */}
      {nestedPathD && (
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Path
            d={nestedPathD}
            stroke={lineColor}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      )}

      {/* Reply Avatar */}
      <Image
        source={{ uri: reply.user.avatar }}
        style={[styles.replyAvatar, { backgroundColor: colors.surfaceElevated }]}
      />

      {/* Reply Content Area */}
      <View style={styles.replyContent}>
        {/* Reply Header: Name, [Author], Time */}
        <View style={styles.replyHeader}>
          <View style={styles.authorRow}>
            <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
              {reply.user.fullName}
            </Text>
            {isAuthor && (
              <View style={[styles.authorBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.authorBadgeText, { color: colors.primary }]}>Author</Text>
              </View>
            )}
          </View>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatRelativeTime(reply.createdAt)}
          </Text>
        </View>

        {/* Comment Text & Actions */}
        <View>
          <Text style={[styles.commentText, { color: colors.textPrimary }]}>
            {reply.content}
          </Text>

          {/* Action Pills: Upvote, Downvote, Reply */}
          <View style={styles.actionsRow}>
            {/* Upvote Pill */}
            <Pressable
              onPress={() => onVote(reply.id, 'up')}
              style={({ pressed }) => [
                styles.votePill,
                reply.userVote === 'up'
                  ? { backgroundColor: colors.primaryLight }
                  : { backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6' },
                pressed && styles.pressed,
              ]}
            >
              <ArrowUpIcon
                width={13}
                height={13}
                color={reply.userVote === 'up' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.voteCount,
                  { color: reply.userVote === 'up' ? colors.primary : colors.textSecondary },
                ]}
              >
                {reply.upvotesCount}
              </Text>
            </Pressable>

            {/* Downvote Pill */}
            <Pressable
              onPress={() => onVote(reply.id, 'down')}
              style={({ pressed }) => [
                styles.votePill,
                reply.userVote === 'down'
                  ? { backgroundColor: colors.voteFalseBg }
                  : { backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6' },
                pressed && styles.pressed,
              ]}
            >
              <ArrowDownIcon
                width={13}
                height={13}
                color={reply.userVote === 'down' ? colors.voteFalse : colors.textSecondary}
              />
              <Text
                style={[
                  styles.voteCount,
                  { color: reply.userVote === 'down' ? colors.voteFalse : colors.textSecondary },
                ]}
              >
                {reply.downvotesCount}
              </Text>
            </Pressable>

            {/* Reply Button */}
            <Pressable
              onPress={() => onReply(reply)}
              style={({ pressed }) => [styles.replyButton, pressed && styles.pressed]}
            >
              <ReplyCurveIcon width={14} height={14} color={colors.textSecondary} />
              <Text style={[styles.replyButtonText, { color: colors.textSecondary }]}>Reply</Text>
            </Pressable>
          </View>
        </View>

        {/* Nested Replies to this reply (Depth 2) */}
        {nestedReplies.length > 0 && (
          <View
            style={styles.nestedContainer}
            onLayout={(e) => {
              setNestedContainerY(e.nativeEvent.layout.y);
            }}
          >
            {nestedReplies.map((nested) => {
              const isNestedAuthor = nested.user.id === postAuthorId;

              return (
                <View
                  key={nested.id}
                  style={styles.nestedReplyRow}
                  onLayout={(e) => {
                    handleNestedAnchorLayout(nested.id, e.nativeEvent.layout.y + 15);
                  }}
                >
                  <Image
                    source={{ uri: nested.user.avatar }}
                    style={[styles.nestedAvatar, { backgroundColor: colors.surfaceElevated }]}
                  />
                  <View style={styles.replyContent}>
                    <View style={styles.replyHeader}>
                      <View style={styles.authorRow}>
                        <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
                          {nested.user.fullName}
                        </Text>
                        {isNestedAuthor && (
                          <View style={[styles.authorBadge, { backgroundColor: colors.primaryLight }]}>
                            <Text style={[styles.authorBadgeText, { color: colors.primary }]}>Author</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                        {formatRelativeTime(nested.createdAt)}
                      </Text>
                    </View>

                    <Text style={[styles.commentText, { color: colors.textPrimary }]}>
                      {nested.content}
                    </Text>

                    <View style={styles.actionsRow}>
                      <Pressable
                        onPress={() => onVote(nested.id, 'up')}
                        style={({ pressed }) => [
                          styles.votePill,
                          nested.userVote === 'up'
                            ? { backgroundColor: colors.primaryLight }
                            : { backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6' },
                          pressed && styles.pressed,
                        ]}
                      >
                        <ArrowUpIcon
                          width={13}
                          height={13}
                          color={nested.userVote === 'up' ? colors.primary : colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.voteCount,
                            { color: nested.userVote === 'up' ? colors.primary : colors.textSecondary },
                          ]}
                        >
                          {nested.upvotesCount}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => onVote(nested.id, 'down')}
                        style={({ pressed }) => [
                          styles.votePill,
                          nested.userVote === 'down'
                            ? { backgroundColor: colors.voteFalseBg }
                            : { backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6' },
                          pressed && styles.pressed,
                        ]}
                      >
                        <ArrowDownIcon
                          width={13}
                          height={13}
                          color={nested.userVote === 'down' ? colors.voteFalse : colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.voteCount,
                            { color: nested.userVote === 'down' ? colors.voteFalse : colors.textSecondary },
                          ]}
                        >
                          {nested.downvotesCount}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => onReply(nested)}
                        style={({ pressed }) => [styles.replyButton, pressed && styles.pressed]}
                      >
                        <ReplyCurveIcon width={14} height={14} color={colors.textSecondary} />
                        <Text style={[styles.replyButtonText, { color: colors.textSecondary }]}>Reply</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
});

export const CommentThreadCard: React.FC<CommentThreadCardProps> = memo(({
  comment,
  postAuthorId,
  onVote,
  onReply,
}) => {
  const { colors, isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [repliesContainerY, setRepliesContainerY] = useState<number | null>(null);
  const [anchorMap, setAnchorMap] = useState<Record<string, number>>({});

  const isAuthor = comment.user.id === postAuthorId;
  const lineColor = isDark ? colors.border : '#E5E7EB';

  const allReplies = comment.replies || [];
  const initialDisplayCount = 2;
  const visibleReplies = expanded || allReplies.length <= initialDisplayCount
    ? allReplies
    : allReplies.slice(0, initialDisplayCount);

  const hiddenCount = (comment.totalRepliesCount || allReplies.length) - visibleReplies.length;
  const hasMore = hiddenCount > 0 && !expanded;

  const handleReplyAnchorLayout = useCallback((id: string, relativeY: number) => {
    setAnchorMap((prev) => {
      if (prev[id] === relativeY) return prev;
      return { ...prev, [id]: relativeY };
    });
  }, []);

  const handleRepliesContainerLayout = useCallback((e: any) => {
    setRepliesContainerY(e.nativeEvent.layout.y);
  }, []);

  const activeAnchors: number[] = useMemo(() => {
    if (repliesContainerY === null || visibleReplies.length === 0) return [];

    const result: number[] = [];

    for (const reply of visibleReplies) {
      if (typeof anchorMap[reply.id] === 'number') {
        result.push(repliesContainerY + anchorMap[reply.id]);
      }
    }

    if (hasMore && typeof anchorMap['view-more'] === 'number') {
      result.push(repliesContainerY + anchorMap['view-more']);
    }

    return result;
  }, [repliesContainerY, visibleReplies, hasMore, anchorMap]);

  const treePathD = useMemo(() => {
    if (activeAnchors.length === 0) return null;

    const ROOT_X = 20;   // Centered under root avatar (40 / 2 = 20)
    const TARGET_X = 40; // Directly meets the left edge of reply avatars
    const START_Y = 40;  // Directly beneath bottom of root avatar
    const RADIUS = 12;   // Curvature radius for smooth Bézier turn

    const lastY = activeAnchors[activeAnchors.length - 1];
    const intermediateAnchors = activeAnchors.slice(0, -1);

    // Spine runs from root avatar down to the last curve, where it turns into the last avatar
    const spineD = `M ${ROOT_X} ${START_Y} L ${ROOT_X} ${Math.max(START_Y, lastY - RADIUS)} Q ${ROOT_X} ${lastY} ${ROOT_X + RADIUS} ${lastY} L ${TARGET_X} ${lastY}`;

    // Intermediate branches turn off from the spine into their respective avatars
    const branchesD = intermediateAnchors
      .map((y) => {
        return `M ${ROOT_X} ${Math.max(START_Y, y - RADIUS)} Q ${ROOT_X} ${y} ${ROOT_X + RADIUS} ${y} L ${TARGET_X} ${y}`;
      })
      .join(' ');

    return `${spineD} ${branchesD}`.trim();
  }, [activeAnchors]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isDark ? colors.border : '#F3F4F6',
        },
      ]}
    >
      <View style={styles.cardInner}>
        {/* SVG Vector Connector Overlay */}
        {treePathD && (
          <Svg
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Path
              d={treePathD}
              stroke={lineColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        )}

        {/* Root Comment Header */}
        <View style={styles.rootHeader}>
          <Image
            source={{ uri: comment.user.avatar }}
            style={[styles.rootAvatar, { backgroundColor: colors.surfaceElevated }]}
          />
          <View style={styles.headerInfo}>
            <View style={styles.authorRow}>
              <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
                {comment.user.fullName}
              </Text>
              {isAuthor && (
                <View style={[styles.authorBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.authorBadgeText, { color: colors.primary }]}>Author</Text>
                </View>
              )}
            </View>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {formatRelativeTime(comment.createdAt)}
            </Text>
          </View>
        </View>

        {/* Root Comment Body: Content & Action Buttons */}
        <View style={styles.rootContentArea}>
          <Text style={[styles.commentText, { color: colors.textPrimary }]}>
            {comment.content}
          </Text>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={() => onVote(comment.id, 'up')}
              style={({ pressed }) => [
                styles.votePill,
                comment.userVote === 'up'
                  ? { backgroundColor: colors.primaryLight }
                  : { backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6' },
                pressed && styles.pressed,
              ]}
            >
              <ArrowUpIcon
                width={13}
                height={13}
                color={comment.userVote === 'up' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.voteCount,
                  { color: comment.userVote === 'up' ? colors.primary : colors.textSecondary },
                ]}
              >
                {comment.upvotesCount}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onVote(comment.id, 'down')}
              style={({ pressed }) => [
                styles.votePill,
                comment.userVote === 'down'
                  ? { backgroundColor: colors.voteFalseBg }
                  : { backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6' },
                pressed && styles.pressed,
              ]}
            >
              <ArrowDownIcon
                width={13}
                height={13}
                color={comment.userVote === 'down' ? colors.voteFalse : colors.textSecondary}
              />
              <Text
                style={[
                  styles.voteCount,
                  { color: comment.userVote === 'down' ? colors.voteFalse : colors.textSecondary },
                ]}
              >
                {comment.downvotesCount}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onReply(comment)}
              style={({ pressed }) => [styles.replyButton, pressed && styles.pressed]}
            >
              <ReplyCurveIcon width={14} height={14} color={colors.textSecondary} />
              <Text style={[styles.replyButtonText, { color: colors.textSecondary }]}>Reply</Text>
            </Pressable>
          </View>
        </View>

        {/* Replies Container */}
        {visibleReplies.length > 0 && (
          <View
            style={styles.repliesContainer}
            onLayout={handleRepliesContainerLayout}
          >
            {visibleReplies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                postAuthorId={postAuthorId}
                onVote={onVote}
                onReply={onReply}
                onAnchorLayout={handleReplyAnchorLayout}
              />
            ))}

            {/* View X more replies row */}
            {hasMore && (
              <View
                style={styles.viewMoreRow}
                onLayout={(e) => {
                  handleReplyAnchorLayout('view-more', e.nativeEvent.layout.y + 14);
                }}
              >
                <Pressable
                  onPress={() => setExpanded(true)}
                  style={({ pressed }) => [styles.viewMoreButton, pressed && styles.pressed]}
                >
                  <CornerDownRightIcon width={14} height={14} color={colors.primary} />
                  <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                    View {hiddenCount} more {hiddenCount === 1 ? 'reply' : 'replies'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardInner: {
    position: 'relative',
  },
  rootHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rootAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  authorBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  authorBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '400',
    marginLeft: 8,
  },
  rootContentArea: {
    marginLeft: 50,
    marginBottom: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  votePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  replyButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  /* Replies */
  repliesContainer: {
    position: 'relative',
    marginLeft: 20, // Aligns line with center of root avatar (20px)
    paddingLeft: 20,
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
  },
  replyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  replyContent: {
    flex: 1,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  /* Nested Replies */
  nestedContainer: {
    position: 'relative',
    marginTop: 12,
  },
  nestedReplyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    position: 'relative',
  },
  nestedAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  /* View More Button */
  viewMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});


