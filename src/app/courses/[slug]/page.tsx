// app/courses/[slug]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { useState } from "react";

const courses = [
  {
    slug: "korean-usual",
    title: "Korean Usual",
    subtitle: "Using Pyrogram and OpenAI",
    instructor: "Mehdi Haghgoo",
    rating: 4.6,
    ratingCount: 42,
    students: 1200,
    language: "Korean",
    updated: "7/2024",
    price: "₩15,000",
    oldPrice: "₩25,000",
    image: "/images/courses/korean-usual.jpg",
    includes: [
      "9.5 hours on-demand video",
      "2 articles",
      "1 downloadable resource",
      "Access on mobile and TV",
    ],
    curriculum: [
      {
        title: "Introduction",
        lectures: 4,
        duration: "51min",
        contents: [
          { title: "What you're going to get", duration: "03:27" },
          { title: "START HERE", duration: "02:53" },
          { title: "Tips for Taking the Course", duration: "04:22" },
          { title: "Day 1 Goals", duration: "02:30" }
        ],
      },
      {
        title: "Core Korean Basics",
        lectures: 3,
        duration: "4hr",
        contents: [
          { title: "Alphabet Practice", duration: "25:00" },
          { title: "Pronunciation Rules", duration: "30:00" },
          { title: "Forming Basic Words", duration: "35:00" }
        ],
      },
    ],
  },
];

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = courses.find((c) => c.slug === params.slug);

  if (!course) return notFound();

  const totalLectures = course.curriculum.reduce((sum, sec) => sum + sec.lectures, 0);
  const totalSections = course.curriculum.length;

  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSectionIndex(openSectionIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-20">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-700 text-lg mb-2">{course.subtitle}</p>
          <div className="text-sm text-gray-500 mb-2">
            ⭐ {course.rating} ({course.ratingCount.toLocaleString()} ratings) · {course.students.toLocaleString()} students
          </div>
          <p className="text-sm text-gray-500 mb-1">Created by <span className="text-purple-600 font-medium">{course.instructor}</span></p>
          <p className="text-sm text-gray-500">Last updated {course.updated} · {course.language}</p>

          <h2 className="mt-10 text-xl font-semibold">Course content</h2>
          <p className="text-sm text-gray-500 mb-4">
            {totalSections} sections • {totalLectures} lectures • {course.includes[0]}
          </p>

          <div className="divide-y border rounded-md">
            {course.curriculum.map((section, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleSection(index)}
                  className="flex justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 font-medium text-gray-800"
                >
                  <span>{section.title}</span>
                  <span className="text-sm text-gray-600">
                    {section.lectures} lectures • {section.duration}
                  </span>
                </button>
                {openSectionIndex === index && section.contents && (
                  <ul className="bg-white px-6 py-3 text-sm text-gray-700 space-y-2">
                    {section.contents.map((item, idx) => (
                      <li key={idx} className="flex justify-between border-b pb-1">
                        <span>{item.title}</span>
                        <span>{item.duration}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow bg-white">
          <img
            src={course.image}
            alt={course.title}
            className="rounded-md mb-4 w-full h-40 object-cover"
          />
          <div className="text-xl font-bold">{course.price}</div>
          <div className="text-sm line-through text-gray-400">{course.oldPrice}</div>
          <p className="text-red-500 text-sm mt-1">7 hours left at this price!</p>

          <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
            Add to cart
          </button>

          <button className="mt-2 w-full border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition">
            Buy now
          </button>

          <p className="mt-4 text-xs text-gray-500 text-center">
            30-Day Money-Back Guarantee
          </p>

          <h3 className="mt-6 font-semibold text-gray-800 mb-2">This course includes:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {course.includes.map((item, idx) => (
              <li key={idx}>✅ {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
