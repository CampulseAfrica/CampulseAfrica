import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  FlatList,
  ViewToken,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Path, Defs, ClipPath, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../theme';
import { useAuthStore } from '../store';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.58;
// How much the curve "bites" into the image from the bottom
const CURVE_HEIGHT = 60;

interface OnboardingSlide {
  id: string;
  image: ImageSourcePropType;
  title: string;
  buttonText: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    image: require('../assets/images/onboarding screen bg-1.png'),
    title: "Never Miss What's\nHappening on Campus",
    buttonText: 'Next',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding screen bg-2.png'),
    title: 'Real-Time Updates at Your\nFingertips',
    buttonText: 'Next',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding screen bg-3.png'),
    title: 'Connect, Discover, and\nNever Miss Out',
    buttonText: 'Get Started',
  },
];

/**
 * SVG overlay that creates the curved clip effect at the bottom of the image.
 * Draws a filled shape matching the background color that covers the bottom
 * portion with a smooth bezier curve — left side clips higher, right side lower.
 */
function CurveOverlay() {
  // The curve path:
  // - Starts at bottom-left (0, IMAGE_HEIGHT)
  // - Goes up to the start of the curve on the left side
  // - Draws a cubic bezier across to the right
  // - Goes down to bottom-right
  // - Closes the shape
  const d = `
    M 0 ${IMAGE_HEIGHT - CURVE_HEIGHT}
    C ${width * 0.25} ${IMAGE_HEIGHT - CURVE_HEIGHT - 10},
      ${width * 0.65} ${IMAGE_HEIGHT + 10},
      ${width} ${IMAGE_HEIGHT}
    L ${width} ${IMAGE_HEIGHT + 10}
    L 0 ${IMAGE_HEIGHT + 10}
    Z
  `;

  return (
    <Svg
      width={width}
      height={IMAGE_HEIGHT + 10}
      style={styles.curveOverlay}
    >
      <Path d={d} fill={colors.background} />
    </Svg>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { setOnboardingComplete } = useAuthStore();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      setOnboardingComplete();
      router.replace('/(auth)/select-university');
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      {/* Image with SVG curve clip overlay */}
      <View style={styles.imageSection}>
        <Image source={item.image} style={styles.slideImage} />
        <CurveOverlay />
      </View>

      {/* Content below image */}
      <View style={styles.slideContent}>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{slides[activeIndex].buttonText}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    width,
    flex: 1,
  },
  imageSection: {
    height: IMAGE_HEIGHT,
    width: '100%',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  curveOverlay: {
    position: 'absolute',
    bottom: -10,
    left: 0,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['5xl'],
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius['3xl'],
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});
