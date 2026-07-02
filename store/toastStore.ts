import { create } from 'zustand';

interface ToastStore {
  message: string | null;
  visible: boolean;
  show: (message: string) => void;
  hide: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  message: null,
  visible: false,

  show: (message: string) => {
    set({ message, visible: true });
    // Auto-dismiss after 2.5 seconds
    setTimeout(() => {
      set({ visible: false });
    }, 2500);
  },

  hide: () => set({ message: null, visible: false }),
}));
