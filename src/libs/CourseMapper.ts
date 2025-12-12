import type { CourseFromApi } from "@/libs/types/course/types";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

export type UICourseCard = {
  image: string;
  title: string;
  subtitle: string;
  instructor: string;
  price: string;
  oldPrice: string;
  rating: number;
  ratingCount: number;
  hours: string;
  lectures: number;
  level: string;
};

function formatPrice(n?: number | string) {
  if (n === undefined || n === null || n === "") return "₩0";
  const num = typeof n === "string" ? Number(n) : n;
  return Number.isNaN(num) ? String(n) : `₩${num.toLocaleString()}`;
}

export function toCourseCardModel(c: CourseFromApi): UICourseCard {
  const rawImg = c.courseImage || c.memberData?.memberImage || "";
  const img = buildDownloadUrl(rawImg) || "/images/courses/placeholder.jpg";

  return {
    image: img,
    title: c.courseTitle ?? "",
    subtitle: c.courseDesc ?? "",
    instructor: c.memberData?.memberFullName ?? "Instructor",
    price: formatPrice(c.coursePrice),
    oldPrice: "", // you don't have courseOldPrice in your type (yet)
    rating: c.courseRating ?? 0,
    ratingCount: c.courseLikes ?? 0,
    hours: String(c.courseTotalLessons ?? ""),
    lectures: c.courseTotalLessons ?? 0,
    level: c.courseLevel ?? "Beginner",
  };
}
