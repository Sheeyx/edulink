// app/mentor/courses/libs/courseApi.ts

import { gqlFetchAuth } from "@/libs/graphql";
import { GET_COURSE } from "@/graphql/query/courses/courses";
import { CourseFromApi, GetCourseResp, RemoveSectionResp, SectionFromApi, SectionsByCourseResp } from "../types/course/types";


/* ───────── GraphQL Documents ───────── */

const DELETE_SECTION = `
  mutation RemoveSection($sectionId: String!) {
    removeSection(sectionId: $sectionId) {
      _id
    }
  }
`;

const GET_SECTIONS_BY_COURSE = `
  query GetSectionsByCourse($input: SectionsInquiry!) {
    getSectionsByCourse(input: $input) {
      list {
        _id
        courseId
        sectionStatus
        moduleTitle
        moduleOrder
        totalLessons
        deletedAt
        createdAt
        updatedAt
        lessons {
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
      metaCounter {
        total
      }
    }
  }
`;

/* ───────── API Calls ───────── */

export async function fetchCourseById(courseId: string): Promise<CourseFromApi> {
  const data = await gqlFetchAuth<GetCourseResp>(
    GET_COURSE,
    { input: courseId },
    undefined,
    { withCredentials: true }
  );
  return data.getCourse;
}

export async function fetchSectionsByCourseId(
  courseId: string
): Promise<SectionFromApi[]> {
  const data = await gqlFetchAuth<SectionsByCourseResp>(
    GET_SECTIONS_BY_COURSE,
    {
      input: {
        page: 1,
        limit: 100,
        search: {
          courseId,
        },
      },
    },
    undefined,
    { withCredentials: true }
  );

  return data.getSectionsByCourse.list;
}

export async function deleteSectionById(sectionId: string): Promise<void> {
  await gqlFetchAuth<RemoveSectionResp>(
    DELETE_SECTION,
    { sectionId },
    undefined,
    { withCredentials: true }
  );
}
