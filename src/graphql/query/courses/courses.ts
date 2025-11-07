import { gql } from "graphql-request";

export const GET_COURSE = gql/* GraphQL */ `
  query GetCourse($input: String!) {
    getCourse(courseId: $input) {
      _id
      courseTitle
      courseDesc
      courseCategory
      languageType
      courseLevel
      coursePrice
      courseStatus
      courseEnrolledMembers
      courseTotalModules
      courseTotalLessons
      courseRating
      courseLikes
      createdAt
      updatedAt
      sectionsWithLessons {
        _id
        courseId
        moduleTitle
        moduleOrder
        totalLessons
        createdAt
        updatedAt
        lessons {
          _id
          sectionId
          lessonTitle
          lessonContentType
          lessonDuration
          createdAt
          updatedAt
        }
      }
      memberData {
        _id
        memberFullName
        memberImage
        memberBio
      }
    }
  }
`;
