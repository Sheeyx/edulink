import type { Section } from "@/libs/types/course/types";

export type { Lesson, Section } from "@/libs/types/course/types";

export type SectionsMeta = { total: number };

export type GetSectionsByCourseData = {
  getSectionsByCourse: {
    list: Section[];
    metaCounter: SectionsMeta;
  };
};

/** Adjust if your server needs different fields */
export type SectionsInquiry = {
  courseId: string;
  page?: number;
  limit?: number;
  sectionStatus?: string;
  sort?: string;
};
