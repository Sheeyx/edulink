export default function CourseWhatYoullLearn({ className = "" }: { className?: string }) {
  const items = [
    "Master conversation techniques",
    "Improve pronunciation",
    "Build confidence",
    "Learn natural expressions",
    "Practice with real scenarios",
    "Develop listening skills",
  ];
  return (
    <div className={`${className} grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-800`}>
      {items.map((t) => (
        <li key={t} className="list-none before:content-['✓'] before:text-emerald-600 before:mr-2">{t}</li>
      ))}
    </div>
  );
}
