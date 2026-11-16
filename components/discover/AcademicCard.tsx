import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import type { AcademicMaterial } from '../../types';

interface AcademicCardProps {
  item: AcademicMaterial;
  onPress: (item: AcademicMaterial) => void;
}

export const AcademicCard: React.FC<AcademicCardProps> = ({
  item,
  onPress,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.bottomContent}>
          <Text
            style={[
              styles.courseCode,
              { color: isDark ? '#B4AFFF' : colors.primaryLight },
            ]}
          >
            {item.courseCode}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.authorRow}>
            <Image
              source={{ uri: item.author.avatar }}
              style={[styles.authorAvatar, { backgroundColor: colors.border }]}
            />
            <Text style={styles.authorName} numberOfLines={1}>
              {item.author.name}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  pressed: {
    opacity: 0.95,
  },
  background: {
    height: 220,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    borderRadius: borderRadius.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: borderRadius.lg,
  },
  bottomContent: {
    padding: spacing.lg,
  },
  courseCode: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.captionSemibold.fontWeight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xxs,
  },
  title: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
  },
  authorName: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
