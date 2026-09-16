"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/providers/auth-context";
import { useMyFavorites } from "./_hooks/useMyFavorites";
import EmptyFavorites from "./_components/EmptyFavorites";
import CourseCard from "@/components/Course/CourseCard";
import { toCourseCardModel } from "@/libs/CourseMapper";
import type { CourseFromApi } from "@/libs/types/course/types";

export default function MyFavoritesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: favorites = [], isLoading, isError, error, refetch, isFetching } =
    useMyFavorites(!!user);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/user")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <h1 className="mt-3 text-3xl md:text-4xl font-black text-gray-900">
            My Favorites
          </h1>
          <p className="mt-1 text-gray-600">
            Courses you&apos;ve saved to check out later.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold hover:bg-gray-50 transition"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="font-extrabold text-red-900">Failed to load favorites</div>
          <div className="mt-1 text-sm text-red-800">
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-2xl bg-red-700 text-white px-4 py-2 text-sm font-bold hover:bg-red-800 transition"
          >
            Try again
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
        </div>
      )}

      {!isLoading && !isError && favorites.length === 0 && <EmptyFavorites />}

      {!isLoading && !isError && favorites.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((course) => {
            const card = toCourseCardModel(course as unknown as CourseFromApi);
            return (
              <Link key={course._id} href={`/courses/${course._id}`} className="block h-full">
                <CourseCard course={card} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
