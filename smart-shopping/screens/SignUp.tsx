import * as Haptics from 'expo-haptics';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { AuthCard } from '@/components/auth/AuthCard';
import { CustomInput } from '@/components/auth/CustomInput';
import { GradientButton } from '@/components/auth/GradientButton';
import { PremiumAuthLayout } from '@/components/auth/PremiumAuthLayout';
import { PREMIUM } from '@/components/auth/premiumAuthTheme';
import {
  BREACHED_PASSWORD_USER_MESSAGE,
  isClerkBreachedPasswordError,
  normalizeClerkAuthError,
} from '@/utils/clerkPasswordErrors';
import { hrefHome, hrefSignIn } from '@/utils/hrefs';
import { getPasswordStrength, type PasswordStrength } from '@/utils/passwordStrength';

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
};

const STRENGTH_COLOR: Record<PasswordStrength, string> = {
  weak: '#DC2626',
  medium: '#D97706',
  strong: '#059669',
};

function BrandHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Welcome to IQ</Text>
      <Text style={styles.subtitle}>Smarter shopping starts here.</Text>
    </View>
  );
}

function StrengthMeter({ strength }: { strength: PasswordStrength }) {
  const filled = strength === 'weak' ? 1 : strength === 'medium' ? 2 : 3;
  const barStyle = useAnimatedStyle(() => ({
    width: withTiming(`${(filled / 3) * 100}%`, { duration: 220 }),
    backgroundColor: withTiming(STRENGTH_COLOR[strength], { duration: 220 }),
  }));
  return (
    <View style={styles.strengthWrap}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
      <Text style={[styles.strengthLabel, { color: STRENGTH_COLOR[strength] }]}>
        {STRENGTH_LABEL[strength]}
      </Text>
    </View>
  );
}

export function SignUp() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState('');
  const [passwordFieldError, setPasswordFieldError] = useState('');
  const [confirmFieldError, setConfirmFieldError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const authBusy = submitting || !isLoaded;
  const canSubmit =
    firstName.trim().length > 0 &&
    isValidEmail(email) &&
    password.length > 0 &&
    confirmPassword.length > 0;
  const nameError = nameTouched && firstName.trim().length < 2 ? 'Add at least 2 characters for your name.' : '';
  const emailError =
    emailTouched && email.length > 0 && !isValidEmail(email)
      ? 'That email looks off. Try the format name@email.com.'
      : '';
  const passwordSuccess = password.length > 0 && strength === 'strong' && !passwordFieldError;

  const submit = async () => {
    if (!isLoaded || !signUp || submitting) return;
    setNameTouched(true);
    setEmailTouched(true);
    setError('');
    setPasswordFieldError('');
    setConfirmFieldError('');
    if (!canSubmit || firstName.trim().length < 2) return;
    if (password !== confirmPassword) {
      setConfirmFieldError("Those passwords don't match yet.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp.create({
        firstName: firstName.trim(),
        emailAddress: email.trim(),
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e: unknown) {
      if (isClerkBreachedPasswordError(e)) {
        setPasswordFieldError(BREACHED_PASSWORD_USER_MESSAGE);
      } else {
        setError(
          normalizeClerkAuthError(
            e,
            "We couldn't create your account right now. Try again in a moment.",
          ),
        );
      }
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  const verify = async () => {
    if (!isLoaded || !signUp || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (attempt.status === 'complete' && attempt.createdSessionId && setActive) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await setActive({ session: attempt.createdSessionId });
        router.replace(hrefHome);
      } else {
        setError('This code looks invalid or expired. Request a fresh one and try again.');
      }
    } catch (e: unknown) {
      setError(normalizeClerkAuthError(e, "We couldn't verify that code. Please try again."));
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  if (pendingVerification) {
    return (
      <PremiumAuthLayout>
        <AuthCard>
          <BrandHeader />
          <Text style={styles.sectionTitle}>Verify your email</Text>
          <CustomInput
            label="6-digit code"
          icon="mail"
            value={code}
            onChangeText={(t) => {
              setCode(t);
              if (error) setError('');
            }}
            keyboardType="number-pad"
            autoCapitalize="none"
            textContentType="oneTimeCode"
            maxLength={6}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => void verify()}
            showPasswordToggle={false}
            errorMessage={error || undefined}
          />
          <GradientButton
            title="Continue"
            onPress={() => void verify()}
            loading={authBusy}
            disabled={code.trim().length < 6}
          />
          <Pressable onPress={() => router.push(hrefSignIn)} style={styles.secondaryRow}>
            <Text style={styles.secondaryText}>Back to sign in</Text>
          </Pressable>
        </AuthCard>
      </PremiumAuthLayout>
    );
  }

  return (
    <PremiumAuthLayout>
      <AuthCard>
        <BrandHeader />
        <CustomInput
          label="Name"
          icon="user"
          value={firstName}
          placeholder='John Doe'
          onChangeText={(t) => {
            setFirstName(t);
            if (error) setError('');
          }}
          autoCapitalize="words"
          autoFocus
          returnKeyType="next"
          onBlur={() => setNameTouched(true)}
          onSubmitEditing={() => emailRef.current?.focus()}
          errorMessage={nameError}
          showPasswordToggle={false}
        />
        <CustomInput
          ref={emailRef}
          label="Email"
          icon="mail"
          placeholder='johndoe@gmail.com'
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (error) setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onBlur={() => setEmailTouched(true)}
          onSubmitEditing={() => passwordRef.current?.focus()}
          errorMessage={emailError}
          showPasswordToggle={false}
        />
        <CustomInput
          ref={passwordRef}
          label="Password"
          icon="lock"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setPasswordFieldError('');
            if (error) setError('');
          }}
          secureTextEntry
          autoCapitalize="none"
          placeholder='********'
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          errorMessage={passwordFieldError || undefined}
          success={passwordSuccess}
        />
        {password.length > 0 ? <StrengthMeter strength={strength} /> : null}
        <CustomInput
          ref={confirmRef}
          label="Confirm password"
          icon="lock"
          value={confirmPassword}
          onChangeText={(t) => {
            setConfirmPassword(t);
            setConfirmFieldError('');
            if (error) setError('');
          }}
          secureTextEntry
          autoCapitalize="none"
          placeholder='********'
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={() => void submit()}
          errorMessage={confirmFieldError || undefined}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <GradientButton
          title="Create account"
          onPress={() => void submit()}
          loading={authBusy}
          disabled={!canSubmit}
        />
        <Pressable
          onPress={() => router.push(hrefSignIn)}
          onHoverIn={() => setCtaHover(true)}
          onHoverOut={() => setCtaHover(false)}
          style={styles.secondaryRow}>
          <Text style={styles.secondaryText}>
            Already have an account? <Text style={[styles.secondaryLink, ctaHover && styles.hoverLink]}>Sign in</Text>
          </Text>
        </Pressable>
      </AuthCard>
    </PremiumAuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 26,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: PREMIUM.text,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: PREMIUM.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PREMIUM.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  strengthWrap: {
    marginTop: -6,
    marginBottom: 12,
    gap: 8,
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: PREMIUM.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    width: '0%',
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: PREMIUM.error,
    marginBottom: 8,
    fontWeight: '500',
  },
  secondaryRow: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 6,
  },
  secondaryText: {
    fontSize: 15,
    color: PREMIUM.subtext,
    fontWeight: '500',
  },
  secondaryLink: {
    color: PREMIUM.primary,
    fontWeight: '700',
  },
  hoverLink: {
    opacity: 0.8,
  },
});
