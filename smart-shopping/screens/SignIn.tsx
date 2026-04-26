import * as Haptics from 'expo-haptics';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthCard } from '@/components/auth/AuthCard';
import { CustomInput } from '@/components/auth/CustomInput';
import { GradientButton } from '@/components/auth/GradientButton';
import { PremiumAuthLayout } from '@/components/auth/PremiumAuthLayout';
import { PREMIUM } from '@/components/auth/premiumAuthTheme';
import { normalizeClerkAuthError } from '@/utils/clerkPasswordErrors';
import { hrefHome, hrefSignUp } from '@/utils/hrefs';

type ForgotStep = 'idle' | 'email' | 'code';

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function BrandHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Welcome to IQ</Text>
      <Text style={styles.subtitle}>Smarter shopping starts here.</Text>
    </View>
  );
}

export function SignIn() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const passwordRef = useRef<TextInput>(null);
  const resetCodeRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [forgotStep, setForgotStep] = useState<ForgotStep>('idle');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [forgotHover, setForgotHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  const resetForgot = useCallback(() => {
    setForgotStep('idle');
    setResetEmail('');
    setResetCode('');
    setNewPassword('');
    setError('');
  }, []);

  const authBusy = submitting || !isLoaded;
  const resetBusy = resetSubmitting || !isLoaded;
  const emailError =
    emailTouched && email.length > 0 && !isValidEmail(email)
      ? 'That email looks off. Try the format name@email.com.'
      : '';
  const passwordError = passwordTouched && password.length === 0 ? 'Please enter your password to continue.' : '';

  const submit = async () => {
    if (!isLoaded || !signIn || submitting) return;
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!isValidEmail(email) || !password.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete' && result.createdSessionId && setActive) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await setActive({ session: result.createdSessionId });
        router.replace(hrefHome);
        return;
      }

      setError("We couldn't sign you in yet. Double-check your email and password.");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (e: unknown) {
      setError(
        normalizeClerkAuthError(
          e,
          "We couldn't sign you in yet. Double-check your email and password.",
        ),
      );
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  const sendResetEmail = async () => {
    if (!isLoaded || !signIn || resetSubmitting) return;
    if (!isValidEmail(resetEmail)) {
      setError('Enter a valid email address to receive a code.');
      return;
    }
    setResetSubmitting(true);
    setError('');
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: resetEmail.trim(),
      });
      setForgotStep('code');
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e: unknown) {
      setError(normalizeClerkAuthError(e, 'Could not send code right now. Please try again.'));
    } finally {
      setResetSubmitting(false);
    }
  };

  const completePasswordReset = async () => {
    if (!isLoaded || !signIn || resetSubmitting) return;
    if (!resetCode.trim() || !newPassword.trim()) {
      setError('Enter your code and a new password to continue.');
      return;
    }
    setResetSubmitting(true);
    setError('');
    try {
      await (
        signIn as {
          attemptFirstFactor: (args: { strategy: string; code: string }) => Promise<unknown>;
          resetPassword?: (args: { password: string }) => Promise<unknown>;
        }
      ).attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode.trim(),
      });

      const resource = signIn as {
        resetPassword?: (args: { password: string }) => Promise<unknown>;
      };
      if (typeof resource.resetPassword === 'function') {
        await resource.resetPassword({ password: newPassword });
      }
      setError('Password updated. Continue with your new password.');
      setForgotStep('idle');
      setPassword('');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: unknown) {
      setError(normalizeClerkAuthError(e, 'Code or password looks invalid. Please try again.'));
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setResetSubmitting(false);
    }
  };

  if (forgotStep === 'email') {
    return (
      <PremiumAuthLayout>
        <AuthCard>
          <BrandHeader />
          <Text style={styles.sectionTitle}>Reset password</Text>
          <CustomInput
            label="Email"
          icon="mail"
            value={resetEmail}
            onChangeText={(t) => {
              setResetEmail(t);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => void sendResetEmail()}
            errorMessage={error || undefined}
            showPasswordToggle={false}
          />
          <GradientButton
            title="Send code"
            onPress={() => void sendResetEmail()}
            loading={resetBusy}
            disabled={!isValidEmail(resetEmail)}
          />
          <Pressable onPress={resetForgot} style={styles.secondaryRow}>
            <Text style={styles.secondaryText}>Back to sign in</Text>
          </Pressable>
        </AuthCard>
      </PremiumAuthLayout>
    );
  }

  if (forgotStep === 'code') {
    return (
      <PremiumAuthLayout>
        <AuthCard>
          <BrandHeader />
          <Text style={styles.sectionTitle}>Enter reset code</Text>
          <CustomInput
            ref={resetCodeRef}
            label="Verification code"
          icon="mail"
            value={resetCode}
            onChangeText={(t) => {
              setResetCode(t);
              if (error) setError('');
            }}
            keyboardType="number-pad"
            autoCapitalize="none"
            textContentType="oneTimeCode"
            maxLength={6}
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => newPasswordRef.current?.focus()}
            showPasswordToggle={false}
          />
          <CustomInput
            ref={newPasswordRef}
            label="New password"
          icon="lock"
            value={newPassword}
            onChangeText={(t) => {
              setNewPassword(t);
              if (error) setError('');
            }}
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={() => void completePasswordReset()}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <GradientButton
            title="Update password"
            onPress={() => void completePasswordReset()}
            loading={resetBusy}
            disabled={resetCode.trim().length < 6 || !newPassword}
          />
          <Pressable onPress={() => setForgotStep('email')} style={styles.secondaryRow}>
            <Text style={styles.secondaryText}>Use another email</Text>
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
          label="Email"
          icon="mail"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (error) setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          autoFocus
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
            if (error) setError('');
          }}
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          returnKeyType="done"
          onBlur={() => setPasswordTouched(true)}
          onSubmitEditing={() => void submit()}
          errorMessage={passwordError}
        />
        <Pressable
          onPress={() => {
            setError('');
            setResetEmail(email.trim());
            setForgotStep('email');
          }}
          onHoverIn={() => setForgotHover(true)}
          onHoverOut={() => setForgotHover(false)}
          style={styles.forgotRow}>
          <Text style={[styles.forgotText, forgotHover && styles.hoverLink]}>Forgot password?</Text>
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <GradientButton
          title="Continue"
          onPress={() => void submit()}
          loading={authBusy}
          disabled={!isValidEmail(email) || !password.trim()}
        />
        <Pressable
          onPress={() => router.push(hrefSignUp)}
          onHoverIn={() => setCtaHover(true)}
          onHoverOut={() => setCtaHover(false)}
          style={styles.secondaryRow}>
          <Text style={styles.secondaryText}>
            New to ShopIQ? <Text style={[styles.secondaryLink, ctaHover && styles.hoverLink]}>Create account</Text>
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
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: 0,
    marginBottom: 14,
    paddingVertical: 6,
  },
  forgotText: {
    fontSize: 14,
    color: PREMIUM.primary,
    fontWeight: '600',
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
