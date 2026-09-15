import { ReactNode } from "react";

// ./types.ts
export type CourseDetail = {
  id: string;
  title: string;
  desc?: string | null;
  rating: number;
  students: number;
  level: string;
  language: string;
  totalModules: number;
  totalLessons: number;
  price: string;
  oldPrice?: string | null;
  updatedAt?: string | null;
  instructor: {
    name: string;
    image: string | null;
  };
  mediaImage: string | null;
};

export type TabKey = "learn" | "content" | "reviews" | "instructor";
