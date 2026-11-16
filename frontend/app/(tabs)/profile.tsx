import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors as defaultColors, spacing, borderRadius, typography, useTheme } from '../../theme';
import { useAuthStore } from '../../store';
import { profileService } from '../../services';
import { Post, VoteType } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { CampulseLogo } from '../../components/ui/Logo';
import { SearchIcon, ReputationIcon, CalendarIcon, SettingsGearIcon, EditIcon, UniversityIcon, VerifiedBadge } from '../../components/ui/Icons';
import { PostCard } from '../../components/post/PostCard';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { currentUser, isAuthenticated } = useAuthStore();
  const user = currentUser;
  
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      profileService.getUserPosts(user.id).then((posts) => {
        if (isMounted) {
          setUserPosts(posts);
          setLoading(false);
        }
      });
    }
    return () => { isMounted = false; };
  }, [user?.id]);

  const handleVote = (postId: string, voteType: VoteType) => {
    setUserPosts((prev) =>
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

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestIcon}>👤</Text>
          <Text style={[styles.guestTitle, { color: colors.textPrimary }]}>Sign in to view your profile</Text>
          <Text style={[styles.guestSubtitle, { color: colors.textSecondary }]}>
            Create an account to build your campus reputation
          </Text>
          <Pressable
            style={[styles.signUpButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={[styles.signUpButtonText, { color: '#FFFFFF' }]}>Sign Up</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>Already have an account? Log In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, padding: spacing.lg }}>
          <Skeleton width={100} height={100} borderRadius={50} style={{ alignSelf: 'center', marginTop: 100 }} />
          <Skeleton width={150} height={20} style={{ alignSelf: 'center', marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <CampulseLogo width={131} height={26} color={colors.primary} />
        <Pressable onPress={() => router.push('/search')}>
          <SearchIcon bgColor={isDark ? colors.surfaceElevated : '#EBEBEB'} iconColor={colors.primary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: user.coverPhoto || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800' }}
            style={styles.coverPhoto}
          />
        </View>

        {/* Profile Controls & Avatar Overlap */}
        <View style={styles.controlsRow}>
          <View style={[styles.avatarWrapper, { backgroundColor: colors.background }]}>
            <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
          </View>
          <View style={styles.actionButtons}>
            <Pressable style={[styles.editButton, { backgroundColor: colors.surfaceElevated }]}>
              <EditIcon color={colors.textPrimary} width={12} height={12} />
              <Text style={[styles.editButtonText, { color: colors.textPrimary }]}>Edit</Text>
            </Pressable>
            <Pressable style={[styles.settingsButton, { backgroundColor: colors.surfaceElevated }]} onPress={() => router.push('/settings')}>
              <SettingsGearIcon color={colors.textSecondary} width={20} height={20} />
            </Pressable>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.fullName, { color: colors.textPrimary }]}>{user.fullName}</Text>
            {user.isVerified && <VerifiedBadge width={18} height={18} />}
          </View>
          <Text style={[styles.username, { color: colors.primary }]}>@{user.username}</Text>
          
          <Text style={[styles.faculty, { color: colors.textPrimary }]}>{user.faculty}</Text>
          <View style={styles.universityRow}>
            <UniversityIcon width={14} height={14} />
            <Text style={[styles.universityName, { color: colors.textSecondary }]}>{user.university.name}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{user.postsCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Post</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{user.followersCount >= 1000 ? (user.followersCount/1000).toFixed(1) + 'K' : user.followersCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{user.followingCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
          </View>
        </View>

        {/* Badges */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesContainer}>
          <View style={[styles.badgeCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
            <View style={[styles.badgeIconWrapper, { backgroundColor: isDark ? colors.primaryLight : '#F0EEFF' }]}>
              <ReputationIcon width={20} height={20} />
            </View>
            <View>
              <Text style={[styles.badgeTitle, { color: colors.textSecondary }]}>Reputation</Text>
              <Text style={[styles.badgeValue, { color: colors.textPrimary }]}>Level {user.reputation}</Text>
            </View>
          </View>
          
          <View style={[styles.badgeCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
            <View style={[styles.badgeIconWrapper, { backgroundColor: isDark ? colors.primaryLight : '#F0EEFF' }]}>
              <CalendarIcon width={20} height={20} />
            </View>
            <View>
              <Text style={[styles.badgeTitle, { color: colors.textSecondary }]}>Joined</Text>
              <Text style={[styles.badgeValue, { color: colors.textPrimary }]}>{user.joinedDate}</Text>
            </View>
          </View>
        </ScrollView>

        {/* User's Posts */}
        <View style={styles.postsSection}>
          <Text style={[styles.postsSectionTitle, { color: colors.textPrimary }]}>My Posts</Text>
          {loading ? (
            <View style={{ padding: spacing.md }}>
               <Skeleton width="100%" height={100} style={{ marginBottom: spacing.md }} />
               <Skeleton width="100%" height={100} />
            </View>
          ) : userPosts.length > 0 ? (
            userPosts.map((post) => (
              <View key={post.id} style={{ marginBottom: spacing.md, paddingHorizontal: spacing.md }}>
                <PostCard
                  post={post}
                  onVote={handleVote}
                  onPress={() => router.push(`/post/${post.id}`)}
                />
              </View>
            ))
          ) : (
            <EmptyState
              icon="📭"
              title="No posts yet"
              subtitle="You haven't posted anything"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: defaultColors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  coverContainer: {
    height: 140,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: -40,
    alignItems: 'flex-end',
  },
  avatarWrapper: {
    borderRadius: 50,
    padding: 3,
    backgroundColor: defaultColors.background,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: defaultColors.surface,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  editButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: defaultColors.textPrimary,
  },
  settingsButton: {
    backgroundColor: '#F5F5F5',
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullName: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold',
    color: defaultColors.textPrimary,
  },
  username: {
    fontSize: 14,
    color: defaultColors.primary,
    marginTop: 2,
  },
  faculty: {
    fontSize: 15,
    fontWeight: '600',
    color: defaultColors.textPrimary,
  },
  universityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  universityName: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.xl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: defaultColors.textPrimary,
  },
  statLabel: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  badgesContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  badgeCard: {
    backgroundColor: defaultColors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 140,
  },
  badgeIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTitle: {
    fontSize: 11,
    color: '#A0A0A0',
    textTransform: 'uppercase',
  },
  badgeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: defaultColors.textPrimary,
    marginTop: 2,
  },
  postsSection: {
    marginTop: spacing.xl,
  },
  postsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: defaultColors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  // Guest view styles
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
    fontWeight: 'bold',
    color: defaultColors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  guestSubtitle: {
    fontSize: 14,
    color: defaultColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing['3xl'],
  },
  signUpButton: {
    backgroundColor: defaultColors.primary,
    paddingHorizontal: spacing['5xl'],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius['3xl'],
    marginBottom: spacing.lg,
  },
  signUpButtonText: {
    color: defaultColors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    color: defaultColors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
