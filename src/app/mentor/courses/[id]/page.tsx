// app/mentor/courses/[id]/page.tsx
import CourseDetailsClient from "./CourseDetailsClient";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 🚀 Await the params
  const { id } = await params;

  const trimmedId = (id ?? "").trim();

  if (!trimmedId) {
    return <div className="p-6">Invalid course id.</div>;
  }

  return <CourseDetailsClient courseId={trimmedId} />;
}
