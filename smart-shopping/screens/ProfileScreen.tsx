import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';

import { Header } from '@/components/Header';
import { ListItem } from '@/components/ListItem';
import { StatsCard } from '@/components/StatsCard';
import { CustomButton } from '@/components/CustomButton';
import { usePushAlerts } from '@/context/PushAlertsContext';
import { theme } from '@/constants/theme';
import { hrefPremiumSavings, hrefSaved, hrefSignIn, hrefSignUp } from '@/utils/hrefs';

const settings = [
  { id: 'terms', icon: 'file-text' as const, label: 'Terms & Conditions' },
  { id: 'privacy', icon: 'shield' as const, label: 'Privacy Policy' },
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
      <Header title="Profile" />
      <FlatList
        data={settings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
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
              <StatsCard title="Tracked deals" value="Live" icon="🔔" />
              <StatsCard title="Savings tips" value="Pro" icon="✨" />
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
            <Text style={styles.section}>Preferences</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.listWrap}>
            <ListItem icon={item.icon} label={item.label} />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footerCol}>
            <View style={styles.listWrap}>
              <ListItem icon="heart" label="Wishlist" onPress={() => router.push(hrefSaved)} />
            </View>
            <View style={styles.listWrap}>
              <ListItem
                icon="trending-up"
                label="Premium savings"
                onPress={() => router.push(hrefPremiumSavings)}
              />
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
              <Text style={styles.rateText}>Enjoying the app?</Text>
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
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 520,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    paddingBottom: 120,
  },
  userCard: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing.lg,
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
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarLetter: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  avatarLetterMuted: {
    color: theme.colors.textMuted,
    fontSize: 22,
    fontWeight: '800',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  email: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: theme.spacing.md,
  },
  authRow: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  section: {
    marginTop: theme.spacing.lg,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  listWrap: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    overflow: 'hidden',
  },
  footerCol: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  rateRow: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  rateText: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  stars: {
    color: theme.colors.rating,
    fontSize: 18,
  },
  notice: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
    lineHeight: 18,
    marginTop: 4,
  },
});
