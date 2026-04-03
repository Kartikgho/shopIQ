import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type StatsCardProps = {
  title: string;
  value: string;
  icon?: string;
};

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.value}>{value}</Text>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    ...theme.shadow.soft,
  },
  title: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  row: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  icon: {
    fontSize: 22,
  },
});
