import { graphql } from "@/libs/graphql-client";
import { GetSectionsByCourseData, Section, SectionsInquiry, SectionsMeta } from "@/libs/types/section/types";
import { GET_SECTIONS_BY_COURSE } from "../query/section/section";


export async function getSectionsByCourse(
  input: SectionsInquiry
): Promise<{ list: Section[]; meta: SectionsMeta }> {
  const data = await graphql.request<GetSectionsByCourseData>(
    GET_SECTIONS_BY_COURSE,
    { input } // { courseId, page?, limit? ... }
  );
  return {
    list: data.getSectionsByCourse?.list ?? [],
    meta: data.getSectionsByCourse?.metaCounter ?? { total: 0 },
  };
}
