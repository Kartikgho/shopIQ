import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/constants/theme';

type Chip = { id: string; label: string };

type Props = {
  items: Chip[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function FilterChips({ items, selectedId, onSelect }: Props) {
  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const selected = item.id === selectedId;
        return (
          <Pressable
            onPress={() => onSelect(item.id)}
            style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && { opacity: 0.85 }]}>
            <Text style={[styles.text, selected && styles.selectedText]}>{item.label}</Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  text: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
  },
});
