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

export type AdminMemberRole = "STUDENT" | "MENTOR" | "ADMIN";
export type AdminMemberStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETE";

export type AdminMember = {
  _id: string;
  memberRole: AdminMemberRole;
  memberStatus: AdminMemberStatus;
  memberEmail?: string | null;
  memberPhone?: string | null;
  memberFullName?: string | null;
  memberImage?: string | null;
  memberBio?: string | null;
  createdAt?: string | null;
};

export type AdminMembersResponse = {
  getAllMembersByAdmin: {
    list: AdminMember[];
    metaCounter: { total: number };
  };
};

export type UsersInquiryInput = {
  page: number;
  limit: number;
  search: {
    memberFullName?: string;
    memberEmail?: string;
    memberStatus?: string;
  };
};
