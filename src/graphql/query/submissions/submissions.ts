// src/graphql/query/submissions/submissions.ts

const SUBMISSION_FIELDS = /* GraphQL */ `
  _id
  assignmentId
  studentId
  answer
  attachments
  submittedDate
  status
  feedback
  gradedBy
  gradedDate
  createdAt
  updatedAt
`;

// Mentor: submissions for one assignment (for grading)
export const GET_SUBMISSIONS = /* GraphQL */ `
  query GetSubmissions($input: SubmissionsInquiry!) {
    getSubmissions(input: $input) {
      list {
        ${SUBMISSION_FIELDS}
        studentData {
          _id
          memberFullName
          memberImage
        }
        graderData {
          _id
          memberFullName
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_SUBMISSION_BY_ID = /* GraphQL */ `
  query GetSubmissionById($input: String!) {
    getSubmissionById(submissionId: $input) {
      ${SUBMISSION_FIELDS}
      studentData {
        _id
        memberFullName
        memberImage
      }
      graderData {
        _id
        memberFullName
      }
    }
  }
`;

// Student: their own submissions (optionally scoped to a course)
export const GET_MY_SUBMISSIONS = /* GraphQL */ `
  query GetMySubmissions($input: String) {
    getMySubmissions(input: $input) {
      list {
        ${SUBMISSION_FIELDS}
      }
      metaCounter {
        total
      }
    }
  }
`;
