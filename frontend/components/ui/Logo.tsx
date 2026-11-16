import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';

interface CampulseLogoProps {
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

export const CampulseLogo: React.FC<CampulseLogoProps> = ({
  height = 32,
  width,
  style,
}) => {
  const { isDark } = useTheme();
  // Aspect ratio of the horizontal brand lockup is 1057 / 200 = 5.285
  const calculatedWidth = width ?? Math.round(height * (1057 / 200));

  return (
    <Image
      source={
        isDark
          ? require('../../assets/images/logo/campulse-horizontal-dark.png')
          : require('../../assets/images/logo/campulse-horizontal.png')
      }
      style={[{ width: calculatedWidth, height }, style]}
      resizeMode="contain"
    />
  );
};
