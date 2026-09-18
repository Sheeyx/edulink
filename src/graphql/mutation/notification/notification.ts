// src/graphql/mutation/notification/notification.ts

// markNotificationAsRead/markAllNotificationsAsRead take bare arguments
// (no input object) — confirmed via the backend resolver signatures.
export const MARK_NOTIFICATION_AS_READ = /* GraphQL */ `
  mutation MarkNotificationAsRead($notificationId: String!) {
    markNotificationAsRead(notificationId: $notificationId) {
      _id
      isRead
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = /* GraphQL */ `
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

export const DISMISS_NOTIFICATION = /* GraphQL */ `
  mutation DismissNotification($notificationId: String!) {
    dismissNotification(notificationId: $notificationId)
  }
`;
