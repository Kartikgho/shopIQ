import { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

type GlassAuthCardProps = {
  children: ReactNode;
};

export function GlassAuthCard({ children }: GlassAuthCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 24 },
        shadowOpacity: 0.35,
        shadowRadius: 40,
      },
      android: { elevation: 12 },
      web: {
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
      },
    }),
  },
  inner: {
    paddingHorizontal: 26,
    paddingVertical: 32,
    gap: 4,
  },
});
