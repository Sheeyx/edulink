"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/providers/auth-context";
import { useFavoriteCourseIds } from "@/hooks/useFavoriteCourseIds";
import { useToggleLike } from "@/hooks/mutations/course/useToggleLike";

type Props = {
  courseId: string;
  className?: string;
  size?: "sm" | "md";
};

export default function LikeButton({ courseId, className, size = "md" }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { favoriteIds, isLoading: idsLoading } = useFavoriteCourseIds(!!user);
  const { toggleLike, loading } = useToggleLike();

  const [optimisticLiked, setOptimisticLiked] = React.useState<boolean | null>(null);

  const liked = optimisticLiked ?? favoriteIds.has(courseId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const next = !liked;
    setOptimisticLiked(next);

    try {
      await toggleLike(courseId);
    } catch {
      setOptimisticLiked(!next);
    }
  };

  const dimension = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || idsLoading}
      title={liked ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={liked}
      className={`flex ${dimension} shrink-0 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
    >
      <Heart
        className={`${iconSize} transition-colors ${
          liked ? "fill-rose-500 text-rose-500" : "text-gray-500"
        }`}
      />
    </button>
  );
}
