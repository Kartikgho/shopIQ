import { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

import { PREMIUM } from '@/components/auth/premiumAuthTheme';

type AuthCardProps = {
  children: ReactNode;
};

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Animated.View entering={FadeIn.duration(240)} style={styles.enterWrap}>
      <Animated.View entering={SlideInUp.duration(260).springify().damping(18).stiffness(210)} style={styles.zoomWrap}>
        <View style={styles.card}>{children}</View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  enterWrap: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  zoomWrap: {
    width: '100%',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: PREMIUM.card,
    ...Platform.select({
      ios: {
        shadowColor: PREMIUM.shadow,
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 1,
        shadowRadius: 28,
      },
      android: {
        elevation: 6,
      },
      default: {
        shadowColor: PREMIUM.shadow,
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 1,
        shadowRadius: 28,
      },
    }),
  },
});
