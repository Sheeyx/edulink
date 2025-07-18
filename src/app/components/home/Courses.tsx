"use client";

import { useState } from "react";
import CourseCard from "@/components/Course/CourseCard";
import CourseFilters, { FilterState } from "@/components/Course/CourseFilter";

const courseList = [
  {
    image: "/course1.jpg",
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
    image: "/course2.jpg",
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
    image: "/course3.jpg",
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
    image: "/course3.jpg",
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

export default function CourseGrid() {
  const [filters, setFilters] = useState<FilterState>({
    category: "Courses",
    level: "All",
    rating: "All",
  });

  return (
    <section className="px-6 md:px-16 py-12 bg-white">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center md:text-left">
            Our Courses
        </h2>
      {/* Filters */}
      <CourseFilters onFilterChange={setFilters} />

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center">
        {courseList.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </section>
  );
}
