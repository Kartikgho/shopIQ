import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { theme } from '@/constants/theme';

type Props = {
  height?: number;
};

export function LoadingSkeleton({ height = 96 }: Props) {
  const opacity = useSharedValue(0.4);

  opacity.value = withRepeat(withTiming(0.9, { duration: 700 }), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.skeleton, { height }, animatedStyle]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.border,
    borderRadius: 16,
  },
});
