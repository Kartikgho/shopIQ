import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  const progressWidth = useMemo(() => `${Math.max(progress * 100, 2)}%`, [progress]);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const maxScroll = Math.max(contentSize.height - layoutMeasurement.height, 1);
          setProgress(Math.min(Math.max(contentOffset.y / maxScroll, 0), 1));
        }}>
        <View style={styles.contentShell}>
          <Text style={styles.title}>ShopIQ Privacy Policy</Text>
          <Text style={styles.updated}>Last Updated: April 16, 2026</Text>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>1. Information We Collect</Text>
            <Text style={styles.body}>
              We collect account details such as name, email, and authentication metadata, along with shopping
              preferences, saved products, wishlists, and notification choices. We also collect technical data
              like device type, app version, and usage signals to keep ShopIQ reliable and secure.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>2. How We Use Data</Text>
            <Text style={styles.body}>
              Your data helps us personalize deals, improve recommendations, deliver price-drop alerts, maintain
              account security, and optimize app performance. We may use aggregated and anonymized insights to
              improve product quality, user experience, and marketplace relevance.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>3. Data Sharing</Text>
            <Text style={styles.body}>
              ShopIQ does not sell personal data. We share limited information only with trusted service
              providers who support hosting, analytics, authentication, and notifications under strict
              confidentiality obligations. We may disclose data when required by law or to protect legal rights.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>4. Cookies / Tracking</Text>
            <Text style={styles.body}>
              On web platforms, we use cookies and similar technologies to remember preferences, analyze traffic,
              and improve feature performance. In-app, we may use identifiers for session continuity and product
              analytics. You can manage cookie settings through your browser where supported.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>5. Data Security</Text>
            <Text style={styles.body}>
              We apply technical and organizational safeguards, including encrypted transport, controlled access,
              and monitoring practices designed to protect personal information. While no system is completely
              risk-free, we continuously improve controls to reduce security threats.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>6. User Rights</Text>
            <Text style={styles.body}>
              Subject to applicable law, you may request access, correction, deletion, or export of your personal
              data. You may also opt out of non-essential communications at any time. To exercise these rights,
              contact our privacy team using the details below.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>7. Updates to Policy</Text>
            <Text style={styles.body}>
              We may update this Privacy Policy to reflect legal, technical, or business changes. Material
              updates will be communicated through in-app notices or other appropriate channels. Continuing to use
              ShopIQ after updates means you acknowledge the revised policy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>8. Contact Info</Text>
            <Text style={styles.body}>
              If you have questions or privacy requests, email privacy@shopiq.app. You may also contact ShopIQ
              Data Protection Office, Bengaluru, India. We review and respond to verified requests within
              reasonable timelines defined by applicable law.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 58,
    borderBottomWidth: 1,
    borderBottomColor: '#E9EDF3',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#F4F7FB',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#EEF2F7',
  },
  progressFill: {
    height: 3,
    backgroundColor: '#2563EB',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 34,
  },
  contentShell: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '800',
    color: '#111827',
  },
  updated: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 14,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5EAF0',
    gap: 8,
  },
  sectionHeading: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    color: '#111827',
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: '#374151',
  },
});
