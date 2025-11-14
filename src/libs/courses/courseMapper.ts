// app/mentor/courses/libs/courseMapper.ts

import {
  CourseFromApi,
  CourseUI,
  SectionFromApi,
  SectionStatus,
  SectionUI,
} from "../types/course/types";

export function getSectionStatus(section: SectionFromApi): SectionStatus {
  const raw = section.sectionStatus ?? "ACTIVE";
  return String(raw).toUpperCase() as SectionStatus;
}

export function mapToCourseUI(
  course: CourseFromApi,
  sectionsApi: SectionFromApi[]
): CourseUI {
  const activeSections = sectionsApi
    .map((section) => ({
      section,
      status: getSectionStatus(section),
    }))
    .filter((item) => item.status === "ACTIVE")
    .sort((a, b) => a.section.moduleOrder - b.section.moduleOrder);

  const modules = course.courseTotalModules ?? activeSections.length;

  const lessons =
    course.courseTotalLessons ??
    activeSections.reduce(
      (sum, { section }) =>
        sum + (section.totalLessons ?? section.lessons.length),
      0
    );

  const uiSections: SectionUI[] = activeSections.map(({ section, status }) => ({
    id: section._id,
    title: section.moduleTitle,
    order: section.moduleOrder,
    lessonsCount: section.totalLessons ?? section.lessons.length,
    status,
  }));

  return {
    id: course._id,
    title: course.courseTitle,
    description: course.courseDesc,
    status: course.courseStatus,
    modules,
    lessons,
    rating: course.courseRating ?? 0,
    price: course.coursePrice,
    currency: "₩",
    image: null,
    sections: uiSections,
  };
}
