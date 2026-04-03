import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AUTH_COLORS } from '@/components/auth/authTheme';

const AnimatedView = Animated.createAnimatedComponent(View);

export type AuthInputProps = TextInputProps & {
  label: string;
  /** Shown below the field in error red */
  errorMessage?: string;
  /** When true, shows password visibility toggle (requires secureTextEntry) */
  showPasswordToggle?: boolean;
};

export function AuthInput({
  label,
  value,
  onChangeText,
  errorMessage,
  secureTextEntry,
  showPasswordToggle = true,
  editable = true,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  style: inputStyle,
  ...rest
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const focusProgress = useSharedValue(0);

  const onFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    (e) => {
      setFocused(true);
      focusProgress.value = withTiming(1, { duration: 160 });
      onFocusProp?.(e);
    },
    [focusProgress, onFocusProp],
  );

  const onBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
    (e) => {
      setFocused(false);
      focusProgress.value = withTiming(0, { duration: 160 });
      onBlurProp?.(e);
    },
    [focusProgress, onBlurProp],
  );

  const showSecure = Boolean(secureTextEntry && showPasswordToggle);
  const effectiveSecure = secureTextEntry && showSecure && hidden;

  const borderStyle = useAnimatedStyle(() => {
    if (errorMessage) {
      return { borderColor: AUTH_COLORS.error };
    }
    return {
      borderColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        [AUTH_COLORS.border, AUTH_COLORS.borderFocus],
      ),
    };
  }, [errorMessage]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <AnimatedView
        style={[
          styles.fieldRow,
          borderStyle,
          Platform.OS === 'ios' && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: focused ? 0.1 : 0.05,
            shadowRadius: focused ? 4 : 2,
          },
          Platform.OS === 'android' && { elevation: focused ? 2 : 1 },
        ]}>
        <TextInput
          {...rest}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={effectiveSecure}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholderTextColor={AUTH_COLORS.textSecondary}
          selectionColor={AUTH_COLORS.primary}
          style={[styles.input, inputStyle]}
        />
        {showSecure ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            style={styles.eyeBtn}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={AUTH_COLORS.textSecondary}
            />
          </Pressable>
        ) : null}
      </AnimatedView>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: AUTH_COLORS.textSecondary,
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: AUTH_COLORS.cardBg,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: AUTH_COLORS.text,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 4,
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: AUTH_COLORS.error,
    lineHeight: 18,
  },
});
