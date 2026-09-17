"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Lock,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  Captions,
  Search,
  Megaphone,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/providers/auth-context";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

import { useEnrolledCourse } from "./_hooks/useEnrolledCourse";
import { useMyAttendanceStats } from "./_hooks/useMyAttendanceStats";
import { useLiveSchedule } from "./_hooks/useLiveSchedule";
import { useVideoProgress } from "./_hooks/useVideoProgress";
import { computeProgress } from "./_utils/progress";
import DetailsSkeleton from "./_components/DetailsSkeleton";
import CourseDetailsHeader from "./_components/CourseDetailsHeader";
import NotFoundState from "./_components/NotFoundState";
import ErrorState from "../_components/ErrorState";
import CourseMeta from "./_components/CourseMeta";
import ModulesAccordion from "./_components/ModulesAccordion";
import CourseTabs, { type TabKey } from "./_components/CourseTabs";
import OverviewTab from "./_components/tabs/OverviewTab";
import LiveScheduleTab from "./_components/tabs/LiveScheduleTab";
import QATab from "./_components/tabs/QATab";
import NotesTab from "./_components/tabs/NotesTab";
import ReviewsTab from "./_components/tabs/ReviewsTab";
import ComingSoonTab from "./_components/tabs/ComingSoonTab";
import AttendanceStatsCard from "@/components/attendance/AttendanceStatsCard";

const SPLIT_TABS: TabKey[] = ["overview", "schedule", "qa", "notes", "announcements", "reviews", "tools"];
const THEATER_TABS: TabKey[] = [
  "content",
  "overview",
  "schedule",
  "qa",
  "notes",
  "announcements",
  "reviews",
  "tools",
];
const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// The "Join Live Class" button lights up starting this many minutes before
// a scheduled session, and keeps showing for a while after in case it's
// running (we have no explicit end time, so this is a reasonable ceiling
// for a typical live class length).
const JOIN_WINDOW_BEFORE_MIN = 15;
const JOIN_WINDOW_AFTER_MIN = 90;

function isValidUrlValue(v?: string | null) {
  if (!v) return false;
  const s = String(v).trim();
  if (!s) return false;
  if (s === "null" || s === "undefined") return false;
  return true;
}

function resolveMediaUrl(v?: string | null) {
  if (!v) return "";
  const s = v.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return buildDownloadUrl(s) || "";
}

