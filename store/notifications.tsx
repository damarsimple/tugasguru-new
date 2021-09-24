import create from "zustand";
import { Notification } from "../types/type";

interface NotificationState {
  notifications: Notification[];
  setNotifications: (e: Notification[]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (notifications: Notification[]) => set({ notifications }),
}));
