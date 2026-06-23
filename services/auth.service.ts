import { User } from '../types';
import { mockUsers } from '../mocks';

interface SignUpData {
  fullName: string;
  email: string;
  school: string;
  password: string;
}

interface LoginData {
  email: string;
  school: string;
  password: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async signUp(data: SignUpData): Promise<User> {
    await delay(800);
    // Simulate creating a new user
    const newUser: User = {
      ...mockUsers[0],
      id: `user-new-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      reputation: 0,
      joinedDate: new Date().toISOString(),
    };
    return newUser;
  },

  async login(data: LoginData): Promise<User> {
    await delay(800);
    // Simulate login — return the first mock user
    const user = mockUsers.find((u) => u.email === data.email);
    if (!user) {
      return mockUsers[0];
    }
    return user;
  },

  async verifyOtp(otp: string): Promise<boolean> {
    await delay(600);
    // Accept any 4+ digit OTP in mock
    return otp.length >= 4;
  },

  async logout(): Promise<void> {
    await delay(300);
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(400);
    return mockUsers[0];
  },

  async forgotPassword(email: string): Promise<boolean> {
    await delay(600);
    return true;
  },
};
