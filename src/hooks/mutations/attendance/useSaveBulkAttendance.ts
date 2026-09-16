// src/hooks/mutations/attendance/useSaveBulkAttendance.ts
"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { CREATE_BULK_ATTENDANCE } from "@/graphql/mutation/attendance/attendance";
import type {
  BulkAttendanceInput,
  CreateBulkAttendanceResp,
  AttendanceFromApi,
} from "@/libs/types/attendance/attendance";

export function useSaveBulkAttendance() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const saveBulkAttendance = React.useCallback(
    async (input: BulkAttendanceInput): Promise<AttendanceFromApi[]> => {
      try {
        setLoading(true);
        setError(null);

        const res = await gqlFetchAuth<CreateBulkAttendanceResp>(CREATE_BULK_ATTENDANCE, {
          input,
        });
        return res.createBulkAttendance?.list ?? [];
      } catch (err) {
        console.error("Save bulk attendance error:", err);
        const msg = err instanceof Error ? err.message : "Failed to save attendance";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { saveBulkAttendance, loading, error, setError };
}
