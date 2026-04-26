import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  const progressWidth = useMemo(() => `${Math.max(progress * 100, 2)}%`, [progress]);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
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
          <Text style={styles.title}>ShopIQ Terms & Conditions</Text>
          <Text style={styles.updated}>Last Updated: April 16, 2026</Text>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>1. Introduction</Text>
            <Text style={styles.body}>
              Welcome to ShopIQ. These Terms & Conditions govern your access to and use of the ShopIQ mobile
              application, website, and related services. By creating an account or using ShopIQ, you agree to
              be bound by these terms. If you do not agree, please discontinue use of our services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>2. User Responsibilities</Text>
            <Text style={styles.body}>
              You are responsible for ensuring that the information you provide is accurate and current. You
              agree to use ShopIQ lawfully and respectfully, and you must not attempt to disrupt service
              availability, exploit platform vulnerabilities, or misuse pricing and deal data.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>3. Account Usage</Text>
            <Text style={styles.body}>
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activity carried out under your account. Please notify us immediately if you suspect unauthorized
              access. ShopIQ may suspend accounts involved in suspicious or fraudulent activity.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>4. Prohibited Activities</Text>
            <Text style={styles.body}>
              You may not reverse engineer, copy, scrape, or redistribute ShopIQ content without written
              permission. You may not use bots to manipulate alerts, abuse promotions, transmit harmful code, or
              engage in any activity that compromises platform integrity or other users&apos; experience.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>5. Limitation of Liability</Text>
            <Text style={styles.body}>
              ShopIQ provides deal, product, and savings information on an &quot;as available&quot; basis. We do not
              guarantee uninterrupted availability, pricing accuracy from third-party sources, or merchant stock
              status. To the fullest extent permitted by law, ShopIQ is not liable for indirect, incidental, or
              consequential damages resulting from use of the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>6. Termination</Text>
            <Text style={styles.body}>
              We may suspend or terminate your access if these terms are violated, if required by law, or to
              protect ShopIQ and its users. You may stop using ShopIQ at any time. Sections relating to legal
              obligations, liability, and dispute handling continue to apply after termination.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>7. Changes to Terms</Text>
            <Text style={styles.body}>
              We may revise these Terms & Conditions periodically to reflect product updates, legal requirements,
              or operational changes. Updated terms become effective when posted within the app. Continued use of
              ShopIQ after updates indicates acceptance of the revised terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>8. Contact Information</Text>
            <Text style={styles.body}>
              For questions about these terms, contact the ShopIQ Legal Team at legal@shopiq.app. You can also
              write to us at ShopIQ Technologies, Customer Trust Office, Bengaluru, India. We aim to respond
              within 7 business days.
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
