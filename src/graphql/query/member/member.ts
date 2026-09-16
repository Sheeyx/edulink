// src/graphql/query/member/member.ts

export const GET_MEMBER_BASIC = /* GraphQL */ `
  query GetMemberBasic($id: String!) {
    getMember(memberId: $id) {
      _id
      memberFullName
      memberImage
    }
  }
`;
