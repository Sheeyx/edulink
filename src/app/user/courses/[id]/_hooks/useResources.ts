"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_RESOURCES_BY_COURSE } from "@/graphql/query/resources/resources";

export type CourseResource = {
  _id: string;
  resourceTitle: string;
  resourceType: string;
  resourceUrl: string;
  resourceSize?: number | null;
  downloadCount: number;
  createdAt: string;
};

type Resp = { getResourcesByCourse: CourseResource[] };

export function useResources(courseId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["user", "courseResources", courseId],
    queryFn: async (): Promise<CourseResource[]> => {
      const res = await gqlFetchAuth<Resp>(GET_RESOURCES_BY_COURSE, { courseId });
      return res.getResourcesByCourse || [];
    },
    enabled: enabled && !!courseId,
    staleTime: 60_000,
  });
}
