import { StyleSheet, Text, View } from 'react-native';

import { platformBrands } from '@/data/mockData';
import { theme } from '@/constants/theme';

export function PlatformLogos() {
  return (
    <View style={styles.grid}>
      {platformBrands.map((p) => (
        <View key={p.id} style={styles.tile}>
          <View style={styles.circle}>
            <Text style={styles.abbr}>{p.abbr}</Text>
          </View>
          <Text style={styles.label} numberOfLines={1}>
            {p.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.backgroundElevated,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.soft,
  },
  abbr: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
