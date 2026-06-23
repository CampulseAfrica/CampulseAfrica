import { User } from './user';

export type VoteType = 'true' | 'misleading' | 'false';

export interface Vote {
  id: string;
  userId: string;
  postId: string;
  voteType: VoteType;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  images: string[];
  hashtags: string[];
  trueCount: number;
  misleadingCount: number;
  falseCount: number;
  commentsCount: number;
  sharesCount: number;
  userVote: VoteType | null;
  isBookmarked: boolean;
  createdAt: string;
  university: string;
}

export type FeedTab = 'mySchool' | 'otherCampus';
