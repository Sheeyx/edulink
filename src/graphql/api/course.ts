import { graphql } from "@/libs/graphql-client";
import { Course, GetCourseResponse } from "@/libs/types/course/types";
import { GET_COURSE } from "../query/courses/courses";

function ensureNonEmptyString(v: unknown, label: string): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) throw new Error(`${label} is required`);
  return s;
}

export async function getCourseById(id: string): Promise<Course | null> {
  const courseId = ensureNonEmptyString(id, "courseId");

  const { getCourse } = await graphql.request<GetCourseResponse>(
    GET_COURSE,
    { input: courseId } // ✅ never undefined/null
  );

  return getCourse ?? null;
}
