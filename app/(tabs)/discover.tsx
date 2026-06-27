import React, { useState, useEffect } from 'react';
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
import { DiscoverTab, TrendingTopic, NewsItem, Job, AcademicMaterial, CampusEvent, FeaturedNews } from '../../types';
import { discoverService } from '../../services';
import { Skeleton } from '../../components/ui/Skeleton';
import { CampulseLogo } from '../../components/ui/Logo';
import { SearchIcon, TrendIcon } from '../../components/ui/Icons';
import { Bookmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const DISCOVER_TABS: { key: DiscoverTab; label: string }[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'news', label: 'News' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'academic', label: 'Academic' },
  { key: 'events', label: 'Events' },
];

function TrendingTab() {
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<FeaturedNews | null>(null);
  const [trending, setTrending] = useState<TrendingTopic[]>([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([discoverService.getFeaturedNews(), discoverService.getTrending()]).then(([f, t]) => {
      if (isMounted) {
        setFeatured(f);
        setTrending(t);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading || !featured) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Featured News</Text>
        <Skeleton height={280} borderRadius={borderRadius.lg} style={{ marginBottom: spacing.xl }} />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Update</Text>
        </View>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}>
            <Skeleton width={20} height={20} style={{ marginRight: spacing.md }} />
            <View style={{ flex: 1, gap: 6 }}>
              <Skeleton width="60%" height={16} />
              <Skeleton width="40%" height={12} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Featured News Card */}
      <Text style={styles.sectionTitle}>Featured News</Text>
      <View style={styles.featuredCard}>
        <Image source={{ uri: featured.image }} style={styles.featuredImage} />
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>{featured.title}</Text>
          <Text style={styles.featuredDesc} numberOfLines={3}>
            {featured.description}
          </Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredTime}>{featured.timeAgo}. {featured.category}</Text>
            <View style={{ flex: 1 }} />
            <Bookmark size={16} color={colors.textPrimary} />
          </View>
        </View>
      </View>

      {/* Trending Topics */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lastest Update</Text>
        <Text style={styles.seeMore}>See more</Text>
      </View>
      
      <View style={styles.trendingList}>
        {trending.map((topic) => (
          <View key={topic.id} style={styles.trendingItem}>
            <Text style={styles.trendingRank}>{topic.rank}</Text>
            <View style={styles.trendingInfo}>
              <Text style={styles.trendingHashtag}>{topic.hashtag}</Text>
              <Text style={styles.trendingCount}>{topic.postsCount.toLocaleString()} posts</Text>
            </View>
            {topic.isHot && (
              <TrendIcon />
            )}
          </View>
        ))}
      </View>
      
      {/* Bottom padding for tab bar */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function NewsTab() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    discoverService.getNews().then((data) => {
      if (isMounted) { setNews(data); setLoading(false); }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.tabContent}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md }}>
            <Skeleton width={80} height={16} />
            <View style={{ flex: 1, gap: 6 }}>
              <Skeleton width="100%" height={16} />
              <Skeleton width="80%" height={16} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {news.map((item) => (
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
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function JobsTab() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [abroad, setAbroad] = useState<Job[]>([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([discoverService.getJobs(), discoverService.getAbroadOpportunities()]).then(([j, a]) => {
      if (isMounted) { setJobs(j); setAbroad(a); setLoading(false); }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Job Opportunities</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} width={width * 0.7} height={240} borderRadius={borderRadius.lg} style={{ marginRight: spacing.lg }} />
          ))}
        </ScrollView>
        <Text style={[styles.sectionTitle, { marginTop: spacing['2xl'] }]}>Study Abroad</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} width={width * 0.7} height={240} borderRadius={borderRadius.lg} style={{ marginRight: spacing.lg }} />
          ))}
        </ScrollView>
      </View>
    );
  }

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
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function AcademicTab() {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<AcademicMaterial[]>([]);

  useEffect(() => {
    let isMounted = true;
    discoverService.getAcademicMaterials().then((data) => {
      if (isMounted) { setMaterials(data); setLoading(false); }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Study Materials</Text>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={200} borderRadius={borderRadius.lg} style={{ marginBottom: spacing.lg }} />
        ))}
      </View>
    );
  }

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Study Materials</Text>
      {materials.map((item) => (
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
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function EventsTab() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CampusEvent[]>([]);

  useEffect(() => {
    let isMounted = true;
    discoverService.getEvents().then((data) => {
      if (isMounted) { setEvents(data); setLoading(false); }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={100} borderRadius={borderRadius.lg} style={{ marginBottom: spacing.md }} />
        ))}
      </View>
    );
  }

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      {events.map((event) => (
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
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

export default function DiscoverScreen() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>('trending');
  const router = useRouter();

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
        <CampulseLogo width={131} height={26} />
        <Pressable onPress={() => router.push('/search')}>
          <SearchIcon />
        </Pressable>
      </View>

      {/* Sub-tabs */}
      <View style={styles.subTabsContainer}>
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
        <View style={styles.subTabsBorder} />
      </View>

      {renderTabContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Slight off-white to match design
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  subTabsContainer: {
    marginBottom: spacing.md,
  },
  subTabs: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
  },
  subTab: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    marginRight: spacing.lg,
  },
  subTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  subTabsBorder: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
    marginTop: -1,
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A0A0A0',
  },
  subTabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  seeMore: {
    fontSize: 13,
    color: '#B4AEFF',
    fontWeight: '500',
  },
  // Featured News Card
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  featuredImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  featuredContent: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  featuredDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featuredTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // Trending
  trendingList: {
    paddingBottom: spacing.xl,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  trendingRank: {
    width: 32,
    fontSize: 13,
    fontWeight: '700',
    color: '#A0A0A0',
  },
  trendingInfo: {
    flex: 1,
  },
  trendingHashtag: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  trendingCount: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
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
