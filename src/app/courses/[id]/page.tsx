// app/courses/[id]/page.tsx
import { notFound } from "next/navigation";
import { formatPrice } from "@/libs/format";
import CourseHeader from "@/app/components/courses/CourseHeader";
import CourseBadges from "@/app/components/courses/CourseBadges";
import CourseMedia from "@/app/components/courses/CourseMedia";
import CourseWhatYoullLearn from "@/app/components/courses/CourseWhatYoullLearn";
import CoursePurchaseSidebar from "@/app/components/courses/CoursePurchaseSidebar";
import CourseContentAccordion from "@/app/components/courses/CourseContentAccordion";

import { getCourseById } from "@/graphql/api/course";
import { getSectionsByCourse } from "@/graphql/api/section";
import { mapSections as mapInlineSections } from "@/utils/courses";
import { mapSectionsForUI } from "@/utils/section";

type Params = Promise<{ id?: string }>;

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { id: rawId } = await params;            // ✅ await params (Next 15)
  const id = (rawId ?? "").trim();
  if (!id) return notFound();

  const course = await getCourseById(id);
  if (!course) return notFound();

  // Prefer fetching sections via API; fall back to embedded sections if needed
  let sectionsUI;
  try {
    const { list } = await getSectionsByCourse({ courseId: course._id, page: 1, limit: 100 });
    sectionsUI = mapSectionsForUI(list);
  } catch {
    sectionsUI = mapInlineSections(course.sectionsWithLessons);
  }

  const instructorName = course.memberData?.memberFullName ?? "Instructor";
  const instructorImg = course.memberData?.memberImage ?? "/images/courses/placeholder.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <CourseHeader
            title={course.courseTitle}
            desc={course.courseDesc}
            instructor={{ name: instructorName, image: instructorImg }}
            rating={course.courseRating ?? 0}
            students={course.courseEnrolledMembers ?? 0}
          />

          <CourseBadges
            level={course.courseLevel ?? "Beginner"}
            lectures={course.courseTotalLessons ?? 0}
            language={course.languageType ?? "ENGLISH"}
          />

          <CourseMedia title={course.courseTitle} imageSrc="/images/courses/placeholder.jpg" />

          {/* Tabs header */}
          <div className="mt-8 border-b">
            <div className="flex gap-6 text-sm">
              <button className="py-3 border-b-2 border-violet-600 text-violet-700 font-semibold">
                What You'll Learn
              </button>
              <button className="py-3 text-gray-500 hover:text-gray-700">Description</button>
              <button className="py-3 text-gray-500 hover:text-gray-700">Curriculum</button>
              <button className="py-3 text-gray-500 hover:text-gray-700">Reviews</button>
              <button className="py-3 text-gray-500 hover:text-gray-700">Instructor</button>
            </div>
          </div>

          <CourseWhatYoullLearn className="mt-6" />

          {/* Course content */}
          <div className="mt-10">
            <h2 className="text-2xl text-gray-900 font-bold mb-3">Course content</h2>
            <p className="text-sm text-gray-500 mb-4">
              {course.courseTotalModules ?? sectionsUI.length} sections · {course.courseTotalLessons ?? 0} lectures
            </p>
            <CourseContentAccordion sections={sectionsUI} />
          </div>
        </div>

        {/* RIGHT */}
        <aside className="lg:col-span-1">
          <CoursePurchaseSidebar
            price={formatPrice(course.coursePrice ?? 89000)}
            oldPrice="₩149,000"
            saleBadge="40% OFF"
            features={[
              "On-demand video",
              "Lifetime access",
              "Certificate of completion",
              "Downloadable resources",
              "Mobile access",
            ]}
            coupon={{ code: "ENGLISH40", note: "for extra 10% off" }}
          />
        </aside>
      </div>
    </div>
  );
}
