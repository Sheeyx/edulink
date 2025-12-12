"use client";

import * as React from "react";
import Image from "next/image";

import CourseHero from "./CourseHero";
import CoursePurchaseCard from "./CoursePurchaseCard";
import CourseTabs from "./CourseTabs";

import CourseContentAccordion from "@/app/components/courses/CourseContentAccordion";

import type { CourseDetail, TabKey } from "./types";
import { normalizeImageSrc } from "./utils/images";

export default function CourseDetailClient({
  course,
  sections,
}: {
  course: CourseDetail;
  sections: any[];
}) {
  const [activeTab, setActiveTab] = React.useState<TabKey>("learn");

  const learnRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reviewsRef = React.useRef<HTMLDivElement>(null);
  const instructorRef = React.useRef<HTMLDivElement>(null);

  const scrollTo = (key: TabKey) => {
    setActiveTab(key);
    const el =
      key === "learn"
        ? learnRef.current
        : key === "content"
          ? contentRef.current
          : key === "reviews"
            ? reviewsRef.current
            : instructorRef.current;

    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const instructorImg = normalizeImageSrc(course.instructor?.image);

  return (
    <div className="min-h-screen bg-white mt-16">
      {/* HERO */}
      <section className="bg-slate-950 text-white h-120">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <CourseHero course={course} />
            <CoursePurchaseCard course={course} onPreview={() => scrollTo("content")} />
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <CourseTabs active={activeTab} onTab={scrollTo} />

              {/* Learn */}
              <div ref={learnRef} className="pt-8 scroll-mt-24">
                <h2 className="text-2xl font-extrabold text-slate-900">What you’ll learn</h2>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                    <li>✅ Python basics</li>
                    <li>✅ Data types & operators</li>
                    <li>✅ Lists, tuples, dicts</li>
                    <li>✅ Loops</li>
                    <li>✅ Functions</li>
                    <li>✅ Exceptions</li>
                  </ul>
                </div>
              </div>

              {/* Curriculum */}
              <div ref={contentRef} className="pt-10 scroll-mt-24">
                <h2 className="text-2xl font-extrabold text-slate-900">Course content</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {course.totalModules} sections • {course.totalLessons} lectures
                </p>

                <CourseContentAccordion sections={sections} />
              </div>

              {/* Reviews */}
              <div ref={reviewsRef} className="pt-10 scroll-mt-24">
                <h2 className="text-2xl font-extrabold text-slate-900">Reviews</h2>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                  Reviews UI goes here.
                </div>
              </div>

              {/* Instructor */}
              <div ref={instructorRef} className="pt-10 scroll-mt-24">
                <h2 className="text-2xl font-extrabold text-slate-900">Instructor</h2>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden border">
                    <Image
                      src={instructorImg}
                      alt={course.instructor?.name || "Instructor"}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {course.instructor?.name || "Instructor"}
                    </div>
                    <div className="text-sm text-slate-600">Mentor / Instructor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right spacer */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>
    </div>
  );
}
