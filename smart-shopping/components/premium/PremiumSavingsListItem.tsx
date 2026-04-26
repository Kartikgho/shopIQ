import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '@/constants/theme';

type PremiumSavingsListItemProps = {
  onPress: () => void;
};

export function PremiumSavingsListItem({ onPress }: PremiumSavingsListItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={styles.pressArea}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Feather name="credit-card" size={18} color={theme.colors.primaryMid} />
          <View style={styles.textBlock}>
            <Text style={styles.title}>Premium Savings</Text>
            <Text style={styles.subtitle}>View your total savings and insights</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={18} color={theme.colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pressArea: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadow.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  textBlock: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});
