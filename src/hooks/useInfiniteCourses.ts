// src/hooks/useInfiniteCourses.ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphql } from "@/libs/graphql-client";

/* ===== Types (trimmed) ===== */
export type APICourse = {
  _id: string;
  courseTitle: string;
  courseDesc?: string;
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

/* ===== Query ===== */
const GET_COURSES = gql/* GraphQL */ `
  query GetCouses($input: CoursesInquiry!) {
    getCourses(input: $input) {
      list {
        _id
        courseTitle
        courseDesc
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

/* ===== Helpers ===== */
const LANG_MAP: Record<string, string> = {
  English: "ENGLISH",
  Korean: "KOREAN",
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

/** Build EXACT search shape the backend expects */
function buildSearch(baseInput: Record<string, unknown>) {
  const uiLang = baseInput.language as string | undefined;  // e.g. "English"
  const uiLevel = baseInput.level as string | undefined;    // e.g. "Beginner"

  return clean({
    languageType: uiLang ? LANG_MAP[uiLang] : undefined,    // -> "ENGLISH"
    courseLevel: uiLevel ? LEVEL_MAP[uiLevel] : undefined,  // -> "BEGINNER"
    // Add other searchable fields here if needed:
    // category: baseInput.category,
    // keyword: baseInput.searchText,
  });
}

/* ===== Hook ===== */
export function useInfiniteCourses(baseInput: Record<string, unknown>) {
  const limit = Number(baseInput.limit ?? 12);

  return useInfiniteQuery<PageData>({
    queryKey: ["courses", baseInput],
    queryFn: async ({ pageParam = 1 }): Promise<PageData> => {
      const variables = {
        input: {
          page: Number(pageParam),
          limit,
          search: buildSearch(baseInput), // ✅ { languageType: "ENGLISH" } etc.
        },
      };

      const data = await graphql.request<GetCoursesResponse>(GET_COURSES, variables);
      const { getCourses } = data;
      return { ...getCourses, page: Number(pageParam) };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const already = lastPage.page * limit;
      return already < lastPage.metaCounter.total ? lastPage.page + 1 : undefined;
    },
    staleTime: 60_000,
  });
}
