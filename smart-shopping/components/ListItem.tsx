import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type ListItemProps = {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  trailing?: string;
  endAccessory?: React.ReactNode;
  danger?: boolean;
  onPress?: () => void;
};

export function ListItem({
  icon,
  label,
  trailing,
  endAccessory,
  danger = false,
  onPress,
}: ListItemProps) {
  const right =
    endAccessory ??
    (trailing ? <Text style={styles.badge}>{trailing}</Text> : <Feather name="chevron-right" size={18} color={theme.colors.textMuted} />);

  const content = (
    <View style={styles.row}>
      <View style={styles.left}>
        <Feather name={icon} size={18} color={danger ? theme.colors.danger : theme.colors.primaryMid} />
        <Text style={[styles.label, danger && styles.danger]}>{label}</Text>
      </View>
      {right}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  danger: {
    color: theme.colors.danger,
  },
  badge: {
    backgroundColor: theme.colors.danger,
    color: '#FFFFFF',
    fontWeight: '700',
    borderRadius: theme.radius.full,
    minWidth: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
});
