import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';

import { Header } from '@/components/Header';
import { ListItem } from '@/components/ListItem';
import { StatsCard } from '@/components/StatsCard';
import { CustomButton } from '@/components/CustomButton';
import { usePushAlerts } from '@/context/PushAlertsContext';
import { theme } from '@/constants/theme';
import { hrefSaved, hrefSavings, hrefSignIn, hrefSignUp } from '@/utils/hrefs';
import { SectionHeader } from '@/components/premium/SectionHeader';
import { PremiumSavingsListItem } from '@/components/premium/PremiumSavingsListItem';

const settings = [
  { id: 'terms', icon: 'file-text' as const, label: 'Terms & Conditions', href: '/legal/terms' as const },
  { id: 'privacy', icon: 'shield' as const, label: 'Privacy Policy', href: '/legal/privacy' as const },
];

export function ProfileScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const { enabled: pushAlertsOn, hydrated, setPushAlertsEnabled } = usePushAlerts();
  const displayName = user?.fullName || user?.firstName || 'Shopper';
  const email = user?.primaryEmailAddress?.emailAddress ?? '';

  return (
    <View style={styles.page}>
      <FlatList
        data={settings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.pageTitle}>Profile</Text>
            {isLoaded && user ? (
      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{displayName}</Text>
                  <Text style={styles.email}>{email}</Text>
                </View>
              </View>
            ) : (
              <GuestCard />
            )}
            <View style={styles.statsRow}>
              <StatsCard title="Orders" value="28" icon="📦" />
              <StatsCard title="Savings" value="Rs 16.4k" icon="💰" />
            </View>
            {!user ? (
              <View style={styles.authRow}>
                <CustomButton label="Sign in" onPress={() => router.push(hrefSignIn)} />
                <CustomButton
                  label="Create account"
                  variant="outline"
                  onPress={() => router.push(hrefSignUp)}
                />
              </View>
            ) : null}
            <SectionHeader title="Settings" subtitle="Account and app preferences" />
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.listWrap}>
            <ListItem icon={item.icon} label={item.label} onPress={() => router.push(item.href)} />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footerCol}>
            <PremiumSavingsListItem onPress={() => router.push(hrefSavings)} />
            <View style={styles.listWrap}>
              <ListItem icon="heart" label="Wishlist" onPress={() => router.push(hrefSaved)} />
            </View>
            {user ? (
              <View style={styles.listWrap}>
                <ListItem icon="power" label="Log out" danger onPress={() => void signOut()} />
              </View>
            ) : null}
            <View style={styles.listWrap}>
              <ListItem
                icon="bell"
                label="Push alerts"
                endAccessory={
                  <Switch
                    value={pushAlertsOn}
                    onValueChange={(v) => void setPushAlertsEnabled(v)}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primaryMid }}
                    thumbColor="#fff"
                    disabled={!hydrated}
                  />
                }
              />
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateText}>Enjoying ShopIQ?</Text>
              <Text style={styles.stars}>★★★★★</Text>
            </View>
            <Text style={styles.notice}>
              Push notifications register after sign-in (Expo token in dev console). Wire your FCM / APNs backend to deliver deal and price alerts.
            </Text>
          </View>
        }
      />
    </View>
  );
}

function GuestCard() {
  return (
    <View style={styles.userCard}>
      <View style={[styles.avatarCircle, styles.avatarMuted]}>
        <Text style={styles.avatarLetterMuted}>?</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>Guest shopper</Text>
        <Text style={styles.email}>Sign in to sync email, alerts, and saved items.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    width: '100%',
    maxWidth: theme.layout.contentMaxWidth,
    alignSelf: 'center',
    padding: 16,
    gap: 12,
    paddingBottom: 110,
  },
  pageTitle: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    ...theme.shadow.soft,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMuted: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarLetter: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  avatarLetterMuted: {
    color: theme.colors.subtext,
    fontSize: 22,
    fontWeight: '800',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  email: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  authRow: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  listWrap: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  footerCol: {
    marginTop: 16,
    gap: 12,
  },
  rateRow: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rateText: {
    fontWeight: '700',
    color: theme.colors.text,
    fontSize: 16,
  },
  stars: {
    color: theme.colors.rating,
    fontSize: 18,
  },
  notice: {
    ...theme.typography.micro,
    color: theme.colors.subtext,
    lineHeight: 18,
    marginTop: 4,
  },
});
