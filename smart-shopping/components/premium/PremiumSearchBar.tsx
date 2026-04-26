import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { theme } from '@/constants/theme';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  onSubmit?: () => void;
};

export function PremiumSearchBar({ value, onChangeText, placeholder, onSubmit }: Props) {
  const scale = useSharedValue(1);
  const shadow = useSharedValue(0);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: withTiming(shadow.value, { duration: 200 }),
  }));

  return (
    <Animated.View style={[styles.wrap, animated]}>
      <Feather name="search" size={18} color={theme.colors.subtext} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.subtext}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={() => {
          scale.value = withTiming(1.01, { duration: 180 });
          shadow.value = 0.1;
        }}
        onBlur={() => {
          scale.value = withTiming(1, { duration: 180 });
          shadow.value = 0;
        }}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')}>
          <Feather name="x-circle" size={18} color={theme.colors.subtext} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 52,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...theme.shadow.soft,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
});
