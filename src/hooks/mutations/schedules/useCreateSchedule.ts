"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { CREATE_SCHEDULE } from "@/graphql/query/courses/courses";
import type { CourseScheduleStatus } from "@/libs/enums/course.enums";
import type { CreateScheduleResp, ScheduleFromApi } from "@/libs/types/course/types";

export type CreateScheduleValues = {
  courseId: string;
  lessonId?: string | null;
  startAt: string[];
  status?: CourseScheduleStatus;
  meetLinks?: string[];
};

export function useCreateSchedule() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const createSchedule = React.useCallback(
    async (values: CreateScheduleValues): Promise<ScheduleFromApi> => {
      try {
        setLoading(true);
        setError(null);

        const input = {
          courseId: values.courseId,
          lessonId: values.lessonId || undefined,
          startAt: values.startAt,
          status: values.status,
          meetLinks: values.meetLinks?.filter((l) => l.trim().length > 0),
        };

        const res = await gqlFetchAuth<CreateScheduleResp>(CREATE_SCHEDULE, { input });
        return res.createSchedule;
      } catch (err) {
        console.error("Create schedule error:", err);
        const msg = err instanceof Error ? err.message : "Failed to create schedule";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createSchedule, loading, error, setError };
}
