// src/libs/types/member/types.ts
export type MemberUpdateInput = {
  // adjust to your backend’s exact shape
  _id: string;                    // required target user id
  memberFullName?: string;
  memberPhone?: string;
  memberBio?: string;
  memberImage?: string;           // URL after upload
  // add any other updatable fields here
};

export type Member = {
  _id: string;
  memberRole: string;
  memberStatus: string;
  memberAuth: string;
  memberEmail: string;
  memberPhone?: string | null;
  memberFullName?: string | null;
  memberImage?: string | null;
  memberBio?: string | null;
  memberPoints: number;
  memberRank?: string | null;
  memberLikes: number;
  memberCoursesCompleted: number;
  createdAt: string;
  updatedAt: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresIn?: number | null;
  refreshTokenExpiresIn?: number | null;
  memberMedals: Array<{ medalType: string; awardedAt: string }>;
};

export type UpdateMemberResult = { updateMember: Member };
