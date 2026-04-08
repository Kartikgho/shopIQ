import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  medium: 'Good',
  strong: 'Strong',
};

const STRENGTH_COLOR: Record<PasswordStrength, string> = {
  weak: '#DC2626',
  medium: '#D97706',
  strong: '#059669',
};

function StrengthMeter({ strength }: { strength: PasswordStrength }) {
  const n = strength === 'weak' ? 1 : strength === 'medium' ? 2 : 3;
  return (
    <View style={styles.meterRow}>
      <View style={styles.meterBars}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.meterBar,
              i < n && { backgroundColor: STRENGTH_COLOR[strength] },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.meterLabel, { color: STRENGTH_COLOR[strength] }]}>
        {STRENGTH_LABEL[strength]}
      </Text>
    </View>
  );
}

function BrandHeader({ kicker }: { kicker?: string }) {
  return (
    <View style={styles.header}>
      {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
      <Text style={styles.brand}>
        Shop<Text style={styles.brandAccent}>IQ</Text>
      </Text>
      <Text style={styles.headline}>Welcome to IQ</Text>
      <Text style={styles.subtitle}>Smarter shopping starts here.</Text>
    </View>
  );
}

export function SignUp() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

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

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const onPasswordChange = (text: string) => {
    setPassword(text);
    setPasswordFieldError('');
    if (error) setError('');
  };

  const onConfirmChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmFieldError('');
    if (error) setError('');
  };

  const authBusy = submitting || !isLoaded;

  const canSubmit =
    firstName.trim().length > 0 &&
    isValidEmail(email) &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const submit = async () => {
    if (!isLoaded || !signUp || submitting || !canSubmit) return;
    setError('');
    setPasswordFieldError('');
    setConfirmFieldError('');

    if (password !== confirmPassword) {
      setConfirmFieldError('Passwords do not match.');
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
    } catch (e: unknown) {
      if (isClerkBreachedPasswordError(e)) {
        setPasswordFieldError(BREACHED_PASSWORD_USER_MESSAGE);
      } else {
        setError(
          normalizeClerkAuthError(
            e,
            'We could not create your account. This email may already be in use — try signing in.',
          ),
        );
      }
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
        await setActive({ session: attempt.createdSessionId });
        router.replace(hrefHome);
      } else {
        setError('Verification did not finish. Request a new code from your email if needed.');
      }
    } catch (e: unknown) {
      setError(
        normalizeClerkAuthError(
          e,
          'That code is invalid or expired. Check your inbox and try again.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const nameErr = error && error.toLowerCase().includes('name') ? error : undefined;
  const emailErr =
    error &&
      (error.toLowerCase().includes('email') || error.toLowerCase().includes('account')) &&
      !nameErr
      ? error
      : undefined;
  const formErr = error && !nameErr && !emailErr ? error : undefined;

  if (pendingVerification) {
    return (
      <PremiumAuthLayout>
        <AuthCard>
          <BrandHeader kicker="Almost there" />
          <Text style={styles.flowTitle}>Verify your email</Text>
          <Text style={styles.flowSub}>Enter the 6-digit code we sent you.</Text>
          <CustomInput
            label="Verification code"
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
            errorMessage={error || undefined}
            showPasswordToggle={false}
          />
          <GradientButton
            title="Continue"
            onPress={() => void verify()}
            loading={authBusy}
            disabled={code.trim().length < 6}
          />
          <Pressable onPress={() => setPendingVerification(false)} style={styles.footer}>
            <Text style={styles.footerText}>
              Wrong email? <Text style={styles.footerLink}>Start over</Text>
            </Text>
          </Pressable>
        </AuthCard>
      </PremiumAuthLayout>
    );
  }

  return (
    <PremiumAuthLayout>
      <AuthCard>
        <BrandHeader />
        <Text style={styles.formTitle}>Sign up</Text>
        <Text style={styles.formSub}>Create your account</Text>
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
          errorMessage={nameErr}
          showPasswordToggle={false}
        />
        <CustomInput
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
          errorMessage={emailErr}
          showPasswordToggle={false}
        />
        <CustomInput
          label="Password"
          icon="lock"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
          autoCapitalize="none"
          placeholder='********'
          textContentType="newPassword"
          errorMessage={passwordFieldError || undefined}
        />
        {password.length > 0 ? <StrengthMeter strength={strength} /> : null}
        <CustomInput
          label="Confirm password"
          icon="lock"
          value={confirmPassword}
          onChangeText={onConfirmChange}
          secureTextEntry
          autoCapitalize="none"
          placeholder='********'
          textContentType="newPassword"
          errorMessage={confirmFieldError || undefined}
        />
        {formErr ? <Text style={styles.banner}>{formErr}</Text> : null}
        <GradientButton
          title="Sign up"
          onPress={() => void submit()}
          loading={authBusy}
          disabled={!canSubmit}
        />
        <Pressable onPress={() => router.push(hrefSignIn)} style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Sign In</Text>
          </Text>
        </Pressable>
      </AuthCard>
    </PremiumAuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 18,
    alignItems: 'center',
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    color: PREMIUM.accent,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  brand: {
    fontSize: 26,
    fontWeight: '800',
    color: PREMIUM.text,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  brandAccent: {
    color: PREMIUM.gradientMid,
  },
  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: PREMIUM.text,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: PREMIUM.subtext,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PREMIUM.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  formSub: {
    fontSize: 15,
    fontWeight: '400',
    color: PREMIUM.subtext,
    marginBottom: 16,
    textAlign: 'center',
  },
  flowTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PREMIUM.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  flowSub: {
    fontSize: 14,
    color: PREMIUM.subtext,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -8,
    marginBottom: 14,
  },
  meterBars: {
    flexDirection: 'row',
    flex: 1,
    gap: 6,
    marginRight: 12,
  },
  meterBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: PREMIUM.border,
  },
  meterLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  banner: {
    fontSize: 14,
    fontWeight: '500',
    color: PREMIUM.error,
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    marginTop: 22,
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 15,
    color: PREMIUM.subtext,
    fontWeight: '400',
  },
  footerLink: {
    color: PREMIUM.borderFocus,
    fontWeight: '700',
  },
});
