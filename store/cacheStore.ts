import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Post, Notification } from '../types';
import { mmkvStorage } from './storage';

const CACHE_LIMIT = 100;

interface CacheStore {
  mySchoolPosts: Post[];
  otherCampusPosts: Post[];
  notifications: Notification[];
  lastFetchedAt: {
    mySchool: number | null;
    otherCampus: number | null;
    notifications: number | null;
  };

  // Actions
  setMySchoolPosts: (posts: Post[]) => void;
  setOtherCampusPosts: (posts: Post[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  clearCache: () => void;
}

export const useCacheStore = create<CacheStore>()(
  persist(
    (set, get) => ({
      mySchoolPosts: [],
      otherCampusPosts: [],
      notifications: [],
      lastFetchedAt: {
        mySchool: null,
        otherCampus: null,
        notifications: null,
      },

      setMySchoolPosts: (posts: Post[]) =>
        set({
          mySchoolPosts: posts.slice(0, CACHE_LIMIT),
          lastFetchedAt: {
            ...get().lastFetchedAt,
            mySchool: Date.now(),
          },
        }),

      setOtherCampusPosts: (posts: Post[]) =>
        set({
          otherCampusPosts: posts.slice(0, CACHE_LIMIT),
          lastFetchedAt: {
            ...get().lastFetchedAt,
            otherCampus: Date.now(),
          },
        }),

      setNotifications: (notifications: Notification[]) =>
        set({
          notifications: notifications.slice(0, CACHE_LIMIT),
          lastFetchedAt: {
            ...get().lastFetchedAt,
            notifications: Date.now(),
          },
        }),

      clearCache: () =>
        set({
          mySchoolPosts: [],
          otherCampusPosts: [],
          notifications: [],
          lastFetchedAt: {
            mySchool: null,
            otherCampus: null,
            notifications: null,
          },
        }),
    }),
    {
      name: 'campulse-cache',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
