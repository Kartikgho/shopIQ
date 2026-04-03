import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { theme } from '@/constants/theme';

type ShareIconButtonProps = {
  onPress: () => void;
};

export function ShareIconButton({ onPress }: ShareIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Share">
      <Feather name="share-2" size={20} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
