// src/hooks/useInfiniteCourses.ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphql } from "@/libs/graphql-client";

export type CoursesHookInput = {
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

type PageData = GetCoursesResponse["getCourses"] & { page: number };

const GET_COURSES = gql/* GraphQL */ `
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

function clean<T extends Record<string, any>>(obj: T) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out;
}

function buildSearch(baseInput: CoursesHookInput) {
  const uiLang = baseInput.language;
  const uiLevel = baseInput.level;

  return clean({
    languageType: uiLang ? LANG_MAP[uiLang] : undefined,
    courseLevel: uiLevel ? LEVEL_MAP[uiLevel] : undefined,
  });
}

export function useInfiniteCourses(baseInput: CoursesHookInput) {
  const limit = Number(baseInput.limit ?? 12);

  return useInfiniteQuery<PageData>({
    queryKey: ["courses", baseInput],
    queryFn: async ({ pageParam = 1 }): Promise<PageData> => {
      const variables = {
        input: {
          page: Number(pageParam),
          limit,
          search: buildSearch(baseInput),
        },
      };

      const data = await graphql.request<GetCoursesResponse>(GET_COURSES, variables);
      return { ...data.getCourses, page: Number(pageParam) };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const already = lastPage.page * limit;
      return already < lastPage.metaCounter.total ? lastPage.page + 1 : undefined;
    },
    staleTime: 60_000,
  });
}
