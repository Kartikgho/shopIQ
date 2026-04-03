import { Pressable, StyleSheet, Text } from 'react-native';
import { useState } from 'react';

import { theme } from '@/constants/theme';

type CustomButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'success' | 'outline' | 'ghost';
};

export function CustomButton({ label, onPress, variant = 'primary' }: CustomButtonProps) {
  const [hovered, setHovered] = useState(false);

  const palette =
    variant === 'success'
      ? { bg: theme.colors.success, border: theme.colors.success, text: '#fff' }
      : variant === 'outline'
        ? { bg: 'transparent', border: theme.colors.primary, text: theme.colors.primary }
        : variant === 'ghost'
          ? { bg: theme.colors.surfaceMuted, border: theme.colors.border, text: theme.colors.textPrimary }
          : { bg: theme.colors.accent, border: theme.colors.accent, text: theme.colors.textPrimary };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        hovered && variant !== 'outline' && styles.hovered,
      ]}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1.5,
  },
  hovered: {
    ...theme.shadow.soft,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
  },
});
