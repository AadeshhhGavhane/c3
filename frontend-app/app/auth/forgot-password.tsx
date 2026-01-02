import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';
import { useAuth } from '@/contexts/AuthContext';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/utils/validation';
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslation } from 'react-i18next';

const MAX_WIDTH = 448;

export default function ForgotPasswordScreen() {
  const { colorScheme } = useAppearance();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validate with Zod
      const validationData: ForgotPasswordInput = {
        email: email.trim().toLowerCase(),
      };

      forgotPasswordSchema.parse(validationData);

      // If validation passes, proceed
      await forgotPassword(validationData.email);
      setSuccess(true);
      // Navigate to reset password screen after a short delay
      setTimeout(() => {
        router.push({
          pathname: '/auth/reset-password',
          params: { email: validationData.email },
        });
      }, 1500);
    } catch (err: any) {
      if (err.name === 'ZodError' && err.issues) {
        // Zod validation errors
        const firstError = err.issues[0];
        setError(firstError.message || 'Validation error');
      } else {
        setError(err.message || 'Failed to send reset instructions');
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
            <MaterialIcons name="arrow-back-ios" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <LanguageSelector />
            <ThemeToggle />
          </View>
        </View>

        {/* Header Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMrJ4UDtTeofpimpz7SDFWvCeqF6M_7aVEc98EBsgyX6jYgy9caegXiiAsAB2Zx18xT0Ur7YQfsBxqXf9fn_LLwkK6arDYOeW2uzIxDAnxoM4VcQBXvnH23WUle2O_84TKXIcIwL0ZtIwnhxef7LEfrVbT1pBCT8lTFo8-3uZAGwctiCJpU0O9rRgh6lweaKdgffW6dgHHyI36bIWBpvF19huvADlW7lBOQKYjG4QD03Omo5-2kiBlo1D2CdBxphNoAoH5vzhP9__i',
              }}
              style={styles.headerImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Content */}
        <View style={[styles.content, { maxWidth: MAX_WIDTH, alignSelf: 'center', width: '100%' }]}>
          {/* Headline */}
          <View style={styles.headline}>
            <Text style={[styles.headlineTitle, { color: colors.text }]}>
              {t('auth.forgotPasswordTitle')}
            </Text>
            <Text style={[styles.headlineSubtitle, { color: colors.subtext }]}>
              {t('auth.forgotPasswordSubtitle')}
            </Text>
          </View>

          {/* Success Message */}
          {success ? (
            <View style={[styles.successContainer, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialIcons name="check-circle" size={20} color={colors.primary} />
              <Text style={[styles.successText, { color: colors.primary }]}>
                {t('auth.resetLinkSent')}
              </Text>
            </View>
          ) : null}

          {/* Error Message */}
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialIcons name="error-outline" size={20} color={colors.primary} />
              <Text style={[styles.errorText, { color: colors.primary }]}>{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          {!success && (
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  {t('auth.emailAddress')}
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#fcfaf8',
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
                    placeholder="jane.doe@university.edu"
                    placeholderTextColor={colors.subtext}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.primary },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? t('auth.sending') : t('auth.sendResetInstructions')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Footer Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.subtext }]}>
              {t('auth.rememberPassword')}{' '}
              <Text
                style={[styles.footerLink, { color: colors.primary }]}
                onPress={() => router.push('/auth/sign-in')}
              >
                {t('auth.login')}
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: 220,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headline: {
    marginBottom: 24,
  },
  headlineTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headlineSubtitle: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
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
    fontSize: 16,
    fontWeight: '500',
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
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
  submitButton: {
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
  submitButtonText: {
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

