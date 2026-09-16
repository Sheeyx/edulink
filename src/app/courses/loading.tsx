import CourseGridSkeleton from "@/components/Course/CourseGridSkeleton";

export default function CoursesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-14 pb-20">
      <div className="text-center mt-16 mb-8">
        <div className="mx-auto h-9 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-gray-100" />
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2.5">
        <div className="h-11 w-40 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-11 w-36 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-11 w-40 animate-pulse rounded-2xl bg-gray-100" />
      </div>

      <CourseGridSkeleton count={12} />
    </div>
  );
}
