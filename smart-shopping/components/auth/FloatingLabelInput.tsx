import { useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type FloatingLabelInputProps = TextInputProps & {
  label: string;
  error?: boolean;
  /** Strong valid input — subtle green border (ignored when `error` is true). */
  success?: boolean;
};

export function FloatingLabelInput({
  label,
  value,
  onChangeText,
  error,
  success,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
  editable = true,
}: FloatingLabelInputProps) {
  const focused = useSharedValue(0);
  const hasValue = Boolean(value && String(value).length > 0);
  const lifted = useSharedValue(hasValue ? 1 : 0);

  useEffect(() => {
    lifted.value = withTiming(hasValue ? 1 : 0, { duration: 180 });
  }, [hasValue, lifted]);

  const labelStyle = useAnimatedStyle(() => {
    const t = Math.max(focused.value, lifted.value);
    return {
      transform: [
        { translateY: interpolate(t, [0, 1], [16, 0]) },
        { scale: interpolate(t, [0, 1], [1, 0.82]) },
      ],
      opacity: interpolate(t, [0, 1], [0.55, 1]),
    };
  });

  const containerBorder = error
    ? 'rgba(248, 113, 113, 0.65)'
    : success
      ? 'rgba(34, 197, 94, 0.7)'
      : 'rgba(255, 255, 255, 0.14)';
  const containerBg = error
    ? 'rgba(248, 113, 113, 0.08)'
    : success
      ? 'rgba(34, 197, 94, 0.08)'
      : 'rgba(15, 23, 42, 0.45)';

  return (
    <View style={[styles.wrap, { borderColor: containerBorder, backgroundColor: containerBg }]}>
      <Animated.Text style={[styles.label, labelStyle]} pointerEvents="none">
        {label}
      </Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        textContentType={textContentType}
        editable={editable}
        placeholderTextColor="rgba(148, 163, 184, 0.5)"
        selectionColor="#93c5fd"
        style={styles.input}
        onFocus={() => {
          focused.value = 1;
        }}
        onBlur={() => {
          focused.value = withTiming(0, { duration: 160 });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'web' ? 12 : 10,
    minHeight: 58,
    marginTop: 14,
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 0.2,
    zIndex: 1,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingTop: 8,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
});
