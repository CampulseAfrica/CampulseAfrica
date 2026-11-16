import { Comment } from '../../types';
import { mockUsers } from './users';

// Pre-seeded threaded comments for post-1 matching redesign mockups
export const mockCommentThreads: Record<string, Comment[]> = {
  'post-1': [
    {
      id: 'comment-1',
      postId: 'post-1',
      user: mockUsers.user_1, // Jane Doe (Author)
      content: 'This is so true! Been saying this for weeks.',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      upvotesCount: 24,
      downvotesCount: 2,
      userVote: null,
      totalRepliesCount: 6,
      replies: [
        {
          id: 'reply-1-1',
          postId: 'post-1',
          parentId: 'comment-1',
          user: mockUsers.user_2, // Alex Johnson
          content: 'Same here! Can’t wait to try the robotics equipment.',
          createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
          upvotesCount: 12,
          downvotesCount: 0,
          userVote: 'up', // Active upvoted state in design
          totalRepliesCount: 2,
          replies: [
            {
              id: 'reply-1-1-1',
              postId: 'post-1',
              parentId: 'reply-1-1',
              user: mockUsers.user_1, // Jane Doe (Author)
              content: 'Make sure to complete the lab safety briefing first! You need the safety badge to access the robotics bay.',
              createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
              upvotesCount: 8,
              downvotesCount: 0,
              userVote: null,
              replies: [],
              totalRepliesCount: 0,
            },
            {
              id: 'reply-1-1-2',
              postId: 'post-1',
              parentId: 'reply-1-1',
              user: mockUsers.user_4, // Emeka Okafor
              content: 'The 6-axis robotic arm is already set up and calibrated. It looks incredible in person!',
              createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
              upvotesCount: 4,
              downvotesCount: 0,
              userVote: null,
              replies: [],
              totalRepliesCount: 0,
            },
          ],
        },
        {
          id: 'reply-1-2',
          postId: 'post-1',
          parentId: 'comment-1',
          user: mockUsers.user_3, // Dr. Sarah Smith
          content: 'Does anyone know the opening hours?',
          createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
          upvotesCount: 9,
          downvotesCount: 0,
          userVote: null,
          totalRepliesCount: 1,
          replies: [
            {
              id: 'reply-1-2-1',
              postId: 'post-1',
              parentId: 'reply-1-2',
              user: mockUsers.user_1, // Jane Doe (Author)
              content: 'Weekdays 8am to 6pm, Saturdays until 2pm! Faculty access is 24/7 with RFID card.',
              createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
              upvotesCount: 5,
              downvotesCount: 0,
              userVote: null,
              replies: [],
              totalRepliesCount: 0,
            },
          ],
        },
        {
          id: 'reply-1-3',
          postId: 'post-1',
          parentId: 'comment-1',
          user: mockUsers.user_4, // Emeka Okafor
          content: 'Weekdays 8am to 6pm, Saturdays until 2pm!',
          createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
          upvotesCount: 5,
          downvotesCount: 0,
          userVote: null,
          replies: [],
          totalRepliesCount: 0,
        },
        {
          id: 'reply-1-4',
          postId: 'post-1',
          parentId: 'comment-1',
          user: mockUsers.user_5, // Chioma Adeleke
          content: 'Thanks Dr. Sarah and Emeka! Super helpful.',
          createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
          upvotesCount: 2,
          downvotesCount: 0,
          userVote: null,
          replies: [],
          totalRepliesCount: 0,
        },
      ],
    },
    {
      id: 'comment-2',
      postId: 'post-1',
      user: mockUsers.user_2, // Alex Johnson
      content: 'Not sure about this one... needs more context.',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      upvotesCount: 8,
      downvotesCount: 3,
      userVote: null,
      totalRepliesCount: 2,
      replies: [
        {
          id: 'reply-2-1',
          postId: 'post-1',
          parentId: 'comment-2',
          user: mockUsers.user_1, // Jane Doe (Author)
          content: 'What would you like to know? Happy to clarify.',
          createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
          upvotesCount: 6,
          downvotesCount: 0,
          userVote: null,
          totalRepliesCount: 1,
          replies: [
            {
              id: 'reply-2-1-1',
              postId: 'post-1',
              parentId: 'reply-2-1',
              user: mockUsers.user_2, // Alex Johnson
              content: 'Are undergraduate students allowed to use the equipment unsupervised?',
              createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
              upvotesCount: 3,
              downvotesCount: 0,
              userVote: null,
              replies: [],
              totalRepliesCount: 0,
            },
          ],
        },
      ],
    },
    {
      id: 'comment-3',
      postId: 'post-1',
      user: mockUsers.user_3, // Dr. Sarah Smith
      content: 'Finally someone said it! 👏',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      upvotesCount: 31,
      downvotesCount: 1,
      userVote: null,
      totalRepliesCount: 0,
      replies: [],
    },
  ],
};

// Generates dynamic mock comments if postId is not pre-seeded
export function generateMockComments(postId: string): Comment[] {
  const usersList = Object.values(mockUsers);
  return [
    {
      id: `comment-${postId}-1`,
      postId,
      user: usersList[0],
      content: 'This is a fantastic update for our campus community!',
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      upvotesCount: 15,
      downvotesCount: 1,
      userVote: null,
      totalRepliesCount: 2,
      replies: [
        {
          id: `reply-${postId}-1-1`,
          postId,
          parentId: `comment-${postId}-1`,
          user: usersList[1],
          content: 'Totally agree, long overdue.',
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
          upvotesCount: 4,
          downvotesCount: 0,
          userVote: null,
          replies: [],
          totalRepliesCount: 0,
        },
        {
          id: `reply-${postId}-1-2`,
          postId,
          parentId: `comment-${postId}-1`,
          user: usersList[2],
          content: 'Looking forward to more details soon.',
          createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
          upvotesCount: 2,
          downvotesCount: 0,
          userVote: null,
          replies: [],
          totalRepliesCount: 0,
        },
      ],
    },
    {
      id: `comment-${postId}-2`,
      postId,
      user: usersList[2],
      content: 'Can anyone from the department verify this notice?',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      upvotesCount: 8,
      downvotesCount: 2,
      userVote: null,
      totalRepliesCount: 1,
      replies: [
        {
          id: `reply-${postId}-2-1`,
          postId,
          parentId: `comment-${postId}-2`,
          user: usersList[0],
          content: 'Yes, officially confirmed by the dean this morning.',
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
          upvotesCount: 11,
          downvotesCount: 0,
          userVote: null,
          replies: [],
          totalRepliesCount: 0,
        },
      ],
    },
  ];
}
