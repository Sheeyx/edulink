import type { Section } from "@/libs/types/section/types";
// ✅ use section/types NOT course/types

export type ULesson = {
  _id: string;
  title: string;
  duration?: string;
  kind?: string;
};

export type USection = {
  _id: string;
  title: string;
  order?: number;
  lessons?: ULesson[];
};

export function mapSectionsForUI(sections: Section[] = []): USection[] {
  return sections.map((s, i) => {
    const moduleOrder = s.moduleOrder ?? i + 1;
    const moduleTitle = s.moduleTitle ?? `Section ${moduleOrder}`;

    const lessons = (s.lessons ?? []).map((l, j) => ({
      _id: l._id,
      title: l.lessonTitle ?? `Lesson ${j + 1}`,
      duration: l.lessonDuration ?? "",
      kind: l.lessonContentType ?? "video",
    }));

    return {
      _id: s._id,
      title: moduleTitle,
      order: moduleOrder,
      lessons,
    };
  });
}
