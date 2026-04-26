import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { theme } from '@/constants/theme';

type Props = {
  onPress: () => void;
};

export function FloatingActionButton({ onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]} onPress={onPress}>
      <Feather name="plus" size={20} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 20,
    bottom: 98,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
});
