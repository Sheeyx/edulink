import Link from "next/link";
import CourseCard from "@/components/Course/CourseCard";
import type { CourseFromApi } from "@/libs/types/course/types";
import { toCourseCardModel, UICourseCard } from "@/libs/CourseMapper";

type Props = {
  courses: CourseFromApi[];
};

export default function CoursesGrid({ courses }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {courses.map((course, idx) => {
        const card: UICourseCard = toCourseCardModel(course);

        return (
          <Link
            key={course?._id ?? idx}
            href={`/courses/${course._id}`}
            prefetch={false}
            aria-label={`Open course ${card.title}`}
          >
            <CourseCard course={card} />
          </Link>
        );
      })}
    </div>
  );
}
