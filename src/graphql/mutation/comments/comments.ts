export const CREATE_COMMENT = /* GraphQL */ `
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      _id
      memberId
      courseId
      comment
      commentLikes
      createdAt
      memberData {
        _id
        memberFullName
        memberImage
      }
      commentReplies {
        memberId
        repliesComment
        createdAt
        memberData {
          _id
          memberFullName
          memberImage
        }
      }
    }
  }
`;

export const ADD_COMMENT_REPLY = /* GraphQL */ `
  mutation AddCommentReply($input: CommentReplyInput!) {
    addCommentReply(input: $input) {
      _id
      memberId
      courseId
      comment
      commentLikes
      createdAt
      memberData {
        _id
        memberFullName
        memberImage
      }
      commentReplies {
        memberId
        repliesComment
        createdAt
        memberData {
          _id
          memberFullName
          memberImage
        }
      }
    }
  }
`;

export const DELETE_COMMENT = /* GraphQL */ `
  mutation DeleteComment($commentId: String!) {
    deleteComment(commentId: $commentId)
  }
`;
