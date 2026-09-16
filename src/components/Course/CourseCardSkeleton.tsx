export default function CourseCardSkeleton() {
  return (
    <div className="flex h-full w-full animate-pulse flex-col border border-gray-200 rounded-xl shadow-sm bg-white p-4">
      {/* Image */}
      <div className="h-40 w-full shrink-0 rounded-lg bg-gray-200" />

      {/* Title */}
      <div className="mt-4 h-4 w-4/5 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-full rounded bg-gray-100" />
      <div className="mt-2 mb-2 h-3 w-1/3 rounded bg-gray-100" />

      {/* Meta row */}
      <div className="mb-2 flex items-center gap-2">
        <div className="h-3 w-10 rounded bg-gray-100" />
        <div className="h-3 w-16 rounded bg-gray-100" />
        <div className="h-5 w-16 rounded-full bg-gray-100" />
      </div>

      {/* Price + button */}
      <div className="mt-auto">
        <div className="h-5 w-20 rounded bg-gray-200" />
        <div className="mt-3 h-9 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
