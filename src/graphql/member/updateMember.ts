import { gqlFetchAuth } from "@/libs/graphql";
import { MemberUpdateInput, UpdateMemberResult } from "@/libs/types/member/types";
import { UPDATE_MEMBER } from "../mutation/member/mutations";

export async function updateMember(input: MemberUpdateInput, accessToken?: string) {
  return gqlFetchAuth<UpdateMemberResult>(UPDATE_MEMBER, { input }, accessToken);
}
