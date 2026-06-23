export interface Notification {
  id: string;
  title: string;
  timeAgo: string;
  isRead: boolean;
  type: 'announcement' | 'academic' | 'social' | 'general';
}
