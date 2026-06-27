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
import type { UserProfile } from '../../types';
import { Avatar } from '../ui/Avatar';
import { VerifiedBadge } from '../ui/Icons';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditProfile?: () => void;
  onFollow?: (userId: string) => void;
}

interface StatItemProps {
  count: number;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ count, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statCount}>{count.toLocaleString()}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditProfile,
  onFollow,
}) => {
  return (
    <View style={styles.container}>
      {/* Cover Photo */}
      <View style={styles.coverWrapper}>
        {profile.coverPhoto ? (
          <Image
            source={{ uri: profile.coverPhoto }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.coverImage, styles.coverPlaceholder]} />
        )}
      </View>

      {/* Avatar (overlapping) */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarBorder}>
          <Avatar
            uri={profile.avatar}
            size="lg"
          />
        </View>
      </View>

      {/* Name + Username */}
      <View style={styles.nameSection}>
        <View style={styles.nameRow}>
          <Text style={styles.fullName}>{profile.fullName}</Text>
          {profile.isVerified && <VerifiedBadge />}
        </View>
        <Text style={styles.username}>@{profile.username}</Text>
      </View>

      {/* Faculty + University */}
      <Text style={styles.affiliationText}>
        {profile.faculty} · {profile.university.name}
      </Text>

      {/* Bio */}
      {profile.bio ? (
        <Text style={styles.bio}>{profile.bio}</Text>
      ) : null}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatItem count={profile.postsCount} label="Posts" />
        <StatItem count={profile.followersCount} label="Followers" />
        <StatItem count={profile.followingCount} label="Following" />
        <StatItem count={profile.reputation} label="Rep" />
      </View>

      {/* Action Button */}
      {profile.isOwnProfile ? (
        <Pressable
          onPress={onEditProfile}
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => onFollow?.(profile.id)}
          style={({ pressed }) => [
            profile.isFollowing ? styles.followingButton : styles.followButton,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={
              profile.isFollowing
                ? styles.followingButtonText
                : styles.followButtonText
            }
          >
            {profile.isFollowing ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingBottom: spacing['2xl'],
  },
  coverWrapper: {
    height: 160,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    backgroundColor: colors.primaryLight,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -36,
  },
  avatarBorder: {
    padding: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  nameSection: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  fullName: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  username: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  affiliationText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  bio: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textPrimary,
    lineHeight: typography.body.lineHeight,
    textAlign: 'center',
    marginTop: spacing.md,
    marginHorizontal: spacing['2xl'],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  editButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.md,
    marginHorizontal: spacing['2xl'],
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.primary,
  },
  followButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.md,
    marginHorizontal: spacing['2xl'],
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  followButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.textInverse,
  },
  followingButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.md,
    marginHorizontal: spacing['2xl'],
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  followingButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
