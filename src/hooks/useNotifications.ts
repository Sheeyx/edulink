// src/hooks/useNotifications.ts
"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { useAuth } from "@/providers/auth-context";
import { GET_MEMBER_NOTIFICATIONS } from "@/graphql/query/notification/notification";
import {
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  DISMISS_NOTIFICATION,
} from "@/graphql/mutation/notification/notification";

export type AppNotification = {
  _id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any> | null;
  isRead: boolean;
  createdAt: string;
};

type GetNotificationsResponse = {
  getMemberNotifications: {
    list: AppNotification[];
    totalCount: number;
    unreadCount: number;
  };
};

// No push/socket channel wired for notifications yet, so we poll instead.
const POLL_INTERVAL_MS = 20_000;

export function useNotifications(input?: { page?: number; limit?: number }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const page = input?.page ?? 1;
  const limit = input?.limit ?? 10;

  const query = useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: async () => {
      const res = await gqlFetchAuth<GetNotificationsResponse>(GET_MEMBER_NOTIFICATIONS, {
        inquiry: { page, limit },
      });
      return res.getMemberNotifications;
    },
    enabled: !!user,
    placeholderData: keepPreviousData,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 10_000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => gqlFetchAuth(MARK_NOTIFICATION_AS_READ, { notificationId }),
    onSuccess: invalidate,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => gqlFetchAuth(MARK_ALL_NOTIFICATIONS_AS_READ),
    onSuccess: invalidate,
  });

  const dismissMutation = useMutation({
    mutationFn: (notificationId: string) => gqlFetchAuth(DISMISS_NOTIFICATION, { notificationId }),
    onSuccess: invalidate,
  });

  return {
    notifications: query.data?.list ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    dismiss: dismissMutation.mutate,
  };
}
