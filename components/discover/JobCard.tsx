import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import type { Job } from '../../types';

interface JobCardProps {
  item: Job;
  onApply: (item: Job) => void;
  onBookmark: (item: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  item,
  onApply,
  onBookmark,
}) => {
  return (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay */}
        <View style={styles.overlay} />

        {/* Category Tag */}
        <View style={styles.topRow}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Pressable
            onPress={() => onBookmark(item)}
            style={({ pressed }) => [
              styles.bookmarkBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.bookmarkIcon}>
              {item.isBookmarked ? '🔖' : '🔖'}
            </Text>
          </Pressable>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Pressable
            onPress={() => onApply(item)}
            style={({ pressed }) => [
              styles.applyButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.applyText}>Apply For Job</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
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
  background: {
    height: 260,
    justifyContent: 'space-between',
  },
  backgroundImage: {
    borderRadius: borderRadius.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: borderRadius.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
  },
  categoryTag: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  categoryText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.captionSemibold.fontWeight,
    color: colors.textInverse,
  },
  bookmarkBtn: {
    padding: spacing.xs,
  },
  bookmarkIcon: {
    fontSize: 22,
  },
  pressed: {
    opacity: 0.85,
  },
  bottomContent: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.md,
    lineHeight: typography.caption.lineHeight,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    alignSelf: 'flex-start',
  },
  applyText: {
    fontSize: typography.captionSemibold.fontSize,
    fontWeight: typography.captionSemibold.fontWeight,
    color: colors.textInverse,
  },
});
