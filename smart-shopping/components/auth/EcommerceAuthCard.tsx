import { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AUTH_COLORS } from '@/components/auth/authTheme';

type EcommerceAuthCardProps = {
  children: ReactNode;
};

/** Centered white card with soft elevation */
export function EcommerceAuthCard({ children }: EcommerceAuthCardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: AUTH_COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
    }),
  },
});
