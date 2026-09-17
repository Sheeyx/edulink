"use client";

import Image from "next/image";
import { FileText, Download, Star } from "lucide-react";
import type { EnrolledCourseDetails } from "../../_types/courseDetails.types";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";
import { useResources } from "../../_hooks/useResources";

export default function OverviewTab({ course }: { course: EnrolledCourseDetails }) {
  const { data: resources, isLoading } = useResources(course._id, true);

  const mentorName = course.memberData?.memberFullName || "Mentor";
  const mentorImg =
    buildDownloadUrl(course.memberData?.memberImage) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=FFF3E0&color=B45500`;

  const rating =
    typeof course.courseRating === "number" ? Math.max(0, Math.min(5, course.courseRating)) : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-base font-black text-gray-900 mb-2">About this course</h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {course.courseDesc || "No description provided yet."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
          <Image src={mentorImg} alt={mentorName} fill sizes="48px" className="object-cover" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-gray-900">{mentorName}</div>
          <div className="text-xs text-gray-500">Instructor</div>
        </div>
        {rating > 0 && (
          <div className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-gray-700">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            {rating.toFixed(1)}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-base font-black text-gray-900 mb-2">Resources</h3>
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading resources...</div>
        ) : !resources?.length ? (
          <div className="text-sm text-gray-500">No downloadable resources for this course yet.</div>
        ) : (
          <div className="space-y-2">
            {resources.map((r) => (
              <a
                key={r._id}
                href={buildDownloadUrl(r.resourceUrl) || r.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 transition"
              >
                <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="truncate font-semibold text-gray-800">{r.resourceTitle}</span>
                <Download className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
