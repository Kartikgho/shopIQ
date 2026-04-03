import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PremiumAuthShellProps = {
  children: ReactNode;
  /** Delay ms for staggered entrance */
  delay?: number;
};

export function PremiumAuthShell({ children, delay = 0 }: PremiumAuthShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#0B1220', '#152238', '#1e3a5f', '#243B53']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, 24),
              paddingBottom: Math.max(insets.bottom, 28),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(500)} style={styles.decorWrap}>
            <View style={styles.decorOrb} />
            <View style={styles.decorOrbSmall} />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(520).delay(delay)} style={styles.cardOuter}>
            {children}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  decorWrap: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  decorOrb: {
    position: 'absolute',
    top: '8%',
    right: '-12%',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  decorOrbSmall: {
    position: 'absolute',
    bottom: '18%',
    left: '-8%',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(59, 130, 246, 0.14)',
  },
  cardOuter: {
    width: '100%',
  },
});
