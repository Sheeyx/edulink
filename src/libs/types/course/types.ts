// src/graphql/types/course.ts

export type Lesson = {
  _id: string;
  sectionId: string;
  lessonTitle?: string;
  lessonContentType?: string;
  lessonDuration?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Section = {
  _id: string;
  courseId: string;
  moduleTitle?: string;
  moduleOrder?: number;
  totalLessons?: number;
  createdAt?: string;
  updatedAt?: string;
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
  sectionsWithLessons: Section[];
  memberData?: Member;
};

export type GetCourseResponse = { getCourse: Course | null };

/* ===== UI-safe types (for components) ===== */
export type ULesson = { _id: string; title: string; duration?: string; kind?: string };
export type USection = { _id: string; title: string; order?: number; lessons?: ULesson[] };
