import { TrendingTopic, NewsItem, Job, AcademicMaterial, CampusEvent, FeaturedNews } from '../types';
import {
  mockFeaturedNews,
  mockTrendingTopics,
  mockNewsItems,
  mockJobs,
  mockAcademicMaterials,
  mockEvents,
} from '../mocks';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const discoverService = {
  async getFeaturedNews(): Promise<FeaturedNews> {
    await delay(400);
    return mockFeaturedNews;
  },

  async getTrending(): Promise<TrendingTopic[]> {
    await delay(500);
    return mockTrendingTopics;
  },

  async getNews(): Promise<NewsItem[]> {
    await delay(500);
    return mockNewsItems;
  },

  async getJobs(): Promise<Job[]> {
    await delay(500);
    return mockJobs.filter((j) => j.type === 'job');
  },

  async getAbroadOpportunities(): Promise<Job[]> {
    await delay(500);
    return mockJobs.filter((j) => j.type === 'abroad');
  },

  async getAcademicMaterials(): Promise<AcademicMaterial[]> {
    await delay(500);
    return mockAcademicMaterials;
  },

  async getEvents(): Promise<CampusEvent[]> {
    await delay(500);
    return mockEvents;
  },

  async searchAll(query: string): Promise<{
    posts: string[];
    users: string[];
    topics: TrendingTopic[];
  }> {
    await delay(600);
    const matchingTopics = mockTrendingTopics.filter((t) =>
      t.hashtag.toLowerCase().includes(query.toLowerCase())
    );
    return {
      posts: [],
      users: [],
      topics: matchingTopics,
    };
  },
};
