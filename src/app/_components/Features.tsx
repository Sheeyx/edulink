import { FaVideo, FaPlayCircle, FaBullseye, FaGlobe } from "react-icons/fa";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <FaVideo className="text-4xl text-blue-600" />,
      title: "Live 1-on-1 Classes",
    },
    {
      icon: <FaPlayCircle className="text-4xl text-blue-600" />,
      title: "Online Video Lessons",
    },
    {
      icon: <FaBullseye className="text-4xl text-blue-600" />,
      title: "Assignment Submission",
    },
    {
      icon: <FaGlobe className="text-4xl text-blue-600" />,
      title: "Learn Anytime, Anywhere",
    },
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            {feature.icon}
            <p className="mt-3 text-base font-semibold text-gray-800 leading-snug">
              {feature.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
