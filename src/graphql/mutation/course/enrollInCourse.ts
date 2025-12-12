// graphql/mutations/enrollInCourse.ts
export const ENROLL_IN_COURSE = `
  mutation EnrollInCourse($input: String!) {
    enrollInCourse(courseId: $input) {
      _id
      courseTitle
      courseStatus
    }
  }
`;
