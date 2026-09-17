export const GET_COMMENTS_BY_COURSE = /* GraphQL */ `
  query GetCommentsByCourse($input: CommentsInquiry!) {
    getCommentsByCourse(input: $input) {
      totalCount
      list {
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
  }
`;
