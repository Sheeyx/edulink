import { gqlFetchAuth } from "@/libs/graphql";
import { MemberUpdateInput, UpdateMemberResult } from "@/libs/types/member/types";
import { UPDATE_MEMBER } from "../mutation/member/mutations";

export async function updateMember(input: MemberUpdateInput, accessToken?: string) {
  if (!accessToken) throw new Error("Missing access token. Please sign in again.");
  return gqlFetchAuth<UpdateMemberResult>(UPDATE_MEMBER, { input }, accessToken);
}
