import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

export function SignIn() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [forgotStep, setForgotStep] = useState<ForgotStep>('idle');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);

  const resetForgot = useCallback(() => {
    setForgotStep('idle');
    setResetEmail('');
    setResetCode('');
    setNewPassword('');
    setError('');
  }, []);

  const authBusy = submitting || !isLoaded;
  const resetBusy = resetSubmitting || !isLoaded;

  const emailErr =
    error && (error.toLowerCase().includes('email') || error.toLowerCase().includes('identifier'))
      ? error
      : undefined;
  const passwordErr =
    error && error.toLowerCase().includes('password') && !emailErr ? error : undefined;
  const bannerErr = error && !emailErr && !passwordErr ? error : undefined;

  const canSubmit = isValidEmail(email) && password.length > 0;

  const submit = async () => {
    if (!isLoaded || !signIn || submitting || !canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete' && result.createdSessionId && setActive) {
        await setActive({ session: result.createdSessionId });
        router.replace(hrefHome);
        return;
      }

      if (result.status === 'needs_second_factor') {
        setError(
          'Extra verification is required on your account. Check your security settings or try another sign-in method.',
        );
        return;
      }

      setError('We could not finish sign-in. Double-check your email and password.');
    } catch (e: unknown) {
      setError(
        normalizeClerkAuthError(
          e,
          'Sign-in failed. Your email or password may be incorrect — try again or reset your password.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const sendResetEmail = async () => {
    if (!isLoaded || !signIn || resetSubmitting) return;
    const id = resetEmail.trim();
    if (!isValidEmail(id)) {
      setError('Please enter a valid email address.');
      return;
    }
    setResetSubmitting(true);
    setError('');
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: id,
      });
      setForgotStep('code');
    } catch (e: unknown) {
      setError(
        normalizeClerkAuthError(
          e,
          'We could not send a reset code. Confirm the email or try again in a few minutes.',
        ),
      );
    } finally {
      setResetSubmitting(false);
    }
  };

  const completePasswordReset = async () => {
    if (!isLoaded || !signIn || resetSubmitting) return;
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

      if (signIn.status === 'complete' && signIn.createdSessionId && setActive) {
        await setActive({ session: signIn.createdSessionId });
        router.replace(hrefHome);
        return;
      }

      setError('You can now sign in with your new password.');
      resetForgot();
    } catch (e: unknown) {
      setError(
        normalizeClerkAuthError(
          e,
          'That code or password did not work. Check the email we sent you and try again.',
        ),
      );
    } finally {
      setResetSubmitting(false);
    }
  };

  if (forgotStep === 'email') {
    return (
      <PremiumAuthLayout>
        <AuthCard>
          <BrandHeader kicker="Password recovery" />
          <Text style={styles.flowTitle}>Reset password</Text>
          <Text style={styles.flowSub}>We&apos;ll email you a short verification code.</Text>
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
            errorMessage={error || undefined}
            showPasswordToggle={false}
          />
          <GradientButton
            title={resetBusy ? 'Sending…' : 'Send code'}
            onPress={() => void sendResetEmail()}
            loading={resetBusy}
            disabled={!isValidEmail(resetEmail)}
          />
          <Pressable onPress={resetForgot} style={styles.linkRow}>
            <Text style={styles.link}>← Back to sign in</Text>
          </Pressable>
        </AuthCard>
      </PremiumAuthLayout>
    );
  }

  if (forgotStep === 'code') {
    return (
      <PremiumAuthLayout>
        <AuthCard>
          <BrandHeader kicker="Check your inbox" />
          <Text style={styles.flowTitle}>Enter code</Text>
          <Text style={styles.flowSub}>Paste the code from your email, then choose a new password.</Text>
          <CustomInput
            label="Verification code"
            icon="mail"
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="number-pad"
            autoCapitalize="none"
            textContentType="oneTimeCode"
            maxLength={6}
            showPasswordToggle={false}
          />
          <CustomInput
            label="New password"
            icon="lock"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
          />
          {bannerErr ? <Text style={styles.banner}>{bannerErr}</Text> : null}
          <GradientButton
            title={resetBusy ? 'Updating…' : 'Update password'}
            onPress={() => void completePasswordReset()}
            loading={resetBusy}
            disabled={resetCode.trim().length < 6 || !newPassword}
          />
          <Pressable onPress={() => setForgotStep('email')} style={styles.linkRow}>
            <Text style={styles.link}>Use a different email</Text>
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
          errorMessage={emailErr}
          showPasswordToggle={false}
        />
        <CustomInput
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
          errorMessage={passwordErr}
        />

        <Pressable
          onPress={() => {
            setError('');
            setResetEmail(email.trim());
            setForgotStep('email');
          }}
          style={styles.forgotWrap}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </Pressable>

        {bannerErr ? <Text style={styles.banner}>{bannerErr}</Text> : null}

        <GradientButton
          title="Sign in"
          onPress={() => void submit()}
          loading={authBusy}
          disabled={!canSubmit}
        />

        <Pressable onPress={() => router.push(hrefSignUp)} style={styles.footer}>
          <Text style={styles.footerText}>
            Don&apos;t have an account? <Text style={styles.footerLink}>Sign Up</Text>
          </Text>
        </Pressable>
      </AuthCard>
    </PremiumAuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 22,
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
  flowTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PREMIUM.text,
    marginBottom: 6,
  },
  flowSub: {
    fontSize: 14,
    color: PREMIUM.subtext,
    lineHeight: 20,
    marginBottom: 8,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 10,
    paddingVertical: 4,
  },
  forgot: {
    fontSize: 14,
    fontWeight: '600',
    color: PREMIUM.borderFocus,
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
  linkRow: {
    marginTop: 18,
    alignItems: 'center',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    color: PREMIUM.borderFocus,
  },
});
