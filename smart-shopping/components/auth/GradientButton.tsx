import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { PREMIUM } from '@/components/auth/premiumAuthTheme';

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  haptics?: boolean;
};

export function GradientButton({
  title,
  onPress,
  loading,
  disabled,
  haptics = true,
}: GradientButtonProps) {
  const scale = useSharedValue(1);
  const hover = useSharedValue(0);
  const inactive = Boolean(disabled || loading);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 1 - hover.value * 0.05,
  }));

  return (
    <Pressable
      onPress={() => {
        if (!inactive) {
          if (haptics) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onPress();
        }
      }}
      onPressIn={() => {
        if (!inactive) scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 320 });
      }}
      onHoverIn={() => {
        if (Platform.OS === 'web' && !inactive) {
          hover.value = withSpring(1, { damping: 18, stiffness: 220 });
        }
      }}
      onHoverOut={() => {
        if (Platform.OS === 'web') {
          hover.value = withSpring(0, { damping: 18, stiffness: 220 });
        }
      }}
      disabled={inactive}
      style={[styles.hit, inactive && styles.hitDisabled]}>
      <Animated.View style={[styles.animWrap, animStyle]}>
        <LinearGradient
          colors={inactive && !loading ? ['#9CA3AF', '#9CA3AF'] : ['#3B82F6', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}>
          <View style={styles.inner}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.label}>{title}</Text>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    marginTop: 8,
    borderRadius: 14,
    opacity: 1,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : null),
    shadowColor: PREMIUM.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  hitDisabled: {
    opacity: 0.5,
    elevation: 2,
  },
  animWrap: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 14,
  },
  inner: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
