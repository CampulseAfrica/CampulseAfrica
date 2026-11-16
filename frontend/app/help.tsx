import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors as defaultColors, spacing, borderRadius, useTheme } from '../theme';
import { ChevronLeft, Search, ChevronDown, ChevronUp } from 'lucide-react-native';

const FAQS = [
  {
    question: 'What is Campulse?',
    answer: 'Campulse is a social platform designed for students to share information, ask questions, and stay connected with their campus community.',
  },
  {
    question: 'Is Campulse only for students?',
    answer: 'Yes, Campulse is built exclusively for students to maintain a focused and safe campus environment.',
  },
  {
    question: 'How do I create an account?',
    answer: 'You can create an account by downloading the app and signing up with your valid university email address.',
  },
  {
    question: 'Is Campulse free to use?',
    answer: 'Yes, Campulse is completely free to use for all registered students.',
  },
  {
    question: 'What does the "Verify" feature do?',
    answer: 'The verify feature allows trusted users to confirm the accuracy of information posted by others, helping to fight misinformation on campus.',
  },
  {
    question: 'Can anyone verify a post?',
    answer: 'Only users who have achieved a specific reputation level can cast verification votes on posts.',
  },
  {
    question: 'What happens when a post receives many "False" votes?',
    answer: 'Posts with a high number of false votes are flagged as misleading and may be hidden or removed to protect the community.',
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>How can we help you?</Text>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          <Search color={colors.textSecondary} size={20} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Find question"
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FAQ List */}
        <View style={styles.faqList}>
          {filteredFaqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <View key={index} style={[styles.faqItemWrapper, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
                <Pressable
                  style={[styles.faqItem, isExpanded && [styles.faqItemExpanded, { borderBottomColor: colors.border }]]}
                  onPress={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>{faq.question}</Text>
                  {isExpanded ? (
                    <ChevronUp color={colors.textSecondary} size={20} />
                  ) : (
                    <ChevronDown color={colors.textSecondary} size={20} />
                  )}
                </Pressable>
                {isExpanded && (
                  <View style={[styles.faqAnswerContainer, { backgroundColor: colors.surfaceElevated }]}>
                    <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: defaultColors.textPrimary,
  },
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: defaultColors.textPrimary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 15,
    color: defaultColors.textPrimary,
  },
  faqList: {
    marginHorizontal: spacing.lg,
    gap: spacing.md,
  },
  faqItemWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  faqItemExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  faqQuestion: {
    fontSize: 15,
    color: defaultColors.textPrimary,
    flex: 1,
    paddingRight: spacing.sm,
  },
  faqAnswerContainer: {
    padding: spacing.md,
    backgroundColor: '#FAFAFA',
  },
  faqAnswer: {
    fontSize: 14,
    color: defaultColors.textSecondary,
    lineHeight: 20,
  },
});
