export interface TrendingTopic {
  id: string;
  rank: number;
  hashtag: string;
  postsCount: number;
}

export interface NewsItem {
  id: string;
  date: string;
  dayOfWeek: string;
  title: string;
  isNew: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  description: string;
  image: string;
  isBookmarked: boolean;
  type: 'job' | 'abroad';
}

export interface AcademicMaterial {
  id: string;
  courseCode: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  university: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  university: string;
  isBookmarked: boolean;
}

export interface FeaturedNews {
  id: string;
  title: string;
  description: string;
  image: string;
  timeAgo: string;
  category: string;
  isBookmarked: boolean;
}

export type DiscoverTab = 'trending' | 'news' | 'jobs' | 'academic' | 'events';
