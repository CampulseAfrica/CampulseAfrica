import { UserProfile, Post } from '../types';
import { mockUsers, mockPosts } from './mockDb';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile> {
    await delay(500);
    const user = Object.values(mockUsers).find((u) => u.id === userId) ?? Object.values(mockUsers)[0];
    return {
      ...user,
      isFollowing: false,
      isOwnProfile: userId === 'user-1', // Mock: first user is "current user"
    };
  },

  async getUserPosts(userId: string): Promise<Post[]> {
    await delay(500);
    return mockPosts.filter((p) => p.user.id === userId);
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    await delay(600);
    const user = Object.values(mockUsers).find((u) => u.id === userId) ?? Object.values(mockUsers)[0];
    return {
      ...user,
      ...updates,
      isFollowing: false,
      isOwnProfile: true,
    };
  },

  async followUser(userId: string): Promise<boolean> {
    await delay(300);
    return true;
  },

  async unfollowUser(userId: string): Promise<boolean> {
    await delay(300);
    return true;
  },

  async getFollowers(userId: string): Promise<UserProfile[]> {
    await delay(500);
    return Object.values(mockUsers).slice(0, 10).map((u) => ({
      ...u,
      isFollowing: Math.random() > 0.5,
      isOwnProfile: false,
    }));
  },

  async getFollowing(userId: string): Promise<UserProfile[]> {
    await delay(500);
    return Object.values(mockUsers).slice(5, 15).map((u) => ({
      ...u,
      isFollowing: true,
      isOwnProfile: false,
    }));
  },
};
