export type ToastKind = "success" | "error";

export type UpdateMemberResp = {
  updateMember: {
    _id: string;
    memberRole?: string | null;
    memberStatus?: string | null;
    memberAuth?: string | null;
    memberEmail?: string | null;
    memberPhone?: string | null;
    memberFullName?: string | null;
    memberImage?: string | null;
    memberBio?: string | null;

    accessToken?: string | null;
    refreshToken?: string | null;
    accessTokenExpiresIn?: number | null;
    refreshTokenExpiresIn?: number | null;

    createdAt?: string | null;
    updatedAt?: string | null;
  };
};
