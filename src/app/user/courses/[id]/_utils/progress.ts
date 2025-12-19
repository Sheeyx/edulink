import type { EnrolledCourseDetails } from "../_types/courseDetails.types";

function clampPercent(n: number) {
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}

export function computeProgress(course: EnrolledCourseDetails) {
  const sections = course.sectionsWithLessons || [];
  const allLessons = sections.flatMap((s) => s.lessons || []);

  const total = allLessons.length;

  const available = allLessons.filter((l) => {
    if (l.deletedAt) return false;
    const status = (l.lessonStatus || "").toUpperCase();
    const hasUrl = !!l.lessonUrl;
    const okStatus = status
      ? !["DRAFT", "ARCHIVED", "SUSPENDED", "DELETED"].includes(status)
      : true;
    return hasUrl && okStatus;
  }).length;

  const percent = total ? clampPercent((available / total) * 100) : 0;

  const sortedSections = [...sections].sort(
    (a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0)
  );

  const firstLessonUrl =
    sortedSections
      .flatMap((s) => (s.lessons || []).filter(Boolean))
      .find((l) => !l.deletedAt && !!l.lessonUrl)?.lessonUrl || null;

  return { total, available, percent, firstLessonUrl };
}
