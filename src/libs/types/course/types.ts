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

/* ========= UI-safe types (for components) ========= */

export type ULesson = {
  _id: string;
  title: string;
  duration?: string;
  kind?: string;
};

export type USection = {
  _id: string;
  title: string;
  order?: number;
  lessons?: ULesson[];

  // new: for filtering / displaying badges in UI
  status?: SectionStatus;
};

export type CourseUI = {
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  modules: number;
  lessons: number;
  rating: number;
  price: number;
  currency: string;
  image?: string | null;
  sections: SectionUI[];
};

// app/mentor/courses/libs/courseTypes.ts


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

export type SectionUI = {
  id: string;
  title: string;
  order: number;
  lessonsCount: number;
  status?: SectionStatus;
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