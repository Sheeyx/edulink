"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_MY_ATTENDANCE_STATS } from "@/graphql/query/attendance/attendance";
import type {
  AttendanceStatsFromApi,
  GetMyAttendanceStatsResp,
} from "@/libs/types/attendance/attendance";

export function useMyAttendanceStats(courseId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["my-attendance-stats", courseId],
    queryFn: async (): Promise<AttendanceStatsFromApi> => {
      const res = await gqlFetchAuth<GetMyAttendanceStatsResp>(GET_MY_ATTENDANCE_STATS, {
        input: courseId,
      });
      return res.getMyAttendanceStats;
    },
    enabled: enabled && !!courseId,
  });
}
