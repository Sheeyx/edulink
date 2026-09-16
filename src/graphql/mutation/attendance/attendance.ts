// src/graphql/mutation/attendance/attendance.ts

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

export const CREATE_ATTENDANCE = /* GraphQL */ `
  mutation CreateAttendance($input: AttendanceInput!) {
    createAttendance(input: $input) {
      ${ATTENDANCE_FIELDS}
    }
  }
`;

export const CREATE_BULK_ATTENDANCE = /* GraphQL */ `
  mutation CreateBulkAttendance($input: BulkAttendanceInput!) {
    createBulkAttendance(input: $input) {
      list {
        ${ATTENDANCE_FIELDS}
      }
      metaCounter {
        total
      }
    }
  }
`;

export const UPDATE_ATTENDANCE = /* GraphQL */ `
  mutation UpdateAttendance($input: AttendanceUpdate!) {
    updateAttendance(input: $input) {
      ${ATTENDANCE_FIELDS}
    }
  }
`;

export const DELETE_ATTENDANCE = /* GraphQL */ `
  mutation DeleteAttendance($input: String!) {
    deleteAttendance(attendanceId: $input) {
      _id
    }
  }
`;
