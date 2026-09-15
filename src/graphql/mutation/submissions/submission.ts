// src/graphql/mutation/submissions/submission.ts

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

export const SUBMIT_ASSIGNMENT_MUTATION = /* GraphQL */ `
  mutation SubmitAssignment($input: SubmissionInput!) {
    submitAssignment(input: $input) {
      ${SUBMISSION_FIELDS}
    }
  }
`;

export const UPDATE_SUBMISSION_MUTATION = /* GraphQL */ `
  mutation UpdateSubmission($input: SubmissionUpdate!) {
    updateSubmission(input: $input) {
      ${SUBMISSION_FIELDS}
    }
  }
`;

export const GRADE_SUBMISSION_MUTATION = /* GraphQL */ `
  mutation GradeSubmission($input: GradingInput!) {
    gradeSubmission(input: $input) {
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

export const REMOVE_SUBMISSION_ATTACHMENT_MUTATION = /* GraphQL */ `
  mutation RemoveSubmissionAttachment($input: RemoveSubmissionAttachmentInput!) {
    removeSubmissionAttachment(input: $input) {
      ${SUBMISSION_FIELDS}
    }
  }
`;
