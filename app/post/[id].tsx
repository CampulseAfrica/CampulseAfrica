import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store';
import { useGuestGate } from '../../hooks';
import { postService } from '../../services';
import { Post, Comment, VoteType } from '../../types';
import { mockPosts } from '../../mocks';

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const { gateAction } = useGuestGate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const foundPost = mockPosts.find((p) => p.id === id) ?? null;
    setPost(foundPost);

    if (id) {
      postService.getComments(id).then(setComments);
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;
    const comment = await postService.addComment(id, newComment);
    setComments((prev) => [comment, ...prev]);
    setNewComment('');
  };

  const handleVote = (voteType: VoteType) => {
    if (!post) return;
    setPost({
      ...post,
      userVote: post.userVote === voteType ? null : voteType,
    });
  };

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={{ width: 60 }} />
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <View>
              {/* Post Content */}
              <View style={styles.postContainer}>
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
                      {post.user.university.name}
                    </Text>
                  </View>
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                {post.images.length > 0 && (
                  <Image source={{ uri: post.images[0] }} style={styles.postImage} />
                )}

                {/* Vote Buttons */}
                <View style={styles.voteContainer}>
                  {(['true', 'misleading', 'false'] as VoteType[]).map((voteType) => {
                    const isActive = post.userVote === voteType;
                    const icon = voteType === 'true' ? '✓' : voteType === 'misleading' ? 'ⓘ' : '✕';
                    const label = voteType === 'true' ? 'True' : voteType === 'misleading' ? 'Misleading' : 'False';

                    return (
                      <Pressable
                        key={voteType}
                        style={[styles.voteButton, isActive && styles.voteButtonActive]}
                        onPress={() => gateAction(() => handleVote(voteType))}
                      >
                        <Text style={[styles.voteIcon, isActive && styles.voteIconActive]}>
                          {icon}
                        </Text>
                        <Text style={[styles.voteLabel, isActive && styles.voteLabelActive]}>
                          {label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                  <Text style={styles.statText}>✓ {post.trueCount}</Text>
                  <Text style={styles.statText}>💬 {post.commentsCount}</Text>
                  <Text style={styles.statText}>✕ {post.falseCount}</Text>
                  <Text style={styles.statText}>↗ Share</Text>
                </View>
              </View>

              {/* Comments Header */}
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>
                  Comments ({comments.length})
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item: comment }) => (
            <View style={styles.commentItem}>
              <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.user.fullName}</Text>
                  <Text style={styles.commentTime}>2h ago</Text>
                </View>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder={isAuthenticated ? 'Write a comment...' : 'Sign in to comment'}
            placeholderTextColor={colors.textTertiary}
            value={newComment}
            onChangeText={setNewComment}
            editable={isAuthenticated}
            multiline
          />
          <Pressable
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
            onPress={() => gateAction(handleAddComment)}
            disabled={!newComment.trim()}
          >
            <Text style={styles.sendButtonText}>↗</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  postContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 16,
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
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  postImage: {
    width: '100%',
    height: 220,
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
    justifyContent: 'space-around',
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  commentsHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  commentItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  commentTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: spacing.sm,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius['3xl'],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    fontSize: 18,
    color: colors.textInverse,
    fontWeight: '600',
  },
});
