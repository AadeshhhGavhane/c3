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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSelector } from '@/components/language-selector';
import { useAuth } from '@/contexts/AuthContext';
import { signInSchema, type SignInInput } from '@/utils/validation';
import { useTranslation } from 'react-i18next';

const MAX_WIDTH = 448;

export default function SignInScreen() {
  const { colorScheme } = useAppearance();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signIn } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState((params.email as string) || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set email from params if available
  React.useEffect(() => {
    if (params.email) {
      setEmail(params.email as string);
    }
  }, [params.email]);

  const handleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      // Validate with Zod
      const validationData: SignInInput = {
        email: email.trim().toLowerCase(),
        password,
      };

      signInSchema.parse(validationData);

      // If validation passes, proceed with signin
      await signIn(validationData.email, validationData.password);
      router.replace('/(tabs)');
    } catch (err: any) {
      if (err.name === 'ZodError' && err.issues) {
        // Zod validation errors
        const firstError = err.issues[0];
        setError(firstError.message || 'Validation error');
      } else {
        setError(err.message || 'Failed to sign in');
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 40) },
        ]}
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
          <View style={styles.headerTop}>
            <LanguageSelector />
            <ThemeToggle />
          </View>
        </View>

        {/* Header Image */}
        <View style={styles.imageContainer}>
          <View style={[styles.imageWrapper, { backgroundColor: colors.surface }]}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn74IzN3-OI-7sym3ohixqvSR_sIyWAvnj4xaAV6DWyIyvI8rKSMLzEUEntkKK5ON8oq6cDbd_6z1v0bVt0u8jDsofKHcb6UjmIJLX6U5Vrr0rdJSaEXPqtnp-A6ycjr70YZLiDDvL_m0zOgG_PERYDRvSjPHA01QBZXLynnr1nC_3NoUNCOpRJ0XuDbkAKL_BHA7KnzKGku62Uamh4GWT3IQONO9YKff5soTQkwqNxYFGqriDAUMHiPtYorWgmAtLJjbOgval18sj',
              }}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </View>
        </View>

        {/* Content */}
        <View style={[styles.content, { maxWidth: MAX_WIDTH, alignSelf: 'center', width: '100%' }]}>
          {/* Headline */}
          <View style={styles.headline}>
            <Text style={[styles.headlineTitle, { color: colors.text }]}>
              {t('auth.welcomeBack')}
            </Text>
            <Text style={[styles.headlineSubtitle, { color: colors.subtext }]}>
              {t('auth.loginSubtitle')}
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
            {/* Email Input */}
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface,
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
                placeholder={t('auth.studentEmail')}
                placeholderTextColor={colors.subtext}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface,
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
                placeholder={t('auth.password')}
                placeholderTextColor={colors.subtext}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
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

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={() => router.push('/auth/forgot-password')}
              style={styles.forgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                {t('auth.forgotPassword')}
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                { backgroundColor: colors.primary },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>
                {loading ? t('auth.signingIn') : t('auth.signIn')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text }]}>
              {t('auth.dontHaveAccount')}{' '}
              <Text
                style={[styles.footerLink, { color: colors.primary }]}
                onPress={() => router.push('/auth/sign-up')}
              >
                {t('auth.signUp')}
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
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headline: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headlineTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  headlineSubtitle: {
    fontSize: 16,
    fontWeight: '500',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  signInButton: {
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
  signInButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 16,
  },
  footerLink: {
    fontWeight: 'bold',
  },
});

