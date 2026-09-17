"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import {
  START_VIDEO,
  UPDATE_VIDEO_PROGRESS,
  COMPLETE_LESSON,
} from "@/graphql/mutation/videoProgress/videoProgress";

export type VideoProgress = {
  _id: string;
  memberId: string;
  lessonId: string;
  videoDuration: number;
  watchedTime: number;
  progressPercentage: number;
  isCompleted: boolean;
  readyToComplete: boolean;
  lastWatchedTime: number;
  createdAt: string;
  updatedAt: string;
};

type StartVideoResp = {
  startVideo: { resumeTime: number; progress: VideoProgress };
};
type UpdateVideoProgressResp = { updateVideoProgress: VideoProgress };
type CompleteLessonResp = { completeLesson: { success: boolean; message: string } };

// Only save at most this often — timeupdate fires several times a second,
// and the backend doesn't need per-frame granularity.
const SAVE_INTERVAL_MS = 5000;

export function useVideoProgress(courseId: string | undefined, lessonId: string | undefined) {
  const queryClient = useQueryClient();

  const [progress, setProgress] = React.useState<VideoProgress | null>(null);
  const [resumeTime, setResumeTime] = React.useState(0);
  const [starting, setStarting] = React.useState(false);

  // Tracks what we last sent to the server, so each save can report the
  // previous position (lastTime) and real elapsed wall-clock time — the
  // backend uses both to detect skipped/scrubbed sections.
  const lastSavedTimeRef = React.useRef(0);
  const lastSaveWallClockRef = React.useRef(Date.now());
  const pendingSaveRef = React.useRef(false);

  const invalidateCourseTree = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["user", "enrolledCourse", courseId] });
  }, [queryClient, courseId]);

  // Create (or fetch) the progress doc for this lesson and get the resume
  // position. Runs once per lesson.
  React.useEffect(() => {
    if (!lessonId) return;
    let cancelled = false;

    setProgress(null);
    setResumeTime(0);
    lastSavedTimeRef.current = 0;
    lastSaveWallClockRef.current = Date.now();

    (async () => {
      setStarting(true);
      try {
        const res = await gqlFetchAuth<StartVideoResp>(START_VIDEO, { input: lessonId });
        if (cancelled) return;
        setProgress(res.startVideo.progress);
        setResumeTime(res.startVideo.resumeTime || 0);
        lastSavedTimeRef.current = res.startVideo.resumeTime || 0;
      } catch (err) {
        console.error("[useVideoProgress] startVideo failed:", err);
      } finally {
        if (!cancelled) setStarting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  const saveProgress = React.useCallback(
    async (currentTime: number) => {
      if (!lessonId || pendingSaveRef.current) return;

      const now = Date.now();
      const realTimeDuration = Math.max(0, (now - lastSaveWallClockRef.current) / 1000);
      const lastTime = lastSavedTimeRef.current;

      lastSaveWallClockRef.current = now;
      lastSavedTimeRef.current = currentTime;
      pendingSaveRef.current = true;

      try {
        const res = await gqlFetchAuth<UpdateVideoProgressResp>(UPDATE_VIDEO_PROGRESS, {
          input: { lessonId, currentTime, lastTime, realTimeDuration },
        });
        setProgress(res.updateVideoProgress);
      } catch (err) {
        console.error("[useVideoProgress] updateVideoProgress failed:", err);
      } finally {
        pendingSaveRef.current = false;
      }
    },
    [lessonId]
  );

  // Throttled entry point for <video onTimeUpdate>.
  const lastCallRef = React.useRef(0);
  const reportTimeUpdate = React.useCallback(
    (currentTime: number) => {
      const now = Date.now();
      if (now - lastCallRef.current < SAVE_INTERVAL_MS) return;
      lastCallRef.current = now;
      void saveProgress(currentTime);
    },
    [saveProgress]
  );

  // Force an immediate save regardless of the throttle — used on pause,
  // seek-end, unmount, and before marking the lesson complete.
  const flush = React.useCallback(
    (currentTime: number) => {
      lastCallRef.current = Date.now();
      return saveProgress(currentTime);
    },
    [saveProgress]
  );

  const complete = React.useCallback(async () => {
    if (!lessonId) return null;
    try {
      const res = await gqlFetchAuth<CompleteLessonResp>(COMPLETE_LESSON, { input: lessonId });
      if (res.completeLesson.success) {
        setProgress((p) => (p ? { ...p, isCompleted: true, progressPercentage: 100 } : p));
        invalidateCourseTree();
      }
      return res.completeLesson;
    } catch (err) {
      console.error("[useVideoProgress] completeLesson failed:", err);
      return null;
    }
  }, [lessonId, invalidateCourseTree]);

  return { progress, resumeTime, starting, reportTimeUpdate, flush, complete };
}
