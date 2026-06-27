import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store';
import { mockPosts } from '../../mocks';
import { mockUsers } from '../../services/mockDb';
import { Post, VoteType } from '../../types';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, isAuthenticated, isGuest } = useAuthStore();

  // Use current user or first mock user as fallback
  const user = currentUser ?? Object.values(mockUsers)[0];
  const userPosts = mockPosts.filter((p) => p.user.id === user.id);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestIcon}>👤</Text>
          <Text style={styles.guestTitle}>Sign in to view your profile</Text>
          <Text style={styles.guestSubtitle}>
            Create an account to build your campus reputation
          </Text>
          <Pressable
            style={styles.signUpButton}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>Already have an account? Log In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: user.coverPhoto || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800' }}
            style={styles.coverPhoto}
          />
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
          {user.isVerified && (
            <View style={styles.verifiedBadgeLarge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.fullName}>{user.fullName}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.faculty}>{user.faculty} · {user.university.name}</Text>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.followersCount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.reputation}</Text>
            <Text style={styles.statLabel}>Rep</Text>
          </View>
        </View>

        {/* Edit Profile */}
        <View style={styles.editContainer}>
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* User's Posts */}
        <View style={styles.postsSection}>
          <Text style={styles.postsSectionTitle}>Posts</Text>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Pressable
                key={post.id}
                style={styles.miniPostCard}
                onPress={() => router.push(`/post/${post.id}`)}
              >
                <Text style={styles.miniPostContent} numberOfLines={3}>
                  {post.content}
                </Text>
                <View style={styles.miniPostStats}>
                  <Text style={styles.miniPostStat}>✓ {post.trueCount}</Text>
                  <Text style={styles.miniPostStat}>💬 {post.commentsCount}</Text>
                  <Text style={styles.miniPostStat}>↗ {post.sharesCount}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyPosts}>
              <Text style={styles.emptyPostsText}>No posts yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Guest state
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  guestIcon: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  guestSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing['3xl'],
  },
  signUpButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing['5xl'],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius['3xl'],
    marginBottom: spacing.lg,
  },
  signUpButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  // Cover
  coverContainer: {
    height: 160,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Avatar
  avatarContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: spacing.md,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.surface,
  },
  verifiedBadgeLarge: {
    position: 'absolute',
    bottom: 2,
    right: '35%',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  // User Info
  userInfo: {
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  fullName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  username: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  faculty: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  bio: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  // Edit Profile
  editContainer: {
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  editButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  // Posts
  postsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  postsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  miniPostCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  miniPostContent: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  miniPostStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  miniPostStat: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyPosts: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyPostsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
