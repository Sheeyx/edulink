// src/graphql/assignment/createAssignment.ts

export const CREATE_ASSIGNMENT_MUTATION = `
  mutation CreateAssignment($input: AssignmentInput!) {
    createAssignment(input: $input) {
      _id
      title
      description
      courseId
      sectionId
      lessonId
      dueDate
      attachments
      status
      createdAt
      updatedAt
    }
  }
`;
