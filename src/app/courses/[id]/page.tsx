import { notFound } from "next/navigation";
import { formatPrice } from "@/libs/format";

import { getCourseById } from "@/graphql/api/course";
import { getSectionsByCourse } from "@/graphql/api/section";

import { mapSections as mapInlineSections } from "@/utils/courses";
import { mapSectionsForUI } from "@/utils/section";

import CourseDetailClient from "./_components/CourseDetailClient";

type Params = Promise<{ id?: string }>;

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
  const id = (rawId ?? "").trim();
  if (!id) return notFound();

  const course = await getCourseById(id);
  if (!course) return notFound();

  let sectionsUI: any[] = [];
  try {
    const { list } = await getSectionsByCourse({ courseId: course._id, page: 1, limit: 200 });
    sectionsUI = mapSectionsForUI(list);
  } catch {
    sectionsUI = mapInlineSections(course.sectionsWithLessons);
  }

  const instructorName = course.memberData?.memberFullName ?? "Instructor";
  const instructorImg = course.memberData?.memberImage ?? null;
  const mediaImage = course.courseImage ?? null;

  return (
    <CourseDetailClient
      course={{
        id: course._id,
        title: course.courseTitle,
        desc: course.courseDesc,
        rating: course.courseRating ?? 0,
        students: course.courseEnrolledMembers ?? 0,
        level: course.courseLevel ?? "BEGINNER",
        language: course.languageType ?? "ENGLISH",
        totalModules: course.courseTotalModules ?? sectionsUI.length,
        totalLessons: course.courseTotalLessons ?? 0,
        price: formatPrice(course.coursePrice ?? 89000),
        oldPrice: "₩149,000",
        updatedAt: course.updatedAt ?? null,
        instructor: { name: instructorName, image: instructorImg },
        mediaImage,
      }}
      sections={sectionsUI}
    />
  );
}
