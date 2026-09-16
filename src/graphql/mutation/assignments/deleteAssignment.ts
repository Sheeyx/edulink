// src/graphql/mutation/assignments/deleteAssignment.ts

export const DELETE_ASSIGNMENT_MUTATION = /* GraphQL */ `
  mutation DeleteAssignment($input: String!) {
    deleteAssignment(input: $input) {
      _id
      deletedAt
    }
  }
`;
