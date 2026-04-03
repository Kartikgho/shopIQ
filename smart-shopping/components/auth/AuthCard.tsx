import { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { PREMIUM } from '@/components/auth/premiumAuthTheme';

type AuthCardProps = {
  children: ReactNode;
};

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Animated.View entering={FadeIn.duration(480)} style={styles.enterWrap}>
      <Animated.View
        entering={ZoomIn.duration(420).springify().damping(17).stiffness(180)}
        style={styles.zoomWrap}>
        <View style={styles.card}>{children}</View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  enterWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  zoomWrap: {
    width: '100%',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    backgroundColor: PREMIUM.glassBg,
    borderWidth: 1,
    borderColor: PREMIUM.glassBorder,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.12,
        shadowRadius: 40,
      },
      android: {
        elevation: 12,
      },
      default: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 32,
      },
    }),
  },
});
