// src/hooks/useCourses.ts
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { gqlFetch } from "@/libs/graphql";

export type CoursesHookInput = {
  page: number;
  limit?: number;
  language?: "English" | "TOPIK" | "Korean";
  level?: "Beginner" | "Intermediate" | "Advanced";
};

export type APICourse = {
  _id: string;
  courseTitle: string;
  courseDesc?: string;
  courseImage?: string | null;
  languageType?: string;
  courseLevel?: string;
  coursePrice?: number;
  courseRating?: number;
  courseLikes?: number;
  createdAt: string;
  updatedAt: string;
  memberData?: { _id: string; memberFullName?: string; memberImage?: string };
};

type GetCoursesResponse = {
  getCourses: { list: APICourse[]; metaCounter: { total: number } };
};

const GET_COURSES = /* GraphQL */ `
  query GetCouses($input: CoursesInquiry!) {
    getCourses(input: $input) {
      list {
        _id
        courseTitle
        courseDesc
        courseImage
        languageType
        courseLevel
        coursePrice
        courseRating
        courseLikes
        createdAt
        updatedAt
        memberData { _id memberFullName memberImage }
      }
      metaCounter { total }
    }
  }
`;

const LANG_MAP: Record<string, string> = {
  English: "ENGLISH",
  TOPIK: "TOPIK",     // change to "KOREAN" if your backend uses KOREAN instead
  Korean: "TOPIK",
};

const LEVEL_MAP: Record<string, string> = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED",
};

function clean<T extends Record<string, unknown>>(obj: T) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out;
}

function buildSearch(baseInput: CoursesHookInput) {
  return clean({
    languageType: baseInput.language ? LANG_MAP[baseInput.language] : undefined,
    courseLevel: baseInput.level ? LEVEL_MAP[baseInput.level] : undefined,
  });
}

export function useCourses(input: CoursesHookInput) {
  const limit = Number(input.limit ?? 12);
  const page = Math.max(1, Number(input.page ?? 1));

  return useQuery({
    queryKey: ["courses", page, limit, input.language, input.level],
    queryFn: async () => {
      const variables = {
        input: {
          page,
          limit,
          search: buildSearch(input),
        },
      };

      const data = await gqlFetch<GetCoursesResponse>(GET_COURSES, variables);
      return data.getCourses;
    },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
