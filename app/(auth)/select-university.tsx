import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Search, ChevronRight } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store';
import { mockUniversities } from '../../services/mockDb';
import { University } from '../../types';

export default function SelectUniversityScreen() {
  const router = useRouter();
  const { setGuest } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUniversities = Object.values(mockUniversities).filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUniversity = (university: University) => {
    setGuest(university);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your University</Text>
        <Text style={styles.subtitle}>
          Browse campus feeds as a guest, or sign up to participate
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search 
            size={20} 
            color={colors.textTertiary} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search universities..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredUniversities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          // Placeholder image for now. You can replace this with actual university images later.
          const placeholderImage = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop';
          
          return (
            <Pressable
              style={({ pressed }) => [
                styles.universityItem,
                pressed && styles.universityItemPressed,
              ]}
              onPress={() => handleSelectUniversity(item)}
            >
              <Image 
                source={item.image ? item.image : { uri: placeholderImage }} 
                style={styles.universityImage} 
                contentFit="cover"
                transition={200}
              />
              <View style={styles.universityInfo}>
                <Text style={styles.universityName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.universityLocation} numberOfLines={1}>{item.location}</Text>
              </View>
              <View style={styles.rightContent}>
                <View style={styles.shortNameBadge}>
                  <Text style={styles.shortNameText}>{item.shortName}</Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.footer}>
        <Pressable onPress={() => router.push('/(auth)/sign-up')}>
          <Text style={styles.footerText}>
            Want to participate?{' '}
            <Text style={styles.footerLink}>Create an account</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['4xl'],
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  searchContainer: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['2xl'],
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md + 2,
    fontSize: 16,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['4xl'],
  },
  universityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  universityItemPressed: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    transform: [{ scale: 0.98 }],
  },
  universityImage: {
    width: 70,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
  },
  universityInfo: {
    flex: 1,
    marginRight: spacing.sm,
    paddingVertical: spacing.lg,
    paddingLeft: spacing.md,
  },
  universityName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs - 2,
    letterSpacing: -0.3,
  },
  universityLocation: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  shortNameBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shortNameText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  separator: {
    height: spacing.md,
  },
  footer: {
    padding: spacing['2xl'],
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  footerText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});
