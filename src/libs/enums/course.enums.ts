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

// Backend CourseCategory enum (src/libs/enums/course.enum.ts) only defines LANGUAGE.
// Keep this in sync with the backend enum, not aspirational categories.
export const CATEGORY_OPTIONS = ["LANGUAGE"] as const;
export type CategoryOptions = (typeof CATEGORY_OPTIONS)[number];


export const LANGUAGE_OPTIONS = [
  'ENGLISH',
	'TOPIK',
	'EPS_TOPIK',
	'VIP',
] as const;
export type LanguageOptions = (typeof LANGUAGE_OPTIONS)[number];



export const LANGUAGE_TYPE = ["ENGLISH", "TOPIK", "EPS_TOPIK", "VIP"] as const;
export type LanguageType = (typeof LANGUAGE_TYPE)[number];

// Backend ResourceType enum (src/libs/enums/resource.enum.ts)
export const RESOURCE_TYPE = [
  "PDF",
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "DOCUMENT",
  "ARCHIVE",
  "TEXT",
  "PRESENTATION",
  "SPREADSHEET",
] as const;
export type ResourceType = (typeof RESOURCE_TYPE)[number];

// Backend CourseScheduleStatus enum (src/libs/enums/course.schedule.enum.ts)
export const COURSE_SCHEDULE_STATUS = [
  "SCHEDULED",
  "CANCELLED",
  "COMPLETED",
] as const;
export type CourseScheduleStatus = (typeof COURSE_SCHEDULE_STATUS)[number];
