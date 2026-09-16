import type { AttendanceStatus } from "@/libs/enums/attendance.enums";

export type AttendanceMember = {
  _id: string;
  memberFullName?: string | null;
  memberImage?: string | null;
};

export type AttendanceFromApi = {
  _id: string;
  lessonId: string;
  sectionId: string;
  courseId: string;
  studentId: string;
  status: AttendanceStatus;
  attendanceDate: string;
  notes?: string | null;
  mentorId: string;
  createdAt: string;
  updatedAt: string;
  studentData?: AttendanceMember | null;
};

export type StudentAttendanceInput = {
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
};

export type BulkAttendanceInput = {
  lessonId: string;
  sectionId: string;
  courseId: string;
  attendanceDate: string;
  attendances: StudentAttendanceInput[];
};

export type UpdateAttendanceInput = {
  _id: string;
  status?: AttendanceStatus;
  notes?: string;
};

export type GetAttendancesResp = {
  getAttendances: {
    list: AttendanceFromApi[];
    metaCounter: { total: number }[];
  };
};

export type CreateBulkAttendanceResp = {
  createBulkAttendance: {
    list: AttendanceFromApi[];
    metaCounter: { total: number }[];
  };
};

export type UpdateAttendanceResp = { updateAttendance: AttendanceFromApi };
export type DeleteAttendanceResp = { deleteAttendance: { _id: string } | null };

export type AttendanceStatsFromApi = {
  courseId: string;
  courseName: string;
  totalLessons: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
};

export type GetAttendanceStatsResp = { getAttendanceStats: AttendanceStatsFromApi };
export type GetMyAttendanceStatsResp = { getMyAttendanceStats: AttendanceStatsFromApi };

// ---- UI roster row for the "Take Attendance" sheet ----
export type AttendanceRosterRow = {
  studentId: string;
  studentName: string;
  studentImage?: string | null;
  status: AttendanceStatus;
  notes: string;
  existingAttendanceId?: string;
};
