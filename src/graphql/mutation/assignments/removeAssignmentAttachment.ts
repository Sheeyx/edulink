// src/graphql/mutation/assignments/removeAssignmentAttachment.ts

export const REMOVE_ASSIGNMENT_ATTACHMENT_MUTATION = `
  mutation RemoveAssignmentAttachment($input: RemoveAssignmentAttachmentInput!) {
    removeAssignmentAttachment(input: $input) {
      _id
      attachments
      updatedAt
    }
  }
`;
