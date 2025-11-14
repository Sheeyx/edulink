// app/mentor/courses/[id]/page.tsx
import CourseDetailsClient from "./CourseDetailsClient";

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = (params?.id ?? "").trim();
  if (!id) {
    return <div className="p-6">Invalid course id.</div>;
  }

  return <CourseDetailsClient courseId={id} />;
}
