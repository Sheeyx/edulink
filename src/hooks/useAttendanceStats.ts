// src/hooks/useAttendanceStats.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_ATTENDANCE_STATS } from "@/graphql/query/attendance/attendance";
import type { AttendanceStatsFromApi, GetAttendanceStatsResp } from "@/libs/types/attendance/attendance";

export function useAttendanceStats(courseId: string) {
  return useQuery({
    queryKey: ["attendance-stats", courseId],
    queryFn: async (): Promise<AttendanceStatsFromApi> => {
      const res = await gqlFetchAuth<GetAttendanceStatsResp>(GET_ATTENDANCE_STATS, {
        input: { courseId },
      });
      return res.getAttendanceStats;
    },
    enabled: !!courseId,
  });
}
