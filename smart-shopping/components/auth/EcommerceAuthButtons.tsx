import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AUTH_COLORS } from '@/components/auth/authTheme';

type EcommercePrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

/** Flipkart-style orange CTA with soft shadow */
export function EcommercePrimaryButton({
  label,
  onPress,
  loading,
  disabled,
}: EcommercePrimaryButtonProps) {
  const inactive = Boolean(disabled || loading);
  return (
    <Pressable
      onPress={() => {
        if (!inactive) onPress();
      }}
      style={({ pressed }) => [
        styles.primary,
        inactive && styles.primaryDisabled,
        pressed && !inactive && styles.primaryPressed,
      ]}>
      <View style={styles.primaryInner}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.primaryLabel}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}

type EcommerceOutlineButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

/** Blue outline secondary (e.g. Request OTP) */
export function EcommerceOutlineButton({
  label,
  onPress,
  loading,
  disabled,
}: EcommerceOutlineButtonProps) {
  const inactive = Boolean(disabled || loading);
  return (
    <Pressable
      onPress={() => {
        if (!inactive) onPress();
      }}
      style={({ pressed }) => [
        styles.outline,
        inactive && styles.outlineDisabled,
        pressed && !inactive && styles.outlinePressed,
      ]}>
      <View style={styles.outlineInner}>
        {loading ? (
          <ActivityIndicator color={AUTH_COLORS.primary} size="small" />
        ) : (
          <Text style={styles.outlineLabel}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    borderRadius: 12,
    backgroundColor: AUTH_COLORS.accent,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 4,
  },
  primaryDisabled: {
    opacity: 0.55,
    elevation: 0,
    shadowOpacity: 0.06,
  },
  primaryPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  primaryInner: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  outline: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AUTH_COLORS.primary,
    backgroundColor: AUTH_COLORS.cardBg,
    marginTop: 4,
    overflow: 'hidden',
  },
  outlineDisabled: {
    opacity: 0.5,
  },
  outlinePressed: {
    backgroundColor: 'rgba(40, 116, 240, 0.06)',
  },
  outlineInner: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  outlineLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: AUTH_COLORS.primary,
    letterSpacing: 0.2,
  },
});
