export default function CourseBadges({
  level,
  lectures,
  language,
}: {
  level: string;
  lectures: number;
  language: string;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2 text-sm">
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">{level}</span>
      <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 font-medium">{lectures} lectures</span>
      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">{language}</span>
    </div>
  );
}
