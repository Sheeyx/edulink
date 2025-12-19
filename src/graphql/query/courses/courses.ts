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
      courseImage
      maxStudents
      courseStartDate
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
          lessonUrl
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
        courseImage
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
      courseImage
      languageType
      courseLevel
      coursePrice
      courseStatus
      updatedAt
    }
  }
`;



export const UPDATE_COURSE_SETTINGS = /* GraphQL */ `
  mutation UpdateCourseSettings($input: CourseSettingsUpdate!) {
    updateCourseSettings(input: $input) {
      courseId
      maxStudents
      courseStartDate
    }
  }
`;



export const GET_MY_ENROLLED_COURSES = /* GraphQL */ `
  query GetMyEnrolledCourses {
    getMyEnrolledCourses {
      _id
      courseTitle
      courseDesc
      courseImage
      courseCategory
      languageType
      courseLevel
      coursePrice
      courseStatus
      courseEnrolledMembers
      maxStudents
      currentEnrolledMembers
      isFull
      courseTotalModules
      courseTotalLessons
      courseRating
      updatedAt
      sectionsWithLessons {
        _id
        sectionStatus
        moduleTitle
        moduleOrder
        totalLessons
        lessons {
          _id
          lessonTitle
          lessonStatus
          lessonContentType
          lessonDuration
          lessonUrl
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

export const GET_MY_ENROLLED_COURSE = /* GraphQL */ `
  query GetMyEnrolledCourse($input: String!) {
    getMyEnrolledCourse(courseId: $input) {
      _id
      courseTitle
      courseDesc
      courseImage
      courseCategory
      languageType
      courseLevel
      coursePrice
      courseStatus
      mentorId
      courseEnrolledMembers
      maxStudents
      currentEnrolledMembers
      courseStartDate
      isFull
      courseTotalModules
      courseTotalLessons
      courseRating
      courseLikes
      deletedAt
      createdAt
      updatedAt
      sectionsWithLessons {
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
          lessonStatus
          lessonContentType
          lessonDuration
          lessonUrl
          deletedAt
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
