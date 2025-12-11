// src/graphql/mutation/assignments/updateAssignment.ts

export const UPDATE_ASSIGNMENT_MUTATION = `
  mutation UpdateAssignment($input: AssignmentUpdate!) {
    updateAssignment(input: $input) {
      _id
      title
      description
      dueDate
      attachments
      status
      updatedAt
    }
  }
`;
