import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { theme } from '@/constants/theme';

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  autoFocus?: boolean;
};

export function SearchBar({
  placeholder = 'Search for products...',
  value,
  onChangeText,
  onSubmit,
  onClear,
  autoFocus,
}: SearchBarProps) {
  const showClear = Boolean(value?.length);

  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color={theme.colors.primaryMid} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {showClear ? (
        <Pressable onPress={onClear} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Feather name="x" size={18} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundElevated,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    gap: 10,
    ...theme.shadow.soft,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    paddingVertical: 12,
  },
});
