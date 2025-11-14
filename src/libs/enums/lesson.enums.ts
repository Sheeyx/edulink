// app/mentor/courses/[id]/components/Lessons/createLesson.ts
import { gqlFetchAuth } from "@/libs/graphql";

export const CREATE_LESSON = `
  mutation CreateLesson($input: LessonInput!) {
    createLesson(input: $input) {
      _id
      sectionId
      lessonTitle
      lessonContentType
      lessonDuration
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

export type LessonContentType =
  | "VIDEO"
  | "TEXT"
  | "QUIZ"
  | "ASSIGNMENT"
  | "LIVE";

export type LessonFromApi = {
  _id: string;
  sectionId: string;
  lessonTitle: string;
  lessonContentType: LessonContentType;
  lessonDuration: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type CreateLessonVars = {
  input: {
    sectionId: string;
    lessonTitle: string;
    lessonContentType: LessonContentType;
    lessonDuration: number;
    lessonUrl?: string;
  };
};

type CreateLessonResp = {
  createLesson: LessonFromApi;
};


