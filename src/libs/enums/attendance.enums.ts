// Backend AttendanceStatus enum (src/libs/enums/lesson.enums.ts)
export const ATTENDANCE_STATUS = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "EXCUSED",
] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[number];
