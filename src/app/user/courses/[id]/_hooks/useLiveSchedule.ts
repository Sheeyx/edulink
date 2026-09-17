"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_SCHEDULES } from "@/graphql/query/courses/courses";
import type { GetSchedulesResp, ScheduleUI } from "@/libs/types/course/types";

const SCHEDULES_PAGE_LIMIT = 50;

export function useLiveSchedule(courseId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["user", "liveSchedule", courseId],
    queryFn: async (): Promise<ScheduleUI[]> => {
      const resp = await gqlFetchAuth<GetSchedulesResp>(GET_SCHEDULES, {
        input: { page: 1, limit: SCHEDULES_PAGE_LIMIT, courseId },
      });

      const list = resp.getSchedules?.list ?? [];

      return list
        .map((s) => ({
          id: s._id,
          courseId: s.courseId,
          lessonId: s.lessonId ?? null,
          startAt: s.startAt ?? [],
          status: s.status,
          meetLinks: s.meetLinks ?? [],
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        }))
        .sort((a, b) => {
          const aFirst = a.startAt[0] ? new Date(a.startAt[0]).getTime() : 0;
          const bFirst = b.startAt[0] ? new Date(b.startAt[0]).getTime() : 0;
          return aFirst - bFirst;
        });
    },
    enabled: enabled && !!courseId,
    staleTime: 30_000,
  });
}
