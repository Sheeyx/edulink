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
        sectionStatus
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

// List the current mentor's courses (derived from JWT on the server)
export const GET_MENTOR_COURSES = /* GraphQL */ `
  query GetMentorCourses($input: CoursesInquiry!) {
    getMentorCourses(input: $input) {
      list {
        _id
        courseTitle
        courseDesc
        courseCategory
        languageType
        courseLevel
        coursePrice
        courseStatus
        mentorId
        courseEnrolledMembers
        courseTotalModules
        courseTotalLessons
        courseRating
        courseLikes
        deletedAt
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const UPDATE_COURSE = /* GraphQL */ `
  mutation UpdateCourse($input: CourseUpdate!) {
    updateCourse(input: $input) {
      _id
      courseTitle
      courseDesc
      courseCategory
      languageType
      courseLevel
      coursePrice
      courseStatus
      mentorId
      courseEnrolledMembers
      courseTotalModules
      courseTotalLessons
      courseRating
      courseLikes
      deletedAt
      createdAt
      updatedAt
    }
  }
`;
