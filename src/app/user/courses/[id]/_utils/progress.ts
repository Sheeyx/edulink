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

  const orderedLessons = sortedSections.flatMap((s) => (s.lessons || []).filter(Boolean));

  // Resume at the first not-yet-completed playable lesson, or fall back to
  // the first playable lesson if everything's done (or nothing's started).
  const resumeLesson =
    orderedLessons.find((l) => !l.deletedAt && !!l.lessonUrl && !l.isLocked && !l.lessonProgress?.isCompleted) ||
    orderedLessons.find((l) => !l.deletedAt && !!l.lessonUrl && !l.isLocked);

  const firstLessonId = resumeLesson?._id || null;

  return { total, available, percent, firstLessonId };
}
