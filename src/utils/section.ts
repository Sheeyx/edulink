import { Section } from "@/libs/types/course/types";

export type ULesson = { _id: string; title: string; duration?: string; kind?: string };
export type USection = { _id: string; title: string; order?: number; lessons?: ULesson[] };

export function mapSectionsForUI(sections: Section[]): USection[] {
  return (sections ?? []).map((s, i) => ({
    _id: s._id,
    title: s.moduleTitle ?? `Section ${s.moduleOrder ?? i + 1}`,
    order: s.moduleOrder ?? i + 1,
    lessons: (s.lessons ?? []).map<ULesson>((l, j) => ({
      _id: l._id,
      title: l.lessonTitle ?? `Lesson ${j + 1}`,
      duration: l.lessonDuration ?? "",
      kind: l.lessonContentType ?? "video",
    })),
  }));
}
