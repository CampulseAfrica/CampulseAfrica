import { createMMKV } from 'react-native-mmkv';
import type { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

/**
 * MMKV instance for the app.
 * Fast, synchronous key-value storage backed by native code.
 */
export const storage: MMKV = createMMKV();

/**
 * Zustand-compatible storage adapter for MMKV.
 * Used with zustand's `persist` middleware to persist store state.
 */
export const mmkvStorage: StateStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};
