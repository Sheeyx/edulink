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

// Mentor-only: same as GET_COURSE but also includes resources (resourceUrl may be
// private/paid content) — never reuse this for the public /courses/[id] page.
export const GET_COURSE_FOR_MENTOR = gql/* GraphQL */ `
  query GetCourseForMentor($input: String!) {
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
      resources {
        _id
        resourceTitle
        resourceType
        resourceUrl
        resourceSize
        courseId
        mentorId
        resourceStatus
        downloadCount
        isPublic
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_RESOURCE = /* GraphQL */ `
  mutation CreateResource($input: ResourceInput!) {
    createResource(input: $input) {
      _id
      resourceTitle
      resourceType
      resourceUrl
      resourceSize
      courseId
      mentorId
      resourceStatus
      downloadCount
      isPublic
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_RESOURCE = /* GraphQL */ `
  mutation UpdateResource($input: ResourceUpdate!) {
    updateResource(input: $input) {
      _id
      resourceTitle
      resourceType
      resourceUrl
      resourceSize
      resourceStatus
      downloadCount
      isPublic
      updatedAt
    }
  }
`;

export const REMOVE_RESOURCE = /* GraphQL */ `
  mutation RemoveResource($input: String!) {
    removeResource(resourceId: $input) {
      _id
    }
  }
`;

/* ───────── Course Schedule (live class scheduling) ───────── */

const SCHEDULE_FIELDS = /* GraphQL */ `
  _id
  courseId
  mentorId
  lessonId
  startAt
  status
  meetLinks
  createdAt
  updatedAt
`;

export const CREATE_SCHEDULE = /* GraphQL */ `
  mutation CreateSchedule($input: CreateCourseScheduleInput!) {
    createSchedule(input: $input) {
      ${SCHEDULE_FIELDS}
    }
  }
`;

export const UPDATE_SCHEDULE = /* GraphQL */ `
  mutation UpdateSchedule($input: UpdateCourseScheduleInput!) {
    updateSchedule(input: $input) {
      ${SCHEDULE_FIELDS}
    }
  }
`;

export const REMOVE_SCHEDULE = /* GraphQL */ `
  mutation RemoveSchedule($input: String!) {
    removeSchedule(scheduleId: $input) {
      _id
    }
  }
`;

export const GET_SCHEDULE = /* GraphQL */ `
  query GetSchedule($input: String!) {
    getSchedule(scheduleId: $input) {
      ${SCHEDULE_FIELDS}
    }
  }
`;

// Note: CourseSchedulesInquiry has no courseId filter on the backend today,
// so callers fetch a page and filter by courseId client-side.
export const GET_SCHEDULES = /* GraphQL */ `
  query GetSchedules($input: CourseSchedulesInquiry!) {
    getSchedules(input: $input) {
      list {
        ${SCHEDULE_FIELDS}
      }
      metaCounter {
        total
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
      _id
      maxStudents
      courseStartDate
    }
  }
`;

// List courses the logged-in student is enrolled in (derived from JWT on the server)
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
        moduleTitle
        moduleOrder
        sectionStatus
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
