import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';
import { useAuth } from '@/contexts/AuthContext';
import { verifyOTPSchema, type VerifyOTPInput } from '@/utils/validation';
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslation } from 'react-i18next';

const MAX_WIDTH = 448;

export default function OtpScreen() {
  const { colorScheme } = useAppearance();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { verifyOTP, sendOTP } = useAuth();
  const { t } = useTranslation();

  const email = (params.email as string) || '';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Countdown timer for resend
  React.useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer, canResend]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');

    if (!email) {
      setError(t('auth.emailNotFound'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Validate with Zod
      const validationData: VerifyOTPInput = {
        email: email.trim().toLowerCase(),
        otp: otpString,
      };

      verifyOTPSchema.parse(validationData);

      // If validation passes, proceed with verification
      await verifyOTP(validationData.email, validationData.otp);
      // After OTP verification, user needs to sign in
      router.replace(`/auth/sign-in?email=${encodeURIComponent(validationData.email)}`);
    } catch (err: any) {
      if (err.name === 'ZodError' && err.issues) {
        // Zod validation errors
        const firstError = err.issues[0];
        setError(firstError.message || 'Validation error');
      } else {
        setError(err.message || 'Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;

    setError('');
    setCanResend(false);
    setResendTimer(30);

    try {
      await sendOTP(email);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Bar */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              paddingTop: Math.max(insets.top + 8, 32),
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('auth.verification')}
          </Text>
          <View style={styles.headerRight}>
            <LanguageSelector />
            <ThemeToggle />
          </View>
        </View>

        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: `${colors.primary}20`,
                borderColor: `${colors.primary}30`,
              },
            ]}
          >
            <MaterialIcons name="lock-open" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('auth.enterCode')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            {t('auth.otpSentMessage')}{'\n'}
            <Text style={{ fontWeight: '600', color: colors.text }}>{email}</Text>
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          <View style={styles.otpInputs}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[
                  styles.otpInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: digit ? colors.primary : colors.border,
                    color: colors.text,
                  },
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Error Message */}
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialIcons name="error-outline" size={20} color={colors.primary} />
              <Text style={[styles.errorText, { color: colors.primary }]}>{error}</Text>
            </View>
          ) : null}

          {/* Resend Timer */}
          <View style={styles.resendContainer}>
            <Text style={[styles.resendText, { color: colors.subtext }]}>
              {canResend ? (
                <>
                  {t('auth.didntReceiveCode')}{' '}
                  <Text
                    style={[styles.resendLink, { color: colors.primary }]}
                    onPress={handleResend}
                  >
                    {t('auth.resend')}
                  </Text>
                </>
              ) : (
                <>
                  {t('auth.resendCodeIn')}{' '}
                  <Text style={[styles.resendTimer, { color: colors.primary }]}>
                    {String(Math.floor(resendTimer / 60)).padStart(2, '0')}:
                    {String(resendTimer % 60).padStart(2, '0')}
                  </Text>
                </>
              )}
            </Text>
          </View>
        </View>

        {/* Verify Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.verifyButton,
              { backgroundColor: colors.primary },
              loading && styles.buttonDisabled,
            ]}
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}            >
              {loading ? t('auth.verifying') : t('auth.verify')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  otpContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 24,
  },
  otpInputs: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  otpInput: {
    width: 56,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resendLink: {
    fontWeight: 'bold',
  },
  resendTimer: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  verifyButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ec7f13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

