import { create } from "@/lib/zustand";
import { nanoid } from "nanoid";
import type { ReactNode } from "react";

export type NotificationType = {
  id: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: ReactNode;
  message?: ReactNode;
  position?: 'right' | 'left' | 'center';
};

export type NotificationsActionType = {
  show: (notification: Omit<NotificationType, 'id'>)  => void;
  remove: (id: string) => void;
};

type NotificationsStoreType = {
  notifications: NotificationType[];
  actions: NotificationsActionType;
}

const useNotificationStore = create<NotificationsStoreType>((set) => ({
  notifications: [],
  actions: {
    show: (notification) => set((state) => ({
      notifications: [{ id: nanoid(), ...notification }, ...state.notifications],
    })),
    remove: (id) => set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
  }
}));

export const useNotificationList = () => useNotificationStore((state) => state.notifications);
export const useNotificationActions = () => useNotificationStore((state) => state.actions);