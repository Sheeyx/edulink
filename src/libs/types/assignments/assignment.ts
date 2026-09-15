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
