import { CourseCategory, CourseLevel, LanguageType } from "@/libs/enums/course.enums";

export type SectionStatus = "ACTIVE" | "INACTIVE" | "DELETED";

/* ========= Raw GraphQL types ========= */

export type Lesson = {
  _id: string;
  sectionId: string;
  lessonTitle?: string;
  lessonContentType?: string;
  lessonDuration?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type Section = {
  _id: string;
  courseId: string;

  // new: status comes from backend for GetSectionsByCourse
  sectionStatus?: SectionStatus | string | null;

  moduleTitle?: string;
  moduleOrder?: number;
  totalLessons?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  lessons?: Lesson[];
};

export type Member = {
  _id: string;
  memberFullName?: string;
  memberImage?: string;
  memberBio?: string;
};

export type Course = {
  _id: string;
  courseTitle: string;
  courseDesc?: string;
  courseCategory?: string;
  languageType?: string;
  courseLevel?: string;
  coursePrice?: number;
  courseStatus?: string;
  courseEnrolledMembers?: number;
  courseTotalModules?: number;
  courseTotalLessons?: number;
  courseRating?: number;
  courseLikes?: number;
  createdAt: string;
  updatedAt: string;

  // from getCourse
  sectionsWithLessons: Section[];

  memberData?: Member;
};

/* ========= GraphQL response shapes ========= */

// getCourse
export type GetCourseResponse = {
  getCourse: Course | null;
};

// getSectionsByCourse
export type GetSectionsByCourseResponse = {
  getSectionsByCourse: {
    list: Section[];
    metaCounter: {
      total: number;
    };
  };
};

/* ========= UI-safe types (legacy USection – optional) ========= */

export type USection = {
  id: string;                // use id instead of _id in UI
  title: string;
  order?: number;
  lessons?: LessonUI[];
  status?: SectionStatus;
};

/* ========= Types from app/mentor/courses/libs/courseTypes.ts ========= */

export type SectionFromApi = {
  _id: string;
  courseId: string;
  sectionStatus?: SectionStatus | null;
  moduleTitle: string;
  moduleOrder: number;
  totalLessons: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  lessons: Lesson[];
};

export type SectionsByCourseResp = {
  getSectionsByCourse: {
    list: SectionFromApi[];
    metaCounter: { total: number };
  };
};

export type CourseStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "SUSPENDED"
  | "COMPLETED"
  | "PROGRESS";

export type CourseFromApi = {
  courseImage: null;
  _id: string;
  courseTitle: string;
  courseDesc: string;
  courseCategory: string;
  languageType: string;
  courseLevel: string;
  coursePrice: number;
  courseStatus: CourseStatus;
  mentorId: string;
  courseEnrolledMembers?: number | null;
  courseTotalModules?: number | null;
  courseTotalLessons?: number | null;
  courseRating?: number | null;
  courseLikes?: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sectionsWithLessons?: SectionFromApi[];
  memberData?: {
    _id: string;
    memberFullName?: string | null;
    memberImage?: string | null;
    memberBio?: string | null;
  } | null;
};

export type GetCourseResp = { getCourse: CourseFromApi };

export type RemoveSectionResp = {
  removeSection: {
    _id: string;
  } | null;
};

export type FormState = {
  courseTitle: string;
  courseDesc: string;
  courseImage: string;        // optional
  courseCategory: CourseCategory;
  languageType: LanguageType;
  courseLevel: CourseLevel;
  coursePrice: string;        // string in UI; convert on submit
  maxStudents: string;        // string in UI; convert on submit
  courseStartDate: string;    // yyyy-mm-dd; convert to ISO on submit
};

/* ========= FINAL UI TYPES (for components, hooks) ========= */

// ---- UI lesson type ---------------------------------------
export type LessonUI = {
  id: string;                 // UI-friendly id
  title: string;
  duration?: string;
  contentType?: string;
};

// alias if some older code uses ULesson
export type ULesson = LessonUI;

// ---- UI section type --------------------------------------
export type SectionUI = {
  id: string;
  title: string;
  order: number;
  lessonsCount: number;
  status?: SectionStatus;
  lessons?: LessonUI[];       // lessons displayed inside accordion
};

// ---- UI course type ---------------------------------------
export type CourseUI = {
  image: string | null;
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  modules: number;            // number of sections
  lessons: number;            // number of lessons
  rating: number;
  price: number;
  currency: string;
  sections: SectionUI[];
};

// src/libs/types/course/types.ts

export type UpdateLessonInput = {
  _id: string;                   // 👈 MUST be "_id"
  sectionId?: string;            // only if your backend DTO has it
  lessonTitle: string;
  lessonContentType: string;
  lessonDuration: string | number;
  lessonVideoUrl?: string | null;
};

export type UpdateLessonResponse = {
  updateLesson: {
    _id: string;
    sectionId: string;
    lessonTitle: string;
    lessonContentType: string;
    lessonDuration: string;
    lessonVideoUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
  } | null;
};

export type RemoveLessonResp = {
  removeLesson: {
    _id: string;
    sectionId: string;
    lessonTitle: string;
    lessonContentType: string;
    lessonDuration: string;
    lessonVideoUrl?: string | null;
    deletedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
  } | null;
};
