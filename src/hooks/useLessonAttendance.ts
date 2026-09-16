// src/hooks/useLessonAttendance.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_ATTENDANCES } from "@/graphql/query/attendance/attendance";
import type { AttendanceFromApi, GetAttendancesResp } from "@/libs/types/attendance/attendance";

function dayRange(dateStr: string): { startDate: string; endDate: string } {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateStr);
  end.setHours(23, 59, 59, 999);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

export function useLessonAttendance(lessonId: string | null, dateStr: string) {
  return useQuery({
    queryKey: ["lesson-attendance", lessonId, dateStr],
    queryFn: async (): Promise<AttendanceFromApi[]> => {
      const { startDate, endDate } = dayRange(dateStr);
      const res = await gqlFetchAuth<GetAttendancesResp>(GET_ATTENDANCES, {
        input: {
          page: 1,
          limit: 200,
          search: { lessonId, startDate, endDate },
        },
      });
      return res.getAttendances?.list ?? [];
    },
    enabled: !!lessonId && !!dateStr,
  });
}
