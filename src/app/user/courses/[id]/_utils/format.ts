/** Formats a duration given in seconds as "1h 12min" / "45min", Udemy-style. */
export function formatDurationSeconds(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "0min";
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  return `${minutes}min`;
}

/**
 * Lesson duration is stored inconsistently (string | number, sometimes
 * already "12min", sometimes raw seconds) — normalize to seconds for math,
 * falling back to 0 when it can't be parsed.
 */
export function lessonDurationSeconds(d?: string | number | null): number {
  if (d === null || d === undefined) return 0;
  const n = typeof d === "number" ? d : parseFloat(d);
  return Number.isFinite(n) ? n : 0;
}

/** "3 days ago" / "2h ago" / "just now" style relative timestamp. */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffSec = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.round(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${Math.round(diffMonth / 12)}y ago`;
}
