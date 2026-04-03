import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AUTH_COLORS } from '@/components/auth/authTheme';

type EcommerceAuthShellProps = {
  children: ReactNode;
  /** Stagger entrance (ms) */
  delay?: number;
};

export function EcommerceAuthShell({ children, delay = 0 }: EcommerceAuthShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: AUTH_COLORS.pageBg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : 0}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, 20),
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(420).delay(delay)} style={styles.inner}>
            {children}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  inner: {
    width: '100%',
  },
});
