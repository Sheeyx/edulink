import { gql } from "graphql-request";

export const CHECK_SOCIAL_ID_EXISTS = gql`
  query CheckSocialIdExists($input: CheckSocialUserInput!) {
    checkSocialIdExists(input: $input) {
      exists
      member {
        _id
        memberEmail
        memberFullName
        memberImage
        memberPhone
        memberAuthType
        memberType
        memberStatus
        createdAt
        updatedAt
      }
    }
  }
`;
