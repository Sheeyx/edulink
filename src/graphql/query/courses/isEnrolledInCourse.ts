// src/graphql/query/courses/isEnrolledInCourse.ts

export const IS_ENROLLED_IN_COURSE = /* GraphQL */ `
  query IsEnrolledInCourse($input: String!) {
    isEnrolledInCourse(courseId: $input)
  }
`;
