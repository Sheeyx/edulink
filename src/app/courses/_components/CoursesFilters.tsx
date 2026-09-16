"use client";

import { Globe2, GraduationCap, Star, X } from "lucide-react";
import { Select } from "@/components/ui/form/FormFields";
import { Lang, Level, Rating } from "../_libs/filter.types";

type Props = {
  lang: Lang;
  level: Level;
  rating: Rating;
  onLang: (v: Lang) => void;
  onLevel: (v: Level) => void;
  onRating: (v: Rating) => void;
  onReset: () => void;
};

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "All", label: "All Languages" },
  { value: "English", label: "English" },
  { value: "TOPIK", label: "Korean" },
];

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: "All", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const RATING_OPTIONS: { value: Rating; label: string }[] = [
  { value: "All", label: "All Ratings" },
  { value: "4.5+", label: "4.5+ Stars" },
  { value: "4.8+", label: "4.8+ Stars" },
];

export default function CoursesFilters({
  lang,
  level,
  rating,
  onLang,
  onLevel,
  onRating,
  onReset,
}: Props) {
  const hasActiveFilters = lang !== "All" || level !== "All" || rating !== "All";

  return (
    <div className="flex flex-wrap items-center justify-start gap-2.5">
      <Select
        icon={<Globe2 className="h-4 w-4" />}
        value={lang}
        options={LANG_OPTIONS}
        onChange={onLang}
        active={lang !== "All"}
      />
      <Select
        icon={<GraduationCap className="h-4 w-4" />}
        value={level}
        options={LEVEL_OPTIONS}
        onChange={onLevel}
        active={level !== "All"}
      />
      <Select
        icon={<Star className="h-4 w-4" />}
        value={rating}
        options={RATING_OPTIONS}
        onChange={onRating}
        active={rating !== "All"}
      />

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-rose-600"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
