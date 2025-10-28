"use client";

import CourseCard from "@/components/Course/CourseCard";
import CourseFilters, { FilterState } from "@/components/Course/CourseFilter";
import Link from "next/link";

// ✅ Helper to generate URL-friendly slugs
function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function CoursesPage() {
  const courses = [
    {
      image: "/images/courses/korean-usual.jpg",
      title: "Korean Usual",
      subtitle: "Using Pyrogram and OpenAI",
      instructor: "Mehdi Haghgoo",
      price: "₩15,000",
      oldPrice: "₩25,000",
      rating: 4.6,
      ratingCount: 42,
      hours: "9.5",
      lectures: 60,
      level: "Intermediate",
    },
    {
      image: "/images/courses/korean-from-scratch.jpg",
      title: "Learn Korean from Scratch",
      subtitle: "For beginners and travelers",
      instructor: "Soojin Kim",
      price: "₩10,000",
      oldPrice: "₩20,000",
      rating: 4.8,
      ratingCount: 120,
      hours: "6",
      lectures: 48,
      level: "Beginner",
    },
    {
      image: "/images/courses/spoken-english.jpg",
      title: "Spoken English Mastery",
      subtitle: "Improve fluency fast",
      instructor: "Michael Smith",
      price: "₩18,000",
      oldPrice: "₩35,000",
      rating: 4.5,
      ratingCount: 200,
      hours: "12",
      lectures: 75,
      level: "Intermediate",
    },
    {
      image: "/images/courses/english-mastery.jpg",
      title: "English Mastery",
      subtitle: "Improve fluency fast",
      instructor: "Michael Jordan",
      price: "₩25,000",
      oldPrice: "₩35,000",
      rating: 5.0,
      ratingCount: 300,
      hours: "14",
      lectures: 80,
      level: "Advanced",
    },
  ];

  const handleFilterChange = (filters: FilterState) => {
    // TODO: Implement filtering logic
    console.log("Filters updated:", filters);
  };

  return (
    <div className="max-w-7xl mt-20 mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Available Courses</h1>

      <CourseFilters onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {courses.map((course, idx) => (
          <Link href={`/courses/${slugify(course.title)}`} key={idx}>
            <CourseCard course={course} />
          </Link>
        ))}
      </div>
    </div>
  );
}
