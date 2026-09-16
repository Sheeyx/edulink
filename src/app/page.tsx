import CourseGrid from "./_components/Courses";
import FeaturesGrid from "./_components/Features";
import HeroBanner from "./_components/HeroBanner";

export default function HomePage() {
  return (
    <div className="pt-20"> {/* Add this wrapper with padding-top */}
      <HeroBanner />
      <FeaturesGrid />
      <CourseGrid />
    </div>
  );
}
