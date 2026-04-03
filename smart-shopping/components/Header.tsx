import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME } from '@/constants/env';
import { theme } from '@/constants/theme';

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  right?: React.ReactNode;
};

export function Header({ title, showBack = false, right }: HeaderProps) {
  const label = title?.trim() || APP_NAME;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.primaryMid]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {showBack ? (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}>
              <Feather name="chevron-left" size={22} color="#fff" />
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {label}
        </Text>
        <View style={styles.side}>{right}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    minHeight: 44,
  },
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  iconBtnPressed: {
    opacity: 0.85,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0,
    includeFontPadding: false,
    ...Platform.select({
      web: {
        WebkitFontSmoothing: 'antialiased' as const,
        MozOsxFontSmoothing: 'grayscale' as const,
      },
    }),
  },
});
