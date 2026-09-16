// src/types/assignment.ts

export type AssignmentStatus = "DRAFT" | "ACTIVE" | "ARCHIVED" | "DELETED";

export type Assignment = {
  _id: string;
  title: string;
  description?: string | null;
  courseId: string;
  sectionId?: string | null;
  lessonId?: string | null;
  mentorId?: string | null;
  dueDate?: string | null;
  attachments?: string[] | null;
  status?: string | null;
  createdAt: string;
  updatedAt: string;
  // present on getAssignmentsByCourse
  submissionCount?: number;
};

export type GetAssignmentsByCourseResp = {
  getAssignmentsByCourse: {
    list: Assignment[];
    metaCounter: { total: number }[];
  };
};

export type GetMyAssignmentsResp = {
  getMyAssignments: {
    list: Assignment[];
    metaCounter: { total: number }[];
  };
};

// ---- UI-mapped shape used by SectionsBlock and AssignmentsTab ----
export type AssignmentUI = {
  id: string;
  title: string;
  description?: string | null;
  courseId: string;
  sectionId?: string;
  lessonId?: string;
  mentorId?: string | null;
  dueDate?: string | null;
  status?: string | null;
  submissionCount: number;
  attachments: string[];
};

export function toAssignmentUI(a: Assignment): AssignmentUI {
  return {
    id: a._id,
    title: a.title,
    description: a.description ?? null,
    courseId: a.courseId,
    sectionId: a.sectionId ?? undefined,
    lessonId: a.lessonId ?? undefined,
    mentorId: a.mentorId ?? null,
    dueDate: a.dueDate ?? null,
    status: a.status ?? null,
    submissionCount: a.submissionCount ?? 0,
    attachments: Array.isArray(a.attachments) ? a.attachments : [],
  };
}

export type CreateAssignmentInput = {
  title: string;
  description?: string;
  courseId: string;
  sectionId?: string;
  lessonId?: string;
  dueDate?: string;
  attachments?: string[];
};

export type GQLErrorItem = { message?: string; extensions?: Record<string, unknown> };
export type GraphQLResponse<T> = { data?: T; errors?: GQLErrorItem[] };
