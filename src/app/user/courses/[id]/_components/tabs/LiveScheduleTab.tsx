"use client";

import { CalendarClock, Video, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { useLiveSchedule } from "../../_hooks/useLiveSchedule";
import type { ScheduleUI } from "@/libs/types/course/types";

function formatSessionTime(iso?: string) {
  if (!iso) return "Time TBA";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Time TBA";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: ScheduleUI["status"] }) {
  if (status === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">
        <CheckCircle2 className="w-3 h-3" /> Completed
      </span>
    );
  }
  if (status === "CANCELLED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
        <XCircle className="w-3 h-3" /> Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-success/10 px-2 py-0.5 text-[11px] font-bold text-brand-success">
      Scheduled
    </span>
  );
}

function SessionCard({ schedule, nextStartAt }: { schedule: ScheduleUI; nextStartAt?: string }) {
  const canJoin = schedule.status === "SCHEDULED" && !!schedule.meetLinks?.[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl border border-gray-200 bg-gray-50 grid place-items-center shrink-0">
          <CalendarClock className="w-5 h-5 text-gray-500" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-extrabold text-gray-900">{formatSessionTime(nextStartAt)}</div>
            <StatusBadge status={schedule.status} />
          </div>
          {schedule.startAt.length > 1 && (
            <div className="mt-0.5 text-xs text-gray-500">
              {schedule.startAt.length} sessions in this series
            </div>
          )}
        </div>
      </div>

      {canJoin ? (
        <a
          href={schedule.meetLinks[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-selected text-white px-4 py-2 text-sm font-extrabold hover:brightness-90 transition shrink-0"
        >
          <Video className="w-4 h-4" />
          Join
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : (
        <span className="text-xs font-bold text-gray-400 shrink-0">No link yet</span>
      )}
    </div>
  );
}

export default function LiveScheduleTab({ courseId }: { courseId: string }) {
  const { data: schedules, isLoading, isError } = useLiveSchedule(courseId, true);

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading live schedule...</div>;
  }

  if (isError) {
    return <div className="p-6 text-sm text-red-600">Failed to load the live schedule.</div>;
  }

  if (!schedules?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 px-6 text-center text-gray-400">
        <CalendarClock className="w-8 h-8" />
        <div className="text-sm font-bold text-gray-600">No live sessions scheduled yet</div>
        <div className="text-xs max-w-sm">
          Your instructor hasn&apos;t scheduled any live classes for this course yet — check back later.
        </div>
      </div>
    );
  }

  const now = Date.now();

  const withNextTime = schedules.map((s) => {
    const upcoming = s.startAt.find((t) => new Date(t).getTime() >= now);
    return { schedule: s, nextStartAt: upcoming ?? s.startAt[s.startAt.length - 1] };
  });

  const upcoming = withNextTime
    .filter(({ schedule, nextStartAt }) => schedule.status === "SCHEDULED" && new Date(nextStartAt).getTime() >= now)
    .sort((a, b) => new Date(a.nextStartAt).getTime() - new Date(b.nextStartAt).getTime());

  const past = withNextTime
    .filter((x) => !upcoming.includes(x))
    .sort((a, b) => new Date(b.nextStartAt).getTime() - new Date(a.nextStartAt).getTime());

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-base font-black text-gray-900 mb-3">Upcoming live sessions</h3>
        {upcoming.length === 0 ? (
          <div className="text-sm text-gray-500">No upcoming sessions right now.</div>
        ) : (
          <div className="space-y-2">
            {upcoming.map(({ schedule, nextStartAt }) => (
              <SessionCard key={schedule.id} schedule={schedule} nextStartAt={nextStartAt} />
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <h3 className="text-base font-black text-gray-900 mb-3">Past sessions</h3>
          <div className="space-y-2">
            {past.map(({ schedule, nextStartAt }) => (
              <SessionCard key={schedule.id} schedule={schedule} nextStartAt={nextStartAt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
