// components/CourseFilters.tsx
import { useState } from "react";

export type FilterState = {
  category: string;
  level: string;
  rating: string;
};

const filters = {
  categories: ["Courses", "English", "Korean"],
  levels: ["Beginner", "Intermediate", "Advanced"],
  ratings: ["4.5+", "4.0+", "3.5+"],
};

export default function CourseFilters({
  onFilterChange,
}: {
  onFilterChange: (filters: FilterState) => void;
}) {
  const [selected, setSelected] = useState<FilterState>({
    category: "Courses",
    level: "All",
    rating: "All",
  });

  const handleChange = (type: keyof FilterState, value: string) => {
    const updated = { ...selected, [type]: value };
    setSelected(updated);
    onFilterChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
      {filters.categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleChange("category", cat)}
          className={`px-4 py-2 rounded-full border text-sm font-medium ${
            selected.category === cat
              ? "bg-purple-600 text-white"
              : "text-gray-700 border-gray-300"
          }`}
        >
          {cat}
        </button>
      ))}

      <div className="relative">
        <select
          onChange={(e) => handleChange("level", e.target.value)}
          className="appearance-none px-4 py-2 pr-8 rounded-full border text-sm text-gray-700 border-gray-300"
          value={selected.level}
        >
          <option value="All">All Levels</option>
          {filters.levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <select
          onChange={(e) => handleChange("rating", e.target.value)}
          className="appearance-none px-4 py-2 pr-8 rounded-full border text-sm text-gray-700 border-gray-300"
          value={selected.rating}
        >
          <option value="All">All Ratings</option>
          {filters.ratings.map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
