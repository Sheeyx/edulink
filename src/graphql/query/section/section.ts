import { gql } from "graphql-request";

export const GET_SECTIONS_BY_COURSE = gql/* GraphQL */ `
  query GetSectionsByCourse($input: SectionsInquiry!) {
    getSectionsByCourse(input: $input) {
      list {
        _id
        courseId
        sectionStatus
        moduleTitle
        moduleOrder
        totalLessons
        deletedAt
        createdAt
        updatedAt
        lessons {
          _id
          sectionId
          lessonTitle
          lessonContentType
          lessonDuration
          deletedAt
          createdAt
          updatedAt
        }
      }
      metaCounter { total }
    }
  }
`;


