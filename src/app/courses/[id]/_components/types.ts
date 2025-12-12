export type CourseDetail = {
  id: string;
  title: string;
  desc: any;
  rating: number;
  students: number;
  level: string;
  language: string;
  totalModules: number;
  totalLessons: number;
  price: string;
  oldPrice?: string;
  updatedAt?: string | null;
  instructor: { name: string; image: string | null };
  mediaImage: string | null;
};

export type TabKey = "learn" | "content" | "reviews" | "instructor";
