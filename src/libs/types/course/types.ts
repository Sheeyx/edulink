import { CourseCategory, CourseLevel, CourseStatus, LanguageType, ResourceType, CourseScheduleStatus } from "@/libs/enums/course.enums";

export type SectionStatus = "ACTIVE" | "INACTIVE" | "DELETED";

/* ========= Raw GraphQL types ========= */

export type Lesson = {
  lessonUrl: string | null | undefined;
  _id: string;
  sectionId: string;
  lessonTitle?: string;
  lessonContentType?: string;
  lessonDuration?: string;
  isLocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type CreateFormState = {
  title: string;
  description: string;
  category: string;
  languageType: string;

  // using enum types
  level: CourseLevel;
  status: CourseStatus;
  maxStudents: number
  price: string; // keep string because input returns string
  courseStartDate: Date | null
};

export type CreateCourseResp = {
  createCourse: CourseFromApi;
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

// Lightweight instructor preview embedded in a Course response — not the
// full Member entity (see libs/types/member/types.ts for that).
export type CourseAuthorPreview = {
  _id: string;
  memberFullName?: string;
  memberImage?: string;
  memberBio?: string;
};

export type Course = {
  currentEnrolledMembers?: number;
  isFull?: boolean;
  id: string;
  courseImage: string;
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

  memberData?: CourseAuthorPreview;
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


export type CourseFromApi = {
  courseImage: string | null;
  _id: string;
  courseTitle: string;
  courseDesc: string;
  courseCategory: string;
  languageType: string;
  courseLevel: string;
  coursePrice: number;
  courseStatus: CourseStatus;
  mentorId: string;
  // getCourse/getCourseForMentor return the raw list of enrolled member ids
  // (not a count) — see Course DTO's `courseEnrolledMembers: ObjectId[]`.
  courseEnrolledMembers?: string[] | null;
  courseTotalModules?: number | null;
  courseTotalLessons?: number | null;
  courseRating?: number | null;
  courseLikes?: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sectionsWithLessons?: SectionFromApi[];
  resources?: ResourceFromApi[];
  memberData?: {
    _id: string;
    memberFullName?: string | null;
    memberImage?: string | null;
    memberBio?: string | null;
  } | null;
};

export type ResourceFromApi = {
  _id: string;
  resourceTitle: string;
  resourceType: ResourceType;
  resourceUrl: string;
  resourceSize?: number | null;
  courseId: string;
  mentorId?: string;
  resourceStatus: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  downloadCount: number;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type GetCourseResp = { getCourse: CourseFromApi };

export type CreateResourceInput = {
  resourceTitle: string;
  resourceType: ResourceType;
  resourceUrl: string;
  resourceSize?: number;
  courseId: string;
  isPublic?: boolean;
};

export type UpdateResourceInput = {
  _id: string;
  resourceTitle?: string;
  resourceType?: ResourceType;
  resourceUrl?: string;
  resourceSize?: number;
  isPublic?: boolean;
};

export type CreateResourceResp = { createResource: ResourceFromApi };
export type UpdateResourceResp = { updateResource: ResourceFromApi };
export type RemoveResourceResp = { removeResource: { _id: string } | null };

export type RemoveSectionResp = {
  removeSection: {
    _id: string;
  } | null;
};

/* ========= Course Schedule (live class scheduling) ========= */

export type ScheduleFromApi = {
  _id: string;
  courseId: string;
  mentorId: string;
  lessonId?: string | null;
  startAt: string[];
  status: CourseScheduleStatus;
  meetLinks?: string[] | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateScheduleInput = {
  courseId: string;
  lessonId?: string;
  startAt: string[];
  status?: CourseScheduleStatus;
  meetLinks?: string[];
};

export type UpdateScheduleInput = {
  _id: string;
  lessonId?: string | null;
  startAt?: string[];
  status?: CourseScheduleStatus;
  meetLinks?: string[];
};

export type CreateScheduleResp = { createSchedule: ScheduleFromApi };
export type UpdateScheduleResp = { updateSchedule: ScheduleFromApi };
export type RemoveScheduleResp = { removeSchedule: { _id: string } | null };
export type GetScheduleResp = { getSchedule: ScheduleFromApi };
export type GetSchedulesResp = {
  getSchedules: {
    list: ScheduleFromApi[];
    metaCounter: { total: number }[];
  };
};

// ---- UI schedule type --------------------------------------
export type ScheduleUI = {
  id: string;
  courseId: string;
  lessonId?: string | null;
  startAt: string[];
  status: CourseScheduleStatus;
  meetLinks: string[];
  createdAt?: string;
  updatedAt?: string;
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
  lessonUrl?: string | null;
  isLocked?: boolean;
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

// ---- UI resource type ---------------------------------------
export type ResourceUI = {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  size?: number | null;
  isPublic: boolean;
  downloadCount: number;
  createdAt?: string;
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
  resources: ResourceUI[];
  enrolledMemberIds: string[];
};




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
