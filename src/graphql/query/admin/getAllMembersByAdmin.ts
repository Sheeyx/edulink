// src/graphql/query/admin/getAllMembersByAdmin.ts
export const GET_ALL_MEMBERS_BY_ADMIN = `
  query GetAllMembersByAdmin($input: UsersInquiry!) {
    getAllMembersByAdmin(input: $input) {
      list {
        _id
        memberRole
        memberStatus
        memberEmail
        memberPhone
        memberFullName
        memberImage
        memberBio
        createdAt
      }
      metaCounter {
        total
      }
    }
  }
`;

