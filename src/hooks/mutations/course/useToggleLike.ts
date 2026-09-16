// src/hooks/mutations/course/useToggleLike.ts
"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { LIKE_TARGET_COURSE } from "@/graphql/mutation/course/likeCourse";

type LikeTargetCourseResp = {
  likeTargetCourse: { _id: string; courseLikes: number };
};

export function useToggleLike() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggleLike = React.useCallback(
    async (courseId: string): Promise<number> => {
      try {
        setLoading(true);
        setError(null);

        const res = await gqlFetchAuth<LikeTargetCourseResp>(LIKE_TARGET_COURSE, {
          input: courseId,
        });

        await queryClient.invalidateQueries({ queryKey: ["favorite-course-ids"] });
        await queryClient.invalidateQueries({ queryKey: ["my-favorites"] });

        return res.likeTargetCourse.courseLikes;
      } catch (err) {
        console.error("Toggle like error:", err);
        const msg = err instanceof Error ? err.message : "Failed to update favorite";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [queryClient]
  );

  return { toggleLike, loading, error, setError };
}
