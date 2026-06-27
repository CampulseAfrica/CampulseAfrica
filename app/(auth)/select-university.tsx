import React, { useState, useEffect } from 'react';
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
import { Search } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store';
import { authService } from '../../services';
import { University } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';

export default function SelectUniversityScreen() {
  const router = useRouter();
  const { setGuest } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    authService.getUniversities().then((data) => {
      if (isMounted) {
        setUniversities(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleSelect = (university: University) => {
    if (selectedId === university.id) {
      setSelectedId(null);
    } else {
      setSelectedId(university.id);
    }
  };

  const handleConfirmSelection = () => {
    const selectedUni = universities.find(u => u.id === selectedId);
    if (selectedUni) {
      setGuest(selectedUni);
      router.replace('/(tabs)/home');
    }
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

      {loading ? (
        <View style={styles.listContent}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={[styles.universityItem, { padding: spacing.md }]}>
              <Skeleton width={48} height={48} borderRadius={24} />
              <View style={styles.universityInfo}>
                <Skeleton width="60%" height={16} style={{ marginBottom: 4 }} />
                <Skeleton width="40%" height={14} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredUniversities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedId;
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.universityItem,
                  isSelected && styles.universityItemSelected,
                  pressed && !isSelected && styles.universityItemPressed,
                ]}
                onPress={() => handleToggleSelect(item)}
              >
                <View style={styles.universityInfo}>
                  <Text style={styles.universityName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.universityLocation} numberOfLines={1}>{item.location}</Text>
                </View>
                <View style={styles.rightContent}>
                  <View style={styles.shortNameBadge}>
                    <Text style={styles.shortNameText}>{item.shortName}</Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No universities found</Text>
            </View>
          }
        />
      )}

      {selectedId ? (
        <View style={styles.footer}>
          <Button
            title="Confirm Selection"
            onPress={handleConfirmSelection}
            fullWidth
            size="lg"
          />
        </View>
      ) : (
        <View style={styles.footer}>
          <Pressable onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={styles.footerText}>
              Want to participate?{' '}
              <Text style={styles.footerLink}>Create an account</Text>
            </Text>
          </Pressable>
        </View>
      )}
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
    paddingTop: spacing['4xl'] * 0.5,
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
    paddingBottom: spacing['md'],
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
  universityItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
    elevation: 0,
    shadowOpacity: 0,
    transform: [{ scale: 0.98 }],
  },
  universityInfo: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
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
  },
  separator: {
    height: spacing.md,
  },
  emptyContainer: {
    padding: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
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
