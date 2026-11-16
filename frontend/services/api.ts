import { User } from '../types';
import { mockUsers } from './mockDb';

// Simulate network latency for a realistic experience
const DELAY_MS = 600;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  /**
   * Simulates logging in a user by their ID.
   * In a real app, this would take email/password or a token and return the User profile.
   */
  async loginUser(userId: string): Promise<User> {
    await delay(DELAY_MS);
    const user = mockUsers[userId];
    if (!user) {
      throw new Error(`User with id ${userId} not found in mock database.`);
    }
    return user;
  },

  /**
   * Simulates fetching all available mock users for the developer fast-switching UI.
   */
  async getMockUsers(): Promise<User[]> {
    await delay(300); // Shorter delay for UI smoothness
    return Object.values(mockUsers);
  },
};
