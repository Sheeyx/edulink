import type { CourseFromApi } from "@/libs/types/course/types";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

export type UICourseCard = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  instructor: string;
  price: string;
  priceValue: number;
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
    id: c._id,
    image: img,
    title: c.courseTitle ?? "",
    subtitle: c.courseDesc ?? "",
    instructor: c.memberData?.memberFullName ?? "Instructor",
    price: formatPrice(c.coursePrice),
    priceValue: typeof c.coursePrice === "number" ? c.coursePrice : Number(c.coursePrice) || 0,
    oldPrice: "", // you don't have courseOldPrice in your type (yet)
    rating: c.courseRating ?? 0,
    ratingCount: c.courseLikes ?? 0,
    hours: String(c.courseTotalLessons ?? ""),
    lectures: c.courseTotalLessons ?? 0,
    level: c.courseLevel ?? "Beginner",
  };
}
