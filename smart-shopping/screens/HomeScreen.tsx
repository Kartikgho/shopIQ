import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CustomButton } from '@/components/CustomButton';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { PlatformLogos } from '@/components/PlatformLogos';
import { getFeaturedProducts } from '@/data/mockData';
import { theme } from '@/constants/theme';

export function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const featured = getFeaturedProducts();

  const submitSearch = () => {
    const q = query.trim();
    if (q) router.push({ pathname: '/search', params: { q } });
    else router.push('/search');
  };

  return (
    <View style={styles.page}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <SearchBar
          placeholder="Search phones, audio, appliances..."
          value={query}
          onChangeText={setQuery}
          onSubmit={submitSearch}
          onClear={() => setQuery('')}
        />

        <Animated.View entering={FadeInDown.duration(380)} style={styles.hero}>
          <Text style={styles.tagline}>Never overpay again</Text>
          <Text style={styles.heroTitle}>Compare prices. Stack coupons. Save with confidence.</Text>
          <Text style={styles.heroSub}>
            Real-time style compare across top stores — curated deals without the noise.
          </Text>
          <CustomButton label="Start searching" onPress={() => router.push('/search')} />
        </Animated.View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Featured deals</Text>
          <Pressable onPress={() => router.push('/deals')}>
            <Text style={styles.link}>See all</Text>
          </Pressable>
        </View>
        <FeaturedCarousel products={featured} />

        <Text style={[styles.sectionTitle, styles.trustedTitle]}>Trusted platforms</Text>
        <Text style={styles.trustedSub}>Prices checked across partners you already use</Text>
        <PlatformLogos />
      </ScrollView>
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
    maxWidth: 520,
    alignSelf: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    paddingBottom: 120,
  },
  hero: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    gap: theme.spacing.sm,
    ...theme.shadow.card,
  },
  tagline: {
    ...theme.typography.micro,
    color: theme.colors.primaryMid,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    fontSize: 22,
    lineHeight: 28,
  },
  heroSub: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
  },
  link: {
    ...theme.typography.caption,
    color: theme.colors.primaryMid,
    fontWeight: '700',
  },
  trustedTitle: {
    marginTop: theme.spacing.xl,
  },
  trustedSub: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: -8,
  },
});
