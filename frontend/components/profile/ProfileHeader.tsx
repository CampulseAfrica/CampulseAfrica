import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
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
  countColor: string;
  labelColor: string;
}

const StatItem: React.FC<StatItemProps> = ({ count, label, countColor, labelColor }) => (
  <View style={styles.statItem}>
    <Text style={[styles.statCount, { color: countColor }]}>{count.toLocaleString()}</Text>
    <Text style={[styles.statLabel, { color: labelColor }]}>{label}</Text>
  </View>
);

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditProfile,
  onFollow,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Cover Photo */}
      <View style={styles.coverWrapper}>
        {profile.coverPhoto ? (
          <Image
            source={{ uri: profile.coverPhoto }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.coverImage,
              styles.coverPlaceholder,
              { backgroundColor: colors.primaryLight },
            ]}
          />
        )}
      </View>

      {/* Avatar (overlapping) */}
      <View style={styles.avatarWrapper}>
        <View style={[styles.avatarBorder, { backgroundColor: colors.surface }]}>
          <Avatar
            uri={profile.avatar}
            size="lg"
          />
        </View>
      </View>

      {/* Name + Username */}
      <View style={styles.nameSection}>
        <View style={styles.nameRow}>
          <Text style={[styles.fullName, { color: colors.textPrimary }]}>
            {profile.fullName}
          </Text>
          {profile.isVerified && <VerifiedBadge />}
        </View>
        <Text style={[styles.username, { color: colors.textSecondary }]}>
          @{profile.username}
        </Text>
      </View>

      {/* Faculty + University */}
      <Text style={[styles.affiliationText, { color: colors.textSecondary }]}>
        {profile.faculty} · {profile.university.name}
      </Text>

      {/* Bio */}
      {profile.bio ? (
        <Text style={[styles.bio, { color: colors.textPrimary }]}>{profile.bio}</Text>
      ) : null}

      {/* Stats Row */}
      <View
        style={[
          styles.statsRow,
          {
            borderTopColor: colors.divider,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <StatItem
          count={profile.postsCount}
          label="Posts"
          countColor={colors.textPrimary}
          labelColor={colors.textSecondary}
        />
        <StatItem
          count={profile.followersCount}
          label="Followers"
          countColor={colors.textPrimary}
          labelColor={colors.textSecondary}
        />
        <StatItem
          count={profile.followingCount}
          label="Following"
          countColor={colors.textPrimary}
          labelColor={colors.textSecondary}
        />
        <StatItem
          count={profile.reputation}
          label="Rep"
          countColor={colors.textPrimary}
          labelColor={colors.textSecondary}
        />
      </View>

      {/* Action Button */}
      {profile.isOwnProfile ? (
        <Pressable
          onPress={onEditProfile}
          style={({ pressed }) => [
            styles.editButton,
            { borderColor: colors.primary },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.editButtonText, { color: colors.primary }]}>
            Edit Profile
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => onFollow?.(profile.id)}
          style={({ pressed }) => [
            profile.isFollowing
              ? [styles.followingButton, { borderColor: colors.primary }]
              : [styles.followButton, { backgroundColor: colors.primary }],
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={
              profile.isFollowing
                ? [styles.followingButtonText, { color: colors.primary }]
                : [styles.followButtonText, { color: colors.textInverse }]
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
    paddingBottom: spacing['2xl'],
  },
  coverWrapper: {
    height: 160,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {},
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -36,
  },
  avatarBorder: {
    padding: 3,
    borderRadius: borderRadius.full,
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
  },
  username: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    marginTop: spacing.xxs,
  },
  affiliationText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  bio: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
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
    borderBottomWidth: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    marginTop: spacing.xxs,
  },
  editButton: {
    borderWidth: 1.5,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.md,
    marginHorizontal: spacing['2xl'],
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
  followButton: {
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.md,
    marginHorizontal: spacing['2xl'],
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  followButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
  followingButton: {
    borderWidth: 1.5,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.md,
    marginHorizontal: spacing['2xl'],
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  followingButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
  pressed: {
    opacity: 0.85,
  },
});
