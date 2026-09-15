"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { UPDATE_SCHEDULE } from "@/graphql/query/courses/courses";
import type { CourseScheduleStatus } from "@/libs/enums/course.enums";
import type { UpdateScheduleResp, ScheduleFromApi } from "@/libs/types/course/types";

export type UpdateScheduleValues = {
  _id: string;
  lessonId?: string | null;
  startAt: string[];
  status: CourseScheduleStatus;
  meetLinks?: string[];
};

export function useUpdateSchedule() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const updateSchedule = React.useCallback(
    async (values: UpdateScheduleValues): Promise<ScheduleFromApi> => {
      try {
        setLoading(true);
        setError(null);

        const input = {
          _id: values._id,
          lessonId: values.lessonId || undefined,
          startAt: values.startAt,
          status: values.status,
          meetLinks: values.meetLinks?.filter((l) => l.trim().length > 0),
        };

        const res = await gqlFetchAuth<UpdateScheduleResp>(UPDATE_SCHEDULE, { input });
        return res.updateSchedule;
      } catch (err) {
        console.error("Update schedule error:", err);
        const msg = err instanceof Error ? err.message : "Failed to update schedule";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateSchedule, loading, error, setError };
}
