import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PREMIUM } from '@/components/auth/premiumAuthTheme';

type PremiumAuthLayoutProps = {
  children: ReactNode;
};

/**
 * Full-screen soft brand gradient + safe keyboard handling.
 * Clerk publishable key is read in root `_layout.tsx` via `process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.
 */
export function PremiumAuthLayout({ children }: PremiumAuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[PREMIUM_GRAD.bgTop, PREMIUM_GRAD.bgMid, PREMIUM.pageBg]}
        locations={[0, 0.38, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[PREMIUM_GRAD.overlayDeep, PREMIUM_GRAD.overlaySoft, 'transparent']}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : 0}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: Math.max(insets.top, 24),
              paddingBottom: Math.max(insets.bottom, 28),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const PREMIUM_GRAD = {
  bgTop: '#F9FAFB',
  bgMid: '#F3F4F6',
  overlayDeep: 'rgba(17, 24, 39, 0.02)',
  overlaySoft: 'rgba(59, 130, 246, 0.05)',
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PREMIUM.pageBg,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
});
