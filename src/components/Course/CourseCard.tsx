// components/CourseCard.tsx
import { FaStar } from "react-icons/fa";

type Course = {
  image: string;
  title: string;
  subtitle: string;
  instructor: string;
  price: string;
  oldPrice: string;
  rating: number;
  ratingCount: number;
  hours: string;
  lectures: number;
  level: string;
};

export default function CourseCard({
  course,
}: {
  course: Course;
}) {
  return (
    <div className="border rounded-xl shadow-sm bg-white p-4 w-full max-w-xs">
      <img
        src={course.image}
        alt={course.title}
        className="rounded-lg w-full h-40 object-cover"
      />
      <h3 className="mt-4 font-bold text-md leading-snug text-gray-700">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-1">{course.subtitle}</p>
      <p className="text-sm text-gray-500 mb-2">{course.instructor}</p>

      <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
        <div className="flex items-center gap-1 text-yellow-500 font-medium">
          <FaStar />
          <span>{course.rating}</span>
        </div>
        <span className="text-gray-500">({course.ratingCount} ratings)</span>
        <span className="text-gray-500">{course.hours} total hours</span>
        <span className="text-gray-500">{course.lectures} lectures</span>
    <span
  className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${
    course.level === "BEGINNER"
      ? "bg-gradient-to-r from-green-400 to-green-600"
      : course.level === "INTERMEDIATE"
      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
      : "bg-gradient-to-r from-purple-500 to-indigo-600"
  }`}
>
  {course.level}
</span>


      </div>

      <div className="flex items-center gap-2 font-semibold">
        <span className="text-lg text-black">{course.price}</span>
        <span className="line-through text-gray-400 text-sm">{course.oldPrice}</span>
      </div>

      <button className="mt-3 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition">
        Add to cart
      </button>
    </div>
  );
}
