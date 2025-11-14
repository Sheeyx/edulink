// app/mentor/edit-course/[id]/page.tsx
import EditCourseClient from "./EditCourseClient";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;        // ⬅️ wait for params
  const trimmedId = (id ?? "").trim();

  if (!trimmedId) {
    return (
      <div className="p-6 text-sm text-rose-600">
        Invalid course id in URL.
      </div>
    );
  }

  return <EditCourseClient courseId={trimmedId} />;
}
