export const GET_RESOURCES_BY_COURSE = /* GraphQL */ `
  query GetResourcesByCourse($courseId: String!) {
    getResourcesByCourse(courseId: $courseId) {
      _id
      resourceTitle
      resourceType
      resourceUrl
      resourceSize
      downloadCount
      createdAt
    }
  }
`;
