import { fetchGraphQL } from "@/graphql/client/fetchGraphQL";
import { MemberUpdateInput, UpdateMemberResult } from "@/libs/types/member/types";
import { UPDATE_MEMBER } from "../mutation/member/mutations";

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

export async function updateMember(input: MemberUpdateInput, accessToken?: string) {
  if (!accessToken) throw new Error("Missing access token. Please sign in again.");
  return fetchGraphQL<UpdateMemberResult>(GRAPHQL_ENDPOINT, UPDATE_MEMBER, { input }, accessToken);
}
