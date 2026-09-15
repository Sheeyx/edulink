// src/graphql/query/assignments/assignments.ts

const ASSIGNMENT_FIELDS = /* GraphQL */ `
  _id
  title
  description
  courseId
  sectionId
  lessonId
  mentorId
  dueDate
  attachments
  status
  createdAt
  updatedAt
`;

// Mentor: assignments for a course, with submission count + raw submissions
export const GET_ASSIGNMENTS_BY_COURSE = /* GraphQL */ `
  query GetAssignmentsByCourse($courseId: String!) {
    getAssignmentsByCourse(courseId: $courseId) {
      list {
        ${ASSIGNMENT_FIELDS}
        submissionCount
      }
      metaCounter {
        total
      }
    }
  }
`;

// Student: assignments for a course they're enrolled in
export const GET_MY_ASSIGNMENTS = /* GraphQL */ `
  query GetMyAssignments($courseId: String!) {
    getMyAssignments(courseId: $courseId) {
      list {
        ${ASSIGNMENT_FIELDS}
      }
      metaCounter {
        total
      }
    }
  }
`;
