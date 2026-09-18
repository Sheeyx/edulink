// src/graphql/query/notification/notification.ts

export const GET_MEMBER_NOTIFICATIONS = /* GraphQL */ `
  query GetMemberNotifications($inquiry: NotificationsInquiry!) {
    getMemberNotifications(inquiry: $inquiry) {
      list {
        _id
        type
        title
        body
        data
        isRead
        createdAt
      }
      totalCount
      unreadCount
    }
  }
`;
