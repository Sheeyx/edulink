export type Lesson = {
  kind: any;
  contentType: any;
  _id: string;
  sectionId: string;
  lessonTitle?: string;
  lessonContentType?: string;
  lessonDuration?: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Section = {
  _id: string;
  courseId: string;
  sectionStatus?: string;
  moduleTitle?: string;
  moduleOrder?: number;
  totalLessons?: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  lessons?: Lesson[];
};

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
