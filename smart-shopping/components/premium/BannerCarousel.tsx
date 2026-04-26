import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  colors: [string, string];
};

type Props = {
  items: Banner[];
};

const CARD_WIDTH = Math.min(Dimensions.get('window').width - 48, 420);

export function BannerCarousel({ items }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [items]);

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={[items[active]]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LinearGradient colors={item.colors} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.cta}>{item.cta}</Text>
          </LinearGradient>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  cta: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 4,
  },
});
