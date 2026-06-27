import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/borderRadius';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri: string;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, { container: number }> = {
  sm: { container: 32 },
  md: { container: 44 },
  lg: { container: 64 },
};

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 'md',
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  image: {
    backgroundColor: colors.surface,
  },
});
