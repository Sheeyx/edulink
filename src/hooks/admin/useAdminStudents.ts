import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import {
  GET_ALL_MEMBERS_BY_ADMIN,
  type AdminMembersResponse,
  type UsersInquiryInput,
} from "@/graphql/query/admin/getAllMembersByAdmin";
import { useAuth } from "@/providers/auth-context";

export function useAdminStudents({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["admin-students", page, limit, search, status, user?.role],

    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      // 🔒 Only ADMIN can call this
      if (user.role !== "ADMIN") {
        throw new Error("Access denied: Only ADMIN can view members.");
      }

      // ✅ ALWAYS send `search` (UISearch!)
      const input: UsersInquiryInput = {
        page,
        limit,
        search: {},
      };

      // 🔍 Search by name/email (optional – adapt to your UISearch fields)
      const trimmed = search?.trim();
      if (trimmed) {
        input.search.memberFullName = trimmed;
        input.search.memberEmail = trimmed;
      }

      // 🎯 Filter by status
      if (status && status !== "ALL") {
        input.search.memberStatus = status;
      }

      // Example payload now:
      // {
      //   page: 1,
      //   limit: 10,
      //   search: {
      //     memberRole: "STUDENT",
      //     memberFullName: "emma",   // only if search is filled
      //     memberEmail: "emma",      // only if search is filled
      //     memberStatus: "ACTIVE"    // only if status filter
      //   }
      // }

      const data = await gqlFetchAuth<AdminMembersResponse>(GET_ALL_MEMBERS_BY_ADMIN, { input });

      return data.getAllMembersByAdmin;
    },

    // don’t even try the query until we know user is admin
    enabled: user?.role === "ADMIN",
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
