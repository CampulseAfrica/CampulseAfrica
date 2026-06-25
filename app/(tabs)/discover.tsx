import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../../theme';
import { DiscoverTab } from '../../types';
import {
  mockFeaturedNews,
  mockTrendingTopics,
  mockNewsItems,
  mockJobs,
  mockAcademicMaterials,
  mockEvents,
} from '../../mocks';

const { width } = Dimensions.get('window');

const DISCOVER_TABS: { key: DiscoverTab; label: string }[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'news', label: 'News' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'academic', label: 'Academic' },
  { key: 'events', label: 'Events' },
];

function TrendingTab() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Featured News Card */}
      <View style={styles.featuredCard}>
        <Image source={{ uri: mockFeaturedNews.image }} style={styles.featuredImage} />
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>{mockFeaturedNews.title}</Text>
          <Text style={styles.featuredDesc} numberOfLines={2}>
            {mockFeaturedNews.description}
          </Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredTime}>{mockFeaturedNews.timeAgo}</Text>
            <Text style={styles.featuredDot}>·</Text>
            <Text style={styles.featuredCategory}>{mockFeaturedNews.category}</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.bookmarkIcon}>🔖</Text>
          </View>
        </View>
      </View>

      {/* Trending Topics */}
      <Text style={styles.sectionTitle}>Trending Now</Text>
      {mockTrendingTopics.map((topic) => (
        <View key={topic.id} style={styles.trendingItem}>
          <Text style={styles.trendingRank}>{topic.rank}</Text>
          <View style={styles.trendingInfo}>
            <Text style={styles.trendingHashtag}>{topic.hashtag}</Text>
            <Text style={styles.trendingCount}>{topic.postsCount.toLocaleString()} posts</Text>
          </View>
          <Text style={styles.trendingIcon}>📈</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function NewsTab() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {mockNewsItems.map((item) => (
        <View key={item.id} style={styles.newsItem}>
          <View style={styles.newsDate}>
            <Text style={styles.newsDateText}>{item.date}</Text>
          </View>
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

function JobsTab() {
  const jobs = mockJobs.filter((j) => j.type === 'job');
  const abroad = mockJobs.filter((j) => j.type === 'abroad');

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Job Opportunities</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {jobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <ImageBackground
              source={{ uri: job.image }}
              style={styles.jobImage}
              imageStyle={styles.jobImageStyle}
            >
              <View style={styles.jobOverlay}>
                <View style={styles.jobCategory}>
                  <Text style={styles.jobCategoryText}>{job.category}</Text>
                </View>
                <View style={styles.jobBottom}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                  <Text style={styles.jobDesc} numberOfLines={2}>{job.description}</Text>
                  <Pressable style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply For Job</Text>
                  </Pressable>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, { marginTop: spacing['2xl'] }]}>Study Abroad</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {abroad.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <ImageBackground
              source={{ uri: job.image }}
              style={styles.jobImage}
              imageStyle={styles.jobImageStyle}
            >
              <View style={styles.jobOverlay}>
                <View style={styles.jobCategory}>
                  <Text style={styles.jobCategoryText}>{job.category}</Text>
                </View>
                <View style={styles.jobBottom}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                  <Text style={styles.jobDesc} numberOfLines={2}>{job.description}</Text>
                  <Pressable style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Learn More</Text>
                  </Pressable>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

function AcademicTab() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Study Materials</Text>
      {mockAcademicMaterials.map((item) => (
        <Pressable key={item.id} style={styles.academicCard}>
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.academicImage}
            imageStyle={styles.academicImageStyle}
          >
            <View style={styles.academicOverlay}>
              <View>
                <Text style={styles.academicCourseCode}>{item.courseCode}</Text>
                <Text style={styles.academicTitle}>{item.title}</Text>
              </View>
              <View style={styles.academicAuthor}>
                <Image source={{ uri: item.author.avatar }} style={styles.academicAvatar} />
                <Text style={styles.academicAuthorName}>{item.author.name}</Text>
              </View>
            </View>
          </ImageBackground>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function EventsTab() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      {mockEvents.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
            <Text style={styles.eventDate}>{event.date} · {event.time}</Text>
            <Text style={styles.eventLocation} numberOfLines={1}>{event.location}</Text>
          </View>
          <Text style={styles.eventBookmark}>🔖</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default function DiscoverScreen() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>('trending');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trending': return <TrendingTab />;
      case 'news': return <NewsTab />;
      case 'jobs': return <JobsTab />;
      case 'academic': return <AcademicTab />;
      case 'events': return <EventsTab />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      {/* Sub-tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subTabs}
      >
        {DISCOVER_TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.subTab,
              activeTab === tab.key && styles.subTabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.subTabText,
                activeTab === tab.key && styles.subTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {renderTabContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subTabs: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  subTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius['3xl'],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  subTabTextActive: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  // Featured News Card
  featuredCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  featuredContent: {
    padding: spacing.lg,
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  featuredDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featuredTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  featuredDot: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  featuredCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  bookmarkIcon: {
    fontSize: 16,
  },
  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  // Trending
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  trendingRank: {
    width: 30,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  trendingInfo: {
    flex: 1,
  },
  trendingHashtag: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  trendingCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  trendingIcon: {
    fontSize: 16,
  },
  // News
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  newsDate: {
    width: 90,
  },
  newsDateText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  newBadge: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.badgeNew,
  },
  // Jobs
  horizontalScroll: {
    marginLeft: -spacing.lg,
    paddingLeft: spacing.lg,
  },
  jobCard: {
    width: width * 0.7,
    height: 240,
    marginRight: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  jobImage: {
    width: '100%',
    height: '100%',
  },
  jobImageStyle: {
    borderRadius: borderRadius.lg,
  },
  jobOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  jobCategory: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius['3xl'],
    alignSelf: 'flex-start',
  },
  jobCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textInverse,
  },
  jobBottom: {},
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  jobDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 17,
    marginBottom: spacing.md,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius['3xl'],
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textInverse,
  },
  // Academic
  academicCard: {
    height: 200,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  academicImage: {
    width: '100%',
    height: '100%',
  },
  academicImageStyle: {
    borderRadius: borderRadius.lg,
  },
  academicOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  academicCourseCode: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryLight,
    marginBottom: spacing.xs,
  },
  academicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  academicAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  academicAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fff',
  },
  academicAuthorName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  // Events
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  eventImage: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  eventDate: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  eventBookmark: {
    fontSize: 18,
  },
});
