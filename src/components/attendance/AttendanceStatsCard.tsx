"use client";

import type { AttendanceStatsFromApi } from "@/libs/types/attendance/attendance";

type Props = {
  stats: AttendanceStatsFromApi | undefined;
  loading?: boolean;
  title?: string;
};

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-100">
      <span className={`text-lg font-extrabold ${className ?? "text-gray-900"}`}>
        {value}
      </span>
      <span className="text-[11px] text-slate-500">{label}</span>
    </div>
  );
}

export default function AttendanceStatsCard({ stats, loading, title }: Props) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight lg:text-lg">
          {title ?? "Attendance"}
        </h3>
        {stats && (
          <span className="text-xs text-slate-500">
            {stats.totalLessons} lesson{stats.totalLessons === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {loading || !stats ? (
        <div className="h-16 animate-pulse rounded-xl bg-slate-50" />
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Stat
            label="Rate"
            value={`${stats.attendanceRate}%`}
            className="text-brand-selected"
          />
          <Stat label="Present" value={stats.presentCount} className="text-emerald-700" />
          <Stat label="Late" value={stats.lateCount} className="text-amber-700" />
          <Stat label="Absent" value={stats.absentCount} className="text-rose-600" />
          <Stat label="Excused" value={stats.excusedCount} className="text-sky-700" />
        </div>
      )}
    </section>
  );
}
