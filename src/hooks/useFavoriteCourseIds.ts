// src/hooks/useFavoriteCourseIds.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_FAVORITE_IDS } from "@/graphql/query/courses/favorites";

type GetFavoriteIdsResp = {
  getFavorites: {
    list: { _id: string }[];
    metaCounter: { total: number }[];
  };
};

// A generous limit: this only fetches ids to build a lookup set, not for
// display, so one page comfortably covers a student's whole wishlist.
const IDS_LIMIT = 500;

export function useFavoriteCourseIds(enabled: boolean) {
  const query = useQuery({
    queryKey: ["favorite-course-ids"],
    queryFn: async (): Promise<Set<string>> => {
      const res = await gqlFetchAuth<GetFavoriteIdsResp>(GET_FAVORITE_IDS, {
        input: { page: 1, limit: IDS_LIMIT },
      });
      const ids = res.getFavorites?.list?.map((c) => c._id) ?? [];
      return new Set(ids);
    },
    enabled,
    staleTime: 30_000,
  });

  return {
    favoriteIds: query.data ?? new Set<string>(),
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
