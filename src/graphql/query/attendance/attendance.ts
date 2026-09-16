// src/graphql/query/attendance/attendance.ts

const ATTENDANCE_FIELDS = /* GraphQL */ `
  _id
  lessonId
  sectionId
  courseId
  studentId
  status
  attendanceDate
  notes
  mentorId
  createdAt
  updatedAt
`;

// Mentor: attendance records for a lesson (optionally scoped to a day via
// startDate/endDate) — used to pre-fill the "Take Attendance" roster.
export const GET_ATTENDANCES = /* GraphQL */ `
  query GetAttendances($input: AttendancesInquiry!) {
    getAttendances(input: $input) {
      list {
        ${ATTENDANCE_FIELDS}
        studentData {
          _id
          memberFullName
          memberImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

const ATTENDANCE_STATS_FIELDS = /* GraphQL */ `
  courseId
  courseName
  totalLessons
  presentCount
  absentCount
  lateCount
  excusedCount
  attendanceRate
`;

export const GET_ATTENDANCE_STATS = /* GraphQL */ `
  query GetAttendanceStats($input: AttendanceStatsInput!) {
    getAttendanceStats(input: $input) {
      ${ATTENDANCE_STATS_FIELDS}
    }
  }
`;

// Student: their own attendance stats for a course
export const GET_MY_ATTENDANCE_STATS = /* GraphQL */ `
  query GetMyAttendanceStats($input: String!) {
    getMyAttendanceStats(input: $input) {
      ${ATTENDANCE_STATS_FIELDS}
    }
  }
`;

// Student: their own attendance records
export const GET_MY_ATTENDANCES = /* GraphQL */ `
  query GetMyAttendances($input: AttendancesInquiry!) {
    getMyAttendances(input: $input) {
      list {
        ${ATTENDANCE_FIELDS}
      }
      metaCounter {
        total
      }
    }
  }
`;
