import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSelector } from '@/components/language-selector';
import { useAuth } from '@/contexts/AuthContext';
import { signUpSchema, type SignUpInput } from '@/utils/validation';
import { useTranslation } from 'react-i18next';

const MAX_WIDTH = 448;

export default function SignUpScreen() {
  const { colorScheme } = useAppearance();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp } = useAuth();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!agreedToTerms) {
      setError(t('auth.agreeToTerms') + ' ' + t('auth.termsOfService') + ' ' + t('auth.and') + ' ' + t('auth.privacyPolicy'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Validate with Zod
      const validationData: SignUpInput = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      };

      signUpSchema.parse(validationData);

      // If validation passes, proceed with signup
      await signUp(validationData.name, validationData.email, validationData.password);
      router.push(`/auth/otp?email=${encodeURIComponent(validationData.email)}`);
    } catch (err: any) {
      if (err.name === 'ZodError' && err.issues) {
        // Zod validation errors
        const firstError = err.issues[0];
        setError(firstError.message || 'Validation error');
      } else {
        setError(err.message || 'Failed to sign up');
      }
    } finally {
      setLoading(false);
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
            {t('auth.createAccount')}
          </Text>
          <View style={styles.headerRight}>
            <LanguageSelector />
            <ThemeToggle />
          </View>
        </View>

        {/* Content */}
        <View style={[styles.content, { maxWidth: MAX_WIDTH, alignSelf: 'center', width: '100%' }]}>
          {/* Headline */}
          <View style={styles.headline}>
            <Text style={[styles.headlineTitle, { color: colors.text }]}>
              {t('auth.letsEat')}
            </Text>
            <Text style={[styles.headlineSubtitle, { color: colors.subtext }]}>
              {t('auth.joinCommunity')}
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialIcons name="error-outline" size={20} color={colors.primary} />
              <Text style={[styles.errorText, { color: colors.primary }]}>{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('auth.fullName')}
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f3ede7',
                    borderColor: colors.border,
                  },
                ]}
              >
                <MaterialIcons
                  name="person"
                  size={20}
                  color={colors.subtext}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Jane Doe"
                  placeholderTextColor={colors.subtext}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('auth.email')}
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f3ede7',
                    borderColor: colors.border,
                  },
                ]}
              >
                <MaterialIcons
                  name="mail"
                  size={20}
                  color={colors.subtext}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="student@college.edu"
                  placeholderTextColor={colors.subtext}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('auth.password')}
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f3ede7',
                    borderColor: colors.border,
                  },
                ]}
              >
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={colors.subtext}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.subtext}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={colors.subtext}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('auth.confirmPassword')}
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f3ede7',
                    borderColor: colors.border,
                  },
                ]}
              >
                <MaterialIcons
                  name="lock-reset"
                  size={20}
                  color={colors.subtext}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.subtext}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <MaterialIcons
                    name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={colors.subtext}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Checkbox */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                style={styles.checkboxContainer}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: agreedToTerms ? colors.primary : 'transparent',
                      borderColor: agreedToTerms ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {agreedToTerms && (
                    <MaterialIcons name="check" size={16} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={[styles.termsText, { color: colors.subtext }]}>
                {t('auth.agreeToTerms')}{' '}
                <Text style={[styles.termsLink, { color: colors.primary }]}>
                  {t('auth.termsOfService')}
                </Text>{' '}
                {t('auth.and')}{' '}
                <Text style={[styles.termsLink, { color: colors.primary }]}>
                  {t('auth.privacyPolicy')}
                </Text>
                .
              </Text>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                { backgroundColor: colors.primary },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text }]}>
              {t('auth.alreadyHaveAccount')}{' '}
              <Text
                style={[styles.footerLink, { color: colors.primary }]}
                onPress={() => router.push('/auth/sign-in')}
              >
                {t('auth.logIn')}
              </Text>
            </Text>
          </View>
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headline: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headlineTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  headlineSubtitle: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
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
    fontWeight: 'normal',
  },
  eyeButton: {
    padding: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  checkboxContainer: {
    paddingTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '500',
  },
  signUpButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#ec7f13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontWeight: 'bold',
  },
});

