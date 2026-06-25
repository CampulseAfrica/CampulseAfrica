import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/borderRadius';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri: string;
  size?: AvatarSize;
  isVerified?: boolean;
}

const sizeMap: Record<AvatarSize, { container: number; badge: number; badgeIcon: number; badgeOffset: number }> = {
  sm: { container: 32, badge: 14, badgeIcon: 8, badgeOffset: -1 },
  md: { container: 44, badge: 18, badgeIcon: 10, badgeOffset: -1 },
  lg: { container: 64, badge: 22, badgeIcon: 12, badgeOffset: -2 },
};

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 'md',
  isVerified = false,
}) => {
  const dim = sizeMap[size];

  const containerStyle: ViewStyle = {
    width: dim.container,
    height: dim.container,
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Image
        source={{ uri }}
        style={[
          styles.image,
          {
            width: dim.container,
            height: dim.container,
            borderRadius: borderRadius.full,
          },
        ]}
      />
      {isVerified && (
        <View
          style={[
            styles.badge,
            {
              width: dim.badge,
              height: dim.badge,
              borderRadius: borderRadius.full,
              bottom: dim.badgeOffset,
              right: dim.badgeOffset,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeIcon,
              { fontSize: dim.badgeIcon },
            ]}
          >
            ✓
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  image: {
    backgroundColor: colors.border,
  },
  badge: {
    position: 'absolute',
    backgroundColor: colors.verified,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeIcon: {
    color: colors.textInverse,
    fontWeight: '700',
  },
});
