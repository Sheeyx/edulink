export const COURSE_CATEGORY = ["LANGUAGE"] as const;
export type CourseCategory = (typeof COURSE_CATEGORY)[number];

export const COURSE_LEVEL = [
  "BEGINNER",
  "ELEMENTARY",
  "INTERMEDIATE",
  "UPPER_INTERMEDIATE",
  "ADVANCED",
  "PROFICIENCY",
  "ALL_LEVELS",
] as const;
export type CourseLevel = (typeof COURSE_LEVEL)[number];

export const COURSE_STATUS = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "SUSPENDED",
  "COMPLETED",
  "PROGRESS",
] as const;
export type CourseStatus = (typeof COURSE_STATUS)[number];

export const LANGUAGE_TYPE = ["ENGLISH", "TOPIK", "EPS_TOPIK", "VIP"] as const;
export type LanguageType = (typeof LANGUAGE_TYPE)[number];
