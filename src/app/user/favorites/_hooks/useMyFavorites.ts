"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_FAVORITES } from "@/graphql/query/courses/favorites";
import type { APICourse } from "@/hooks/useCourses";

type GetFavoritesResp = {
  getFavorites: {
    list: APICourse[];
    metaCounter: { total: number }[];
  };
};

const LIMIT = 24;

export function useMyFavorites(enabled: boolean) {
  return useQuery({
    queryKey: ["my-favorites"],
    queryFn: async (): Promise<APICourse[]> => {
      const res = await gqlFetchAuth<GetFavoritesResp>(GET_FAVORITES, {
        input: { page: 1, limit: LIMIT },
      });
      return res.getFavorites?.list ?? [];
    },
    enabled,
    staleTime: 30_000,
  });
}
