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
    const moduleOrder = (s as any).moduleOrder ?? (s as any).order ?? i + 1;
    const moduleTitle =
      (s as any).moduleTitle ??
      (s as any).title ??
      `Section ${moduleOrder}`;

    const lessons = ((s as any).lessons ?? []).map((l: any, j: number) => ({
      _id: l._id,
      title: l.lessonTitle ?? l.title ?? `Lesson ${j + 1}`,
      duration: (l.lessonDuration ?? l.duration ?? "") as string,
      kind: (l.lessonContentType ?? l.kind ?? "video") as string,
    }));

    return {
      _id: s._id,
      title: moduleTitle,
      order: moduleOrder,
      lessons,
    };
  });
}
