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
import { colors, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store';
import { universities } from '../../mocks/users';
import { University } from '../../types';

export default function SelectUniversityScreen() {
  const router = useRouter();
  const { setGuest } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUniversities = universities.filter(
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
        <TextInput
          style={styles.searchInput}
          placeholder="Search universities..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      <FlatList
        data={filteredUniversities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.universityItem,
              pressed && styles.universityItemPressed,
            ]}
            onPress={() => handleSelectUniversity(item)}
          >
            <View style={styles.universityInfo}>
              <Text style={styles.universityName}>{item.name}</Text>
              <Text style={styles.universityLocation}>{item.location}</Text>
            </View>
            <View style={styles.shortNameBadge}>
              <Text style={styles.shortNameText}>{item.shortName}</Text>
            </View>
          </Pressable>
        )}
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
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing.lg,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    paddingRight: spacing['4xl'],
  },
  searchIcon: {
    position: 'absolute',
    right: spacing['4xl'],
    top: spacing.md,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: spacing['2xl'],
  },
  universityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  universityItemPressed: {
    backgroundColor: colors.primaryLight,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  universityLocation: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  shortNameBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  shortNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  separator: {
    height: spacing.xs,
  },
  footer: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
