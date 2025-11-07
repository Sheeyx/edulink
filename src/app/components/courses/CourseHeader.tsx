export default function CourseHeader({
  title,
  desc,
  instructor,
  rating,
  students,
}: {
  title: string;
  desc?: string;
  instructor: { name: string; image: string };
  rating: number;
  students: number;
}) {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
      {desc ? <p className="mt-2 text-gray-600">{desc}</p> : null}

      <div className="mt-4 flex items-center gap-3">
        <img
          src={instructor.image}
          alt={instructor.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-sm">
          <div className="font-semibold text-gray-800">{instructor.name}</div>
          <div className="text-yellow-600 text-xs">★ {rating} · {students} students</div>
        </div>
      </div>
    </>
  );
}
