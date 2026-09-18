import React from "react";
import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 max-w-6xl mx-auto">
      {/* Left Side: Student in Online Class */}
      <div className="relative bg-white rounded-xl overflow-hidden shadow-lg max-w-md w-full">
        <Image
          src="/images/home/lesson-banner.png"
          alt="Student attending online class"
          width={768}
          height={512}
          className="w-full h-auto object-cover"
        />
        <div className="absolute bottom-4 left-4 flex gap-3">
          <button className="bg-blue-600 p-2 rounded-full text-white text-sm">
            🎥
          </button>
          <button className="bg-red-500 p-2 rounded-full text-white text-sm">
            ⏹️
          </button>
        </div>
      </div>

      {/* Right Side: Class Info */}
      <div className="mt-10 md:mt-0 md:ml-12 text-center md:text-left max-w-xl">
  <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-5">
    Learn without  <br className="hidden md:block" />
    limits and spread <br className="hidden md:block" />
    knowledge.
  </h2>

  <p className="text-lg text-gray-700 mb-8">
    Join live, interactive Zoom sessions with certified tutors. 
    Get personalized learning paths, real-time feedback, and recognized certificates —
    all from the comfort of your home.
  </p>

  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
    <button className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 text-white text-lg font-semibold rounded-xl shadow-md transition">
      🚀 See Courses
    </button>
    <button className="flex items-center gap-2 text-gray-800 font-medium hover:underline">
      ▶ Watch Video
    </button>
  </div>

  <div className="mt-10 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xl font-semibold text-gray-800">
  <div className="flex items-baseline gap-2">
    <span className="text-4xl font-extrabold text-black">🎓 50K+</span>
    <span className="text-lg text-gray-700">Learners</span>
  </div>
  <div className="flex items-baseline gap-2">
    <span className="text-4xl font-extrabold text-black">📚 70+</span>
    <span className="text-lg text-gray-700">Courses</span>
  </div>
</div>

</div>

    </div>
  );
}
