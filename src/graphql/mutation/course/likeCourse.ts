// src/graphql/mutation/course/likeCourse.ts

export const LIKE_TARGET_COURSE = /* GraphQL */ `
  mutation LikeTargetCourse($input: String!) {
    likeTargetCourse(courseId: $input) {
      _id
      courseLikes
    }
  }
`;
