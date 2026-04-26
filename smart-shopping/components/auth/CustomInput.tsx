import { Feather } from '@expo/vector-icons';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
  View,
} from 'react-native';
import Animated, {
  interpolate,
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
  icon?: InputIconName;
  errorMessage?: string;
  showPasswordToggle?: boolean;
  success?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

const ICON_MAP = {
  mail: 'mail' as const,
  lock: 'lock' as const,
  user: 'user' as const,
};

export const CustomInput = forwardRef<TextInput, CustomInputProps>(function CustomInput(
  {
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
    success = false,
    containerStyle,
    ...rest
  },
  ref,
) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  const focusProgress = useSharedValue(0);
  const hasValue = useMemo(() => String(value ?? '').length > 0, [value]);

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
  const activeIcon = icon ? ICON_MAP[icon] : null;

  const shellStyle = useAnimatedStyle(() => {
    const ringColor = errorMessage
      ? PREMIUM.error
      : success
        ? PREMIUM.success
        : interpolateColor(focusProgress.value, [0, 1], ['transparent', PREMIUM.borderFocus]);
    return {
      transform: [{ scale: 1 + focusProgress.value * 0.004 }],
      shadowColor: PREMIUM.glow,
      shadowOpacity: focused ? 0.16 : 0.02,
      shadowRadius: 8 + focusProgress.value * 10,
      borderColor: ringColor,
      borderWidth: focused || Boolean(errorMessage) || success ? 1.5 : 1,
    };
  }, [errorMessage, focused, success]);

  const floatLabelStyle = useAnimatedStyle(() => {
    const lifted = hasValue ? 1 : 0;
    const t = Math.max(focusProgress.value, lifted);
    return {
      transform: [
        { translateY: interpolate(t, [0, 1], [0, -14]) },
        { scale: interpolate(t, [0, 1], [1, 0.9]) },
      ],
      color: errorMessage
        ? PREMIUM.error
        : interpolateColor(t, [0, 1], [PREMIUM.subtext, PREMIUM.text]),
    };
  }, [errorMessage, hasValue]);

  return (
    <View style={[styles.wrap, containerStyle]}>
      <AnimatedView
        style={[
          styles.fieldShell,
          shellStyle,
          Platform.OS === 'android' && styles.fieldShellAndroid,
        ]}>
        <Animated.Text style={[styles.floatLabel, floatLabelStyle]}>{label}</Animated.Text>
        {activeIcon ? (
          <View style={styles.iconWrap}>
            <Feather name={activeIcon} size={16} color={PREMIUM.subtext} />
          </View>
        ) : null}
        <TextInput
          {...rest}
          ref={ref}
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
          <View style={activeIcon ? styles.eyeSpacer : styles.eyeSpacerCompact} />
        )}
      </AnimatedView>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  fieldShell: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: PREMIUM.field,
    paddingHorizontal: 14,
    shadowColor: PREMIUM.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  fieldShellAndroid: {
    elevation: 0,
  },
  floatLabel: {
    position: 'absolute',
    left: 44,
    top: 15,
    fontSize: 14,
    fontWeight: '500',
    zIndex: 2,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: PREMIUM.text,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingTop: 20,
    paddingRight: 8,
    marginLeft: 8,
    ...(Platform.OS === 'web'
      ? {
          outlineWidth: 0,
          outlineColor: 'transparent',
        }
      : null),
  },
  eye: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  eyeSpacer: {
    width: 12,
  },
  eyeSpacerCompact: {
    width: 4,
  },
  error: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: PREMIUM.error,
    lineHeight: 18,
  },
});
