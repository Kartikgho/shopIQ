import { Feather } from '@expo/vector-icons';
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

import { PREMIUM } from '@/components/auth/premiumAuthTheme';

const AnimatedView = Animated.createAnimatedComponent(View);

export type InputIconName = 'mail' | 'lock' | 'user';

export type CustomInputProps = TextInputProps & {
  label: string;
  icon: InputIconName;
  errorMessage?: string;
  showPasswordToggle?: boolean;
};

const ICON_MAP = {
  mail: 'mail' as const,
  lock: 'lock' as const,
  user: 'user' as const,
};

export function CustomInput({
  label,
  icon,
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
}: CustomInputProps) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  const onFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    (e) => {
      setFocused(true);
      focusProgress.value = withTiming(1, { duration: 200 });
      onFocusProp?.(e);
    },
    [focusProgress, onFocusProp],
  );

  const onBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
    (e) => {
      setFocused(false);
      focusProgress.value = withTiming(0, { duration: 200 });
      onBlurProp?.(e);
    },
    [focusProgress, onBlurProp],
  );

  const showToggle = Boolean(secureTextEntry && showPasswordToggle);
  const effectiveSecure = secureTextEntry && showToggle && hidden;

  const shellStyle = useAnimatedStyle(() => {
    const border = errorMessage
      ? PREMIUM.error
      : interpolateColor(
        focusProgress.value,
        [0, 1],
        [PREMIUM.border, PREMIUM.borderFocus],
      );
    return {
      borderColor: border,
      shadowOpacity: errorMessage ? 0.06 : 0.08 + focusProgress.value * 0.14,
      shadowRadius: 6 + focusProgress.value * 10,
    };
  }, [errorMessage]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <AnimatedView
        style={[
          styles.fieldShell,
          shellStyle,
          Platform.OS === 'android' && { elevation: focused ? 4 : 2 },
        ]}>
        <View style={styles.iconWrap}>
          <Feather name={ICON_MAP[icon]} size={18} color={PREMIUM.subtext} />
        </View>
        <TextInput
          {...rest}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={effectiveSecure}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholderTextColor={PREMIUM.subtext}
          selectionColor={PREMIUM.borderFocus}
          style={[styles.input, inputStyle]}
        />
        {showToggle ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            style={styles.eye}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Feather name={hidden ? 'eye-off' : 'eye'} size={20} color={PREMIUM.subtext} />
          </Pressable>
        ) : (
          <View style={styles.eyeSpacer} />
        )}
      </AnimatedView>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: PREMIUM.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  fieldShell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: 15,
    borderWidth: 1.5,
    backgroundColor: PREMIUM.inputBg,
    paddingHorizontal: 4,
    shadowColor: PREMIUM.borderFocus,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  iconWrap: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: PREMIUM.text,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingRight: 8,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
  eye: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  eyeSpacer: {
    width: 12,
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: PREMIUM.error,
    lineHeight: 18,
  },
});
