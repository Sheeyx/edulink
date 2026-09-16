import CourseCardSkeleton from "./CourseCardSkeleton";

type Props = {
  count?: number;
};

export default function CourseGridSkeleton({ count = 8 }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
