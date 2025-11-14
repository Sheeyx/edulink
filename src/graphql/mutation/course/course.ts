// Keep all course mutations in one place.
// If you later add update/delete, add them here.

export const CREATE_COURSE = /* GraphQL */ `
  mutation CreateCourse($input: CourseInput!) {
    createCourse(input: $input) {
      _id
    }
  }
`;



