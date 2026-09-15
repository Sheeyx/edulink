// src/hooks/useCourseSchedules.ts
"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_SCHEDULES, REMOVE_SCHEDULE } from "@/graphql/query/courses/courses";
import { GetSchedulesResp, RemoveScheduleResp, ScheduleUI } from "@/libs/types/course/types";

// Backend's getSchedules has no courseId filter, so we page through the
// mentor's schedules and filter by courseId on the client.
const SCHEDULES_PAGE_LIMIT = 200;

export function useCourseSchedules(courseId: string) {
  const [schedules, setSchedules] = React.useState<ScheduleUI[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSchedules = React.useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);

      const resp = await gqlFetchAuth<GetSchedulesResp>(GET_SCHEDULES, {
        input: { page: 1, limit: SCHEDULES_PAGE_LIMIT },
      });

      const list = resp.getSchedules?.list ?? [];

      const mapped: ScheduleUI[] = list
        .filter((s) => s.courseId === courseId)
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

      setSchedules(mapped);
    } catch (err) {
      console.error("[useCourseSchedules] error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch schedule.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const removeScheduleById = React.useCallback(async (scheduleId: string) => {
    await gqlFetchAuth<RemoveScheduleResp>(REMOVE_SCHEDULE, { input: scheduleId });
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
  }, []);

  React.useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    removeScheduleById,
    reload: fetchSchedules,
  };
}