export default function UserCourseDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const courseId = params?.id;

  const { user } = useAuth();

  const { data: course, isLoading, isError, error, refetch, isFetching } =
    useEnrolledCourse(courseId, !!user);

  const { data: attendanceStats, isLoading: attendanceStatsLoading } =
    useMyAttendanceStats(courseId, !!user && !!course);

  const { data: liveSchedules } = useLiveSchedule(courseId, !!user && !!course);

  // Re-check every 30s so the "Join Live Class" button appears/disappears on
  // its own as the clock crosses the 15-minute-before mark, with no refresh.
  const [clockTick, setClockTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setClockTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const liveJoinHref = React.useMemo(() => {
    if (!liveSchedules?.length) return null;
    const now = Date.now();

    for (const s of liveSchedules) {
      if (s.status !== "SCHEDULED" || !s.meetLinks?.[0]) continue;
      for (const startAt of s.startAt) {
        const diffMin = (new Date(startAt).getTime() - now) / 60_000;
        if (diffMin <= JOIN_WINDOW_BEFORE_MIN && diffMin >= -JOIN_WINDOW_AFTER_MIN) {
          return s.meetLinks[0];
        }
      }
    }
    return null;
    // clockTick is a deliberate re-evaluation trigger, not a real data dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveSchedules, clockTick]);

  const progress = React.useMemo(() => {
    if (!course) return { total: 0, available: 0, percent: 0, firstLessonId: null as string | null };
    return computeProgress(course);
  }, [course]);

  const allLessons = React.useMemo(() => {
    const sections = [...(course?.sectionsWithLessons || [])].sort(
      (a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0)
    );
    return sections.flatMap((s) => s.lessons || []);
  }, [course]);

  // Which lesson is currently playing — plain component state, so opening a
  // lesson never navigates away from this page.
  const [activeLessonId, setActiveLessonId] = React.useState<string | null>(null);
  const [theaterMode, setTheaterMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabKey>("overview");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [contentSearch, setContentSearch] = React.useState("");
  const [playbackRate, setPlaybackRate] = React.useState(1);

  // Once the course loads, default to the resume/first lesson so the player
  // always has something to show (Udemy-style — never a blank landing state).
  const autoSelectedRef = React.useRef(false);
  React.useEffect(() => {
    if (autoSelectedRef.current || !course) return;
    if (progress.firstLessonId) {
      autoSelectedRef.current = true;
      setActiveLessonId(progress.firstLessonId);
    }
  }, [course, progress.firstLessonId]);

  // Theater mode defaults to the "Course content" tab per spec; leaving it
  // jumps back to Overview if content isn't a valid tab there.
  React.useEffect(() => {
    if (theaterMode) setActiveTab("content");
    else if (activeTab === "content") setActiveTab("overview");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theaterMode]);

  const activeLesson = React.useMemo(
    () => allLessons.find((l) => l._id === activeLessonId) || null,
    [allLessons, activeLessonId]
  );

  const currentIdx = React.useMemo(
    () => allLessons.findIndex((l) => l._id === activeLessonId),
    [allLessons, activeLessonId]
  );
  const prevLesson = React.useMemo(
    () => [...allLessons.slice(0, currentIdx)].reverse().find((l) => !l.isLocked && isValidUrlValue(l.lessonUrl)) || null,
    [allLessons, currentIdx]
  );
  const nextLesson = React.useMemo(
    () => allLessons.slice(currentIdx + 1).find((l) => !l.isLocked && isValidUrlValue(l.lessonUrl)) || null,
    [allLessons, currentIdx]
  );

  const selectLesson = React.useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
  }, []);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const {
    progress: videoProgress,
    resumeTime,
    reportTimeUpdate,
    flush,
    complete,
  } = useVideoProgress(courseId, activeLessonId || undefined);

  const completedRef = React.useRef(false);
  React.useEffect(() => {
    completedRef.current = false;
  }, [activeLessonId]);

  // Flush the last known playback position when switching lessons or leaving
  // the page, so a partial watch isn't lost.
  React.useEffect(() => {
    const el = videoRef.current;
    return () => {
      if (el && el.currentTime > 0) void flush(el.currentTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLessonId]);

  const videoSrc = resolveMediaUrl(activeLesson?.lessonUrl);

  // Re-apply the chosen speed whenever the <video> element remounts (it's
  // keyed by src, so a lesson change loses any prior playbackRate).
  React.useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate, videoSrc]);

  const handleLoadedMetadata = React.useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (resumeTime > 1 && resumeTime < el.duration - 2) {
      el.currentTime = resumeTime;
    }
  }, [resumeTime]);

  const handleTimeUpdate = React.useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      reportTimeUpdate(e.currentTarget.currentTime);
    },
    [reportTimeUpdate]
  );

  const handlePause = React.useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      void flush(e.currentTarget.currentTime);
    },
    [flush]
  );

  const handleEnded = React.useCallback(
    async (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (completedRef.current) return;
      completedRef.current = true;
      await flush(e.currentTarget.currentTime);
      await complete();
      if (nextLesson) selectLesson(nextLesson._id);
    },
    [flush, complete, nextLesson, selectLesson]
  );

  if (isLoading) return <DetailsSkeleton />;

  if (isError) {
    return (
      <div className="space-y-4">
        <CourseDetailsHeader
          title="Course details"
          subtitle="Something went wrong."
          onBack={() => router.push("/user/courses")}
          onRefresh={() => refetch()}
          refreshing={isFetching}
          onContinue={null}
        />
        <ErrorState
          message={error instanceof Error ? error.message : "Unknown error"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!course) {
    return (
      <NotFoundState
        onBack={() => router.push("/user/courses")}
        onGoExplore={() => router.push("/user/explore")}
      />
    );
  }

  const toggleTheater = () => setTheaterMode((v) => !v);

  return (
    <div className="space-y-6">
      <CourseDetailsHeader
        title={course.courseTitle}
        subtitle={course.courseDesc || "Course details and lessons."}
        onBack={() => router.push("/user/courses")}
        onRefresh={() => refetch()}
        refreshing={isFetching}
        onContinue={
          progress.firstLessonId && progress.firstLessonId !== activeLessonId
            ? () => selectLesson(progress.firstLessonId!)
            : null
        }
        liveJoinHref={liveJoinHref}
      />

      {activeLesson ? (
        <div className={theaterMode ? "space-y-4" : "grid gap-4 lg:grid-cols-[7fr_3fr]"}>
          {/* Left column: video, tabs, course summary */}
          <div className="space-y-4 min-w-0">
            <div className="rounded-3xl overflow-hidden border border-gray-100 bg-black shadow-[0_16px_45px_rgba(0,0,0,0.12)]">
              <div className="relative w-full aspect-video bg-black group">
                {activeLesson.isLocked ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80 px-6 text-center">
                    <Lock className="w-8 h-8" />
                    <div>This lesson is locked.</div>
                  </div>
                ) : videoSrc ? (
                  <>
                    <video
                      key={videoSrc}
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full"
                      controls
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                      autoPlay
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={handleLoadedMetadata}
                      onTimeUpdate={handleTimeUpdate}
                      onPause={handlePause}
                      onEnded={handleEnded}
                    >
                      <source src={videoSrc} />
                    </video>

                    {/* Custom overlay controls: prev/next lesson, speed, captions toggle */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3 bg-gradient-to-b from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition">
                      <div className="pointer-events-auto flex items-center gap-1.5">
                        <button
                          onClick={() => prevLesson && selectLesson(prevLesson._id)}
                          disabled={!prevLesson}
                          title="Previous lesson"
                          className="rounded-lg bg-black/40 p-2 text-white hover:bg-black/60 disabled:opacity-30 disabled:hover:bg-black/40 transition"
                        >
                          <SkipBack className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => nextLesson && selectLesson(nextLesson._id)}
                          disabled={!nextLesson}
                          title="Next lesson"
                          className="rounded-lg bg-black/40 p-2 text-white hover:bg-black/60 disabled:opacity-30 disabled:hover:bg-black/40 transition"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="pointer-events-auto flex items-center gap-1.5">
                        <select
                          value={playbackRate}
                          onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                          title="Playback speed"
                          className="rounded-lg bg-black/40 text-white text-xs font-bold px-2 py-2 outline-none [&>option]:text-black"
                        >
                          {PLAYBACK_RATES.map((r) => (
                            <option key={r} value={r}>
                              {r}x
                            </option>
                          ))}
                        </select>
                        <button
                          disabled
                          title="Captions aren't available for this lesson yet"
                          className="rounded-lg bg-black/40 p-2 text-white/40 cursor-not-allowed"
                        >
                          <Captions className="w-4 h-4" />
                        </button>
                        <button
                          onClick={toggleTheater}
                          title={theaterMode ? "Exit theater mode" : "Theater mode"}
                          className="rounded-lg bg-black/40 p-2 text-white hover:bg-black/60 transition"
                        >
                          {theaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-white/80 px-6 text-center">
                    No video URL for this lesson.
                  </div>
                )}
              </div>

              <div className="bg-white px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-black text-gray-900 truncate">
                      {activeLesson.lessonTitle}
                    </div>
                  </div>

                  {videoProgress?.isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-success/10 px-3 py-1 text-xs font-bold text-brand-success shrink-0">
                      <CheckCircle2 className="h-4 w-4" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 shrink-0">
                      {Math.round(videoProgress?.progressPercentage ?? 0)}% watched
                    </span>
                  )}
                </div>

                {!videoProgress?.isCompleted && (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand-primary transition-all"
                      style={{ width: `${Math.min(100, videoProgress?.progressPercentage ?? 0)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tab navigation + panel */}
            <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_10px_35px_rgba(251,133,0,0.08)] overflow-hidden">
              <CourseTabs
                tabs={theaterMode ? THEATER_TABS : SPLIT_TABS}
                active={activeTab}
                onChange={setActiveTab}
                searchOpen={searchOpen}
                onSearchToggle={() => setSearchOpen((v) => !v)}
              />

              {searchOpen && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={contentSearch}
                      onChange={(e) => setContentSearch(e.target.value)}
                      placeholder="Search course content"
                      autoFocus
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-primary/25"
                    />
                  </div>
                </div>
              )}

              {activeTab === "content" && theaterMode && (
                <div className="p-4">
                  <ModulesAccordion
                    course={course}
                    activeLessonId={activeLessonId}
                    onSelectLesson={selectLesson}
                    searchQuery={contentSearch}
                    bare
                  />
                </div>
              )}
              {activeTab === "overview" && <OverviewTab course={course} />}
              {activeTab === "schedule" && <LiveScheduleTab courseId={course._id} />}
              {activeTab === "qa" && <QATab courseId={course._id} />}
              {activeTab === "notes" && (
                <NotesTab lessonId={activeLesson._id} lessonTitle={activeLesson.lessonTitle} />
              )}
              {activeTab === "announcements" && (
                <ComingSoonTab
                  icon={Megaphone}
                  title="No announcements yet"
                  description="Your instructor hasn't posted any announcements for this course."
                />
              )}
              {activeTab === "reviews" && <ReviewsTab course={course} />}
              {activeTab === "tools" && (
                <ComingSoonTab
                  icon={Wrench}
                  title="Learning tools coming soon"
                  description="Practice exercises and extra learning tools for this course aren't available yet."
                />
              )}
            </div>

            <CourseMeta course={course} progress={progress} />
          </div>

          {/* Right sidebar — collapses into the "Course content" tab in theater mode */}
          {!theaterMode && (
            <ModulesAccordion
              course={course}
              activeLessonId={activeLessonId}
              onSelectLesson={selectLesson}
              searchQuery={searchOpen ? contentSearch : ""}
              theaterMode={theaterMode}
              onToggleTheater={toggleTheater}
            />
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center text-gray-600">
          No lessons available yet.
        </div>
      )}

      <AttendanceStatsCard
        stats={attendanceStats}
        loading={attendanceStatsLoading}
        title="My Attendance"
      />
    </div>
  );
}
