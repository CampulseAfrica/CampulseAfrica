import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store';
import { authService } from '../../services';
import { mockApi } from '../../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const user = await authService.login({ email, school, password });
    setUser(user);
    router.replace('/(tabs)/home');
  };

  const handleQuickLogin = async (userId: string) => {
    try {
      const user = await mockApi.loginUser(userId);
      setUser(user);
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Quick login failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800' }}
              style={styles.heroImage}
            />
            <View style={styles.heroOverlay} />
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <Pressable
              style={styles.tab}
              onPress={() => router.replace('/(auth)/sign-up')}
            >
              <Text style={styles.tabText}>Sign Up</Text>
            </Pressable>
            <Pressable style={[styles.tab, styles.tabActive]}>
              <Text style={[styles.tabText, styles.tabTextActive]}>Log In</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Welcome back, sign in to stay updated
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Johndoe@gmail.com"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>School</Text>
              <TextInput
                style={styles.input}
                placeholder="Uniben"
                placeholderTextColor={colors.textTertiary}
                value={school}
                onChangeText={setSchool}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Pressable style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </Pressable>

          {/* Development Quick Login */}
          <View style={styles.devContainer}>
            <Text style={styles.devTitle}>Development: Quick Login</Text>
            <View style={styles.devButtons}>
              <Pressable style={styles.devBtn} onPress={() => handleQuickLogin('user_1')}>
                <Text style={styles.devBtnText}>Jane</Text>
              </Pressable>
              <Pressable style={styles.devBtn} onPress={() => handleQuickLogin('user_2')}>
                <Text style={styles.devBtnText}>Alex</Text>
              </Pressable>
              <Pressable style={styles.devBtn} onPress={() => handleQuickLogin('user_3')}>
                <Text style={styles.devBtnText}>Sarah</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroContainer: {
    height: 220,
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius['3xl'],
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textInverse,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  form: {
    paddingHorizontal: spacing['2xl'],
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing['2xl'],
    marginTop: spacing['4xl'],
    marginBottom: spacing['4xl'],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius['3xl'],
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
  devContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing['2xl'],
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  devTitle: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  devButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  devBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  devBtnText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
