import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { PREMIUM } from '@/components/auth/premiumAuthTheme';

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function GradientButton({ title, onPress, loading, disabled }: GradientButtonProps) {
  const scale = useSharedValue(1);
  const inactive = Boolean(disabled || loading);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => {
        if (!inactive) onPress();
      }}
      onPressIn={() => {
        if (!inactive) scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 320 });
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
    marginTop: 6,
    borderRadius: 14,
    shadowColor: PREMIUM.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  hitDisabled: {
    shadowOpacity: 0.08,
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
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
