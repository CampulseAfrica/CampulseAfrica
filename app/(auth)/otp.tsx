import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store';
import { authService } from '../../services';


export default function OTPScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    const isValid = await authService.verifyOtp(otpString);
    if (isValid) {
      // Log the user in with mock data
      const user = await authService.getCurrentUser();
      if (user) {
        setUser(user);
      }
      router.replace('/(tabs)/home');
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={{ padding: spacing.xs }}>
              <ChevronLeft color={colors.textPrimary} size={24} />
            </Pressable>
          </View>

          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 4-digit verification code to your email address
          </Text>

          <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : null,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Pressable onPress={handleResend}>
          <Text style={styles.resendText}>
            Didn't receive the code?{' '}
            <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </Pressable>

        <Pressable
          style={[styles.verifyButton, !isComplete && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={!isComplete}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['3xl'],
  },
  header: {
    marginBottom: spacing['3xl'],
  },
  backButton: {
    marginBottom: spacing['3xl'],
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
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
    marginBottom: spacing['4xl'],
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing['3xl'],
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  otpInputFilled: {
    borderColor: colors.primary,
  },
  resendText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['4xl'],
  },
  resendLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius['3xl'],
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});
