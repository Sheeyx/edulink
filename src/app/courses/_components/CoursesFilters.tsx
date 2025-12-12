"use client";

import { pillsActive, pillsBase, pillsIdle } from "@/libs/constants";
import { Lang, Level, Rating } from "../libs/filter.types";


type Props = {
  lang: Lang;
  level: Level;
  rating: Rating;
  onLang: (v: Lang) => void;
  onLevel: (v: Level) => void;
  onRating: (v: Rating) => void;
  onReset: () => void;
};

export default function CoursesFilters({
  lang,
  level,
  rating,
  onLang,
  onLevel,
  onRating,
  onReset,
}: Props) {
  const pill = (active: boolean) =>
    `${pillsBase} ${active ? pillsActive : pillsIdle}`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button onClick={onReset} className={pill(lang === "All" && level === "All" && rating === "All")}>
        All Courses
      </button>

      <button onClick={() => onLang("English")} className={pill(lang === "English")}>
        English
      </button>

      <button onClick={() => onLang("TOPIK")} className={pill(lang === "TOPIK")}>
        Korean
      </button>

      <button onClick={() => onLevel("All")} className={pill(level === "All")}>
        All Levels
      </button>

      <button onClick={() => onRating("All")} className={pill(rating === "All")}>
        All Ratings
      </button>
    </div>
  );
}
