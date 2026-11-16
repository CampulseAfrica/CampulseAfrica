import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors as defaultColors, spacing, borderRadius, typography, useTheme } from '../theme';
import { useAuthStore } from '../store';
import {
  ChevronLeft,
  User as UserIcon,
  Lock,
  Moon,
  Bookmark,
  Info,
  HelpCircle,
  Fingerprint,
  FileText,
  LogOut,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();
  const { isDark, toggleTheme, colors } = useTheme();
  const [switchVal, setSwitchVal] = useState(isDark);

  useEffect(() => {
    setSwitchVal(isDark);
  }, [isDark]);

  const handleToggleTheme = (val: boolean) => {
    setSwitchVal(val);
    requestAnimationFrame(() => {
      toggleTheme();
    });
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        {currentUser && (
          <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
            <Image source={{ uri: currentUser.avatar }} style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{currentUser.fullName}</Text>
              <Text style={[styles.profileSubtitle, { color: colors.textSecondary }]}>{currentUser.faculty} student</Text>
            </View>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Other Settings</Text>

        {/* Settings List */}
        <View style={[styles.settingsList, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          
          <Pressable style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <UserIcon color={colors.textSecondary} size={20} />
              <Text style={[styles.settingItemText, { color: colors.textPrimary }]}>Profile Details</Text>
            </View>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Lock color={colors.textSecondary} size={20} />
              <Text style={[styles.settingItemText, { color: colors.textPrimary }]}>Privacy & Security</Text>
            </View>
          </Pressable>

          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Moon color={colors.textSecondary} size={20} />
              <Text style={[styles.settingItemText, { color: colors.textPrimary }]}>Dark Mode</Text>
            </View>
            <Switch
              value={switchVal}
              onValueChange={handleToggleTheme}
              trackColor={{ false: isDark ? '#3E3E50' : '#E0E0E0', true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Bookmark color={colors.textSecondary} size={20} />
              <Text style={[styles.settingItemText, { color: colors.textPrimary }]}>Saved Post</Text>
            </View>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Info color={colors.textSecondary} size={20} />
              <Text style={[styles.settingItemText, { color: colors.textPrimary }]}>About Application</Text>
            </View>
          </Pressable>

        </View>

        <View style={[styles.settingsList, { marginTop: spacing.md, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          
          <Pressable style={styles.settingItem} onPress={() => router.push('/help')}>
            <View style={styles.settingItemLeft}>
              <HelpCircle color={colors.textSecondary} size={20} />
              <Text style={[styles.settingItemText, { color: colors.textPrimary }]}>Help & Support</Text>
            </View>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Fingerprint color={colors.textSecondary} size={20} />
              <Text style={[styles.settingItemText, { color: colors.textPrimary }]}>Biometric Authentication</Text>
            </View>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <FileText color={colors.textSecondary} size={20} />
              <Text style={[styles.settingItemText, { color: colors.textPrimary }]}>Terms & Privacy Policy</Text>
            </View>
          </Pressable>

          <Pressable style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingItemLeft}>
              <LogOut color={colors.error} size={20} />
              <Text style={[styles.settingItemText, { color: colors.error }]}>Log Out</Text>
            </View>
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: defaultColors.textPrimary,
  },
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: defaultColors.textPrimary,
  },
  profileSubtitle: {
    fontSize: 14,
    color: defaultColors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: defaultColors.textPrimary,
    marginLeft: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingItemText: {
    fontSize: 16,
    color: defaultColors.textPrimary,
  },
});
