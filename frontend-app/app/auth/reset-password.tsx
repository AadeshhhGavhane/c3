import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { emailSchema, otpSchema, passwordSchema } from '@/utils/validation';
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslation } from 'react-i18next';

const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const { colorScheme } = useAppearance();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { resetPassword, forgotPassword } = useAuth();
  const { t } = useTranslation();

  const email = (params.email as string) || '';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleReset = async () => {
    const otpString = otp.join('');

    if (!email) {
      setError(t('auth.emailNotFound'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Validate with Zod
      const validationData: ResetPasswordInput = {
        email: email.trim().toLowerCase(),
        otp: otpString,
        newPassword,
        confirmPassword,
      };

      resetPasswordSchema.parse(validationData);

      // If validation passes, proceed with reset
      await resetPassword(validationData.email, validationData.otp, validationData.newPassword);
      // After password reset, navigate to sign in
      router.replace(`/auth/sign-in?email=${encodeURIComponent(validationData.email)}`);
    } catch (err: any) {
      if (err.name === 'ZodError' && err.issues) {
        // Zod validation errors
        const firstError = err.issues[0];
        setError(firstError.message || 'Validation error');
      } else {
        setError(err.message || 'Failed to reset password');
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
      await forgotPassword(email);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={[
          styles.contentWrapper,
          { paddingBottom: Math.max(insets.bottom, 40) },
        ]}
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
            {t('auth.resetPassword')}
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
            <MaterialIcons name="lock-reset" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('auth.resetPasswordTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            {t('auth.resetPasswordSubtitle')}{'\n'}
            <Text style={{ fontWeight: '600', color: colors.text }}>{email}</Text>
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('auth.enterCode')}
          </Text>
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
        </View>

        {/* Password Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('auth.newPassword')}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialIcons name="lock" size={20} color={colors.subtext} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={t('auth.newPasswordPlaceholder')}
                placeholderTextColor={colors.subtext}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={colors.subtext}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('auth.confirmPassword')}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialIcons name="lock" size={20} color={colors.subtext} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                placeholderTextColor={colors.subtext}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError('');
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={colors.subtext}
                />
              </TouchableOpacity>
            </View>
          </View>
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

        {/* Reset Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.resetButton,
              { backgroundColor: colors.primary },
              loading && styles.buttonDisabled,
            ]}
            onPress={handleReset}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>
              {loading ? t('auth.resetting') : t('auth.resetPassword')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  otpContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  formContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  resendText: {
    fontSize: 14,
    textAlign: 'center',
  },
  resendLink: {
    fontWeight: '600',
  },
  resendTimer: {
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  resetButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

