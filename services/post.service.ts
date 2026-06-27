import { Post, VoteType, Comment } from '../types';
import { mockPosts, mockUsers } from './mockDb';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const postService = {
  async getPosts(tab: 'mySchool' | 'otherCampus', universityName?: string): Promise<Post[]> {
    await delay(600);
    if (tab === 'mySchool' && universityName) {
      return mockPosts.filter((p) => p.user.university.name === universityName);
    }
    if (tab === 'otherCampus' && universityName) {
      return mockPosts.filter((p) => p.user.university.name !== universityName);
    }
    return mockPosts;
  },

  async getPostById(id: string): Promise<Post | null> {
    await delay(400);
    return mockPosts.find((p) => p.id === id) ?? null;
  },

  async votePost(postId: string, voteType: VoteType): Promise<Post> {
    await delay(300);
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    return {
      ...post,
      userVote: voteType,
      trueCount: voteType === 'true' ? post.trueCount + 1 : post.trueCount,
      misleadingCount: voteType === 'misleading' ? post.misleadingCount + 1 : post.misleadingCount,
      falseCount: voteType === 'false' ? post.falseCount + 1 : post.falseCount,
    };
  },

  async getComments(postId: string): Promise<Comment[]> {
    await delay(150);
    // Generate mock comments
    return Array.from({ length: 8 }, (_, i) => ({
      id: `comment-${postId}-${i}`,
      postId,
      user: Object.values(mockUsers)[i % Object.values(mockUsers).length],
      content: [
        'This is so true! Been saying this for weeks.',
        'Not sure about this one... needs more context.',
        'Finally someone said it! 👏',
        'Can anyone verify this information?',
        "Great post, thanks for sharing!",
        'I was there, can confirm this is accurate.',
        "Hmm, I heard a different version of this story.",
        'This is exactly what I needed to hear today.',
      ][i],
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      likesCount: Math.floor(Math.random() * 20),
    }));
  },

  async addComment(postId: string, content: string): Promise<Comment> {
    await delay(400);
    return {
      id: `comment-new-${Date.now()}`,
      postId,
      user: Object.values(mockUsers)[0],
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
    };
  },

  async bookmarkPost(postId: string): Promise<boolean> {
    await delay(300);
    return true;
  },

  async sharePost(postId: string): Promise<boolean> {
    await delay(200);
    return true;
  },

  async createPost(data: { content: string; authorId: string; universityId: string }): Promise<any> {
    await delay(500);
    return true;
  },
};
