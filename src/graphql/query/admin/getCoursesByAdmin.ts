// src/graphql/query/courses/adminCourses.ts

/* ===== Enums / Types (frontend side) ===== */

export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type LanguageType = "KOREAN" | "ENGLISH" | "RUSSIAN" | "UZBEK";

export type CourseItem = {
  _id: string;
  courseTitle: string;
  courseDesc: string;
  courseCategory: string;
  languageType: LanguageType;
  courseLevel: string;
  coursePrice: number;
  courseStatus: CourseStatus;
  mentorId: string;
  courseEnrolledMembers: number;
  courseTotalModules: number;
  courseTotalLessons: number;
  courseRating: number;
  courseLikes: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CoursesInquirySearch = {
  languageType?: LanguageType;
  courseStatus?: CourseStatus;
  courseTitle?: string;
};

export type CoursesInquiryInput = {
  page?: number;
  limit?: number;
  search?: CoursesInquirySearch;
};

export type AdminCoursesResponse = {
  getAllCoursesByAdmin: {
    list: CourseItem[];
    metaCounter: {
      total: number;
    };
  };
};

/* ===== GQL query ===== */

export const ADMIN_GET_COURSES = /* GraphQL */ `
  query GetAllCoursesByAdmin($input: CoursesInquiry!) {
    getAllCoursesByAdmin(input: $input) {
      list {
        _id
        courseTitle
        courseDesc
        courseCategory
        languageType
        courseLevel
        coursePrice
        courseStatus
        mentorId
        courseEnrolledMembers
        courseTotalModules
        courseTotalLessons
        courseRating
        courseLikes
        deletedAt
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;
