import { Notification } from '../types';
import { mockNotifications } from './mockDb';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    await delay(500);
    return mockNotifications;
  },

  async markAsRead(id: string): Promise<boolean> {
    await delay(200);
    return true;
  },

  async markAllAsRead(): Promise<boolean> {
    await delay(300);
    return true;
  },

  async getUnreadCount(): Promise<number> {
    await delay(200);
    return mockNotifications.filter((n) => !n.isRead).length;
  },
};
