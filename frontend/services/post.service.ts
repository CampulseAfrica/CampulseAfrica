import { Post, VoteType, Comment } from '../types';
import { mockPosts, mockUsers, mockCommentThreads, generateMockComments } from './mockDb';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory comments store initialized from mockCommentThreads
const commentsStore: Record<string, Comment[]> = { ...mockCommentThreads };

// Helper to recursively find a comment at any depth
function findCommentInTree(comments: Comment[], id: string): Comment | undefined {
  for (const c of comments) {
    if (c.id === id) return c;
    if (c.replies && c.replies.length > 0) {
      const found = findCommentInTree(c.replies, id);
      if (found) return found;
    }
  }
  return undefined;
}

export const postService = {
  async getCampusFilters(): Promise<string[]> {
    await delay(100);
    return ['All campuses', 'UNIBEN', 'UI', 'ABU', 'UNILAG', 'OAU'];
  },

  async getPosts(tab: 'mySchool' | 'otherCampus', universityName?: string, campusFilter?: string): Promise<Post[]> {
    await delay(350);
    if (tab === 'mySchool') {
      if (universityName) {
        const posts = mockPosts.filter((p) => p.user.university.name === universityName || p.university === universityName);
        if (posts.length > 0) return posts;
      }
      return mockPosts.filter((p) => p.user.university.shortName === 'UNILAG' || p.university === 'University of Lagos');
    }
    if (tab === 'otherCampus') {
      let filtered = mockPosts;
      if (universityName) {
        filtered = filtered.filter((p) => p.user.university.name !== universityName && p.university !== universityName);
      } else {
        filtered = filtered.filter((p) => p.user.university.shortName !== 'UNILAG');
      }
      if (campusFilter && campusFilter !== 'All campuses') {
        const matchUni = filtered.filter((p) =>
          p.user.university.shortName?.toLowerCase() === campusFilter.toLowerCase() ||
          p.university.toLowerCase().includes(campusFilter.toLowerCase())
        );
        if (matchUni.length > 0) return matchUni;
      }
      return filtered;
    }
    return mockPosts;
  },

  async toggleFollow(userId: string): Promise<boolean> {
    await delay(200);
    return true;
  },

  async getPostById(id: string): Promise<Post | null> {
    await delay(200);
    const post = mockPosts.find((p) => p.id === id);
    return post || mockPosts[0];
  },

  async votePost(id: string, voteType: VoteType): Promise<Post> {
    await delay(200);
    const post = mockPosts.find((p) => p.id === id) || mockPosts[0];
    return {
      ...post,
      userVote: post.userVote === voteType ? null : voteType,
      trueCount: voteType === 'true' ? post.trueCount + 1 : post.trueCount,
      misleadingCount: voteType === 'misleading' ? post.misleadingCount + 1 : post.misleadingCount,
      falseCount: voteType === 'false' ? post.falseCount + 1 : post.falseCount,
    };
  },

  async getComments(postId: string): Promise<Comment[]> {
    await delay(200);
    if (!commentsStore[postId]) {
      commentsStore[postId] = generateMockComments(postId);
    }
    return commentsStore[postId];
  },

  async addComment(postId: string, content: string, parentId?: string, user?: any): Promise<Comment> {
    await delay(350);
    if (!commentsStore[postId]) {
      commentsStore[postId] = generateMockComments(postId);
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      parentId: parentId || null,
      user: user || Object.values(mockUsers)[0],
      content,
      createdAt: new Date().toISOString(),
      upvotesCount: 0,
      downvotesCount: 0,
      userVote: null,
      replies: [],
      totalRepliesCount: 0,
      likesCount: 0,
    };

    if (parentId) {
      const parent = findCommentInTree(commentsStore[postId], parentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(newComment);
        parent.totalRepliesCount = (parent.totalRepliesCount || 0) + 1;
      } else {
        commentsStore[postId] = [newComment, ...commentsStore[postId]];
      }
    } else {
      commentsStore[postId] = [newComment, ...commentsStore[postId]];
    }

    return newComment;
  },

  async voteComment(
    postId: string,
    commentId: string,
    voteType: 'up' | 'down'
  ): Promise<{ upvotesCount: number; downvotesCount: number; userVote: 'up' | 'down' | null }> {
    await delay(200);
    if (!commentsStore[postId]) {
      commentsStore[postId] = generateMockComments(postId);
    }

    const targetComment = findCommentInTree(commentsStore[postId], commentId);

    if (!targetComment) {
      return { upvotesCount: 0, downvotesCount: 0, userVote: null };
    }

    if (targetComment.userVote === voteType) {
      // Toggle off
      targetComment.userVote = null;
      if (voteType === 'up') {
        targetComment.upvotesCount = Math.max(0, targetComment.upvotesCount - 1);
      } else {
        targetComment.downvotesCount = Math.max(0, targetComment.downvotesCount - 1);
      }
    } else {
      // Switch or set vote
      if (targetComment.userVote === 'up') {
        targetComment.upvotesCount = Math.max(0, targetComment.upvotesCount - 1);
      } else if (targetComment.userVote === 'down') {
        targetComment.downvotesCount = Math.max(0, targetComment.downvotesCount - 1);
      }

      targetComment.userVote = voteType;
      if (voteType === 'up') {
        targetComment.upvotesCount += 1;
      } else {
        targetComment.downvotesCount += 1;
      }
    }

    return {
      upvotesCount: targetComment.upvotesCount,
      downvotesCount: targetComment.downvotesCount,
      userVote: targetComment.userVote,
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
