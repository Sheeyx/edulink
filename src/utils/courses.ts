import { Course, USection } from "@/libs/types/course/types";

export function mapSections(sections: Course["sectionsWithLessons"]): USection[] {
  return (sections ?? []).map((s, i) => ({
    _id: s._id,
    title: s.moduleTitle ?? `Section ${s.moduleOrder ?? i + 1}`,
    order: s.moduleOrder ?? i + 1,
    lessons: (s.lessons ?? []).map((l, j) => ({
      _id: l._id,
      title: l.lessonTitle ?? `Lesson ${j + 1}`,
      duration: l.lessonDuration ?? "",
      kind: l.lessonContentType ?? "video",
    })),
  }));
}
