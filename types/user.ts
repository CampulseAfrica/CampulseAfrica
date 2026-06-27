export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  image?: any;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  coverPhoto?: string;
  university: University;
  faculty: string;
  bio?: string;
  isVerified: boolean;
  joinedDate: string;
  reputation: number;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface UserProfile extends User {
  isFollowing: boolean;
  isOwnProfile: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  currentUser: User | null;
  selectedUniversity: University | null;
}
