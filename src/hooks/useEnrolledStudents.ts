// src/hooks/useEnrolledStudents.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_MEMBER_BASIC } from "@/graphql/query/member/member";
import type { AttendanceMember } from "@/libs/types/attendance/attendance";

// getMember only fetches one member at a time (no batch query exists on the
// backend), so we fan out in parallel and merge the results.
export function useEnrolledStudents(memberIds: string[]) {
  const key = [...memberIds].sort().join(",");

  return useQuery({
    queryKey: ["enrolled-students", key],
    queryFn: async (): Promise<AttendanceMember[]> => {
      const results = await Promise.all(
        memberIds.map(async (id) => {
          try {
            const res = await gqlFetchAuth<{ getMember: AttendanceMember }>(
              GET_MEMBER_BASIC,
              { id }
            );
            return res.getMember;
          } catch {
            return { _id: id, memberFullName: "Unknown Student", memberImage: null };
          }
        })
      );
      return results;
    },
    enabled: memberIds.length > 0,
    staleTime: 60_000,
  });
}
