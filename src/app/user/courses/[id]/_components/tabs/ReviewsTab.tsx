"use client";

import { Star, MessageSquareText } from "lucide-react";
import type { EnrolledCourseDetails } from "../../_types/courseDetails.types";

export default function ReviewsTab({ course }: { course: EnrolledCourseDetails }) {
  const rating =
    typeof course.courseRating === "number" ? Math.max(0, Math.min(5, course.courseRating)) : 0;

  return (
    <div className="p-6 space-y-6">
      {rating > 0 ? (
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black text-gray-900">{rating.toFixed(1)}</div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i <= Math.round(rating) ? "text-amber-500 fill-amber-500" : "text-gray-200"}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">Course rating</div>
        </div>
      ) : null}

      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-gray-400">
        <MessageSquareText className="w-8 h-8" />
        <div className="text-sm font-bold text-gray-600">Individual reviews are coming soon</div>
        <div className="text-xs max-w-sm">
          We don&apos;t collect written reviews yet — only the aggregate course rating shown above.
        </div>
      </div>
    </div>
  );
}
