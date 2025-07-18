import CourseGrid from "./components/home/Courses";
import FeaturesGrid from "./components/home/Features";
import HeroBanner from "./components/home/HeroBanner";

export default function HomePage() {
  return (
    <div className="pt-20"> {/* Add this wrapper with padding-top */}
      <HeroBanner />
      <FeaturesGrid />
      <CourseGrid />
    </div>
  );
}
