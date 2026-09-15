// app/user/_components/LearningDashboard/components/ProgressCard.tsx
import React from "react";
import { Clock, CheckCircle, Flame } from "lucide-react";

export default function ProgressCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
        <span className="text-sm text-gray-700">Last 7 days</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 rounded-full p-4 mb-3">
            <Clock className="w-7 h-7 text-blue-700" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1">12h</div>
          <div className="text-sm text-gray-800">Time Studied</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-green-100 rounded-full p-4 mb-3">
            <CheckCircle className="w-7 h-7 text-green-700" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1">8</div>
          <div className="text-sm text-gray-800">Lessons Completed</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-orange-100 rounded-full p-4 mb-3">
            <Flame className="w-7 h-7 text-orange-700" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1">5</div>
          <div className="text-sm text-gray-800">Learning Streak</div>
        </div>
      </div>
    </div>
  );
}
