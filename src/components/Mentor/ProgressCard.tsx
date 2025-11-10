"use client";

import * as React from "react";
import { Users, CheckCircle, Flame } from "lucide-react";

export const ProgressCard: React.FC = () => (
  <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <header className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">Your Teaching</h2>
      <span className="text-sm text-gray-500">This week</span>
    </header>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="flex flex-col items-center">
        <div className="bg-blue-50 rounded-full p-4 mb-3">
          <Users className="w-7 h-7 text-blue-600" />
        </div>
        <div className="text-3xl font-bold mb-1">42</div>
        <div className="text-sm text-gray-500">Active students</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-green-50 rounded-full p-4 mb-3">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <div className="text-3xl font-bold mb-1">12</div>
        <div className="text-sm text-gray-500">Assignments graded</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-orange-50 rounded-full p-4 mb-3">
          <Flame className="w-7 h-7 text-orange-600" />
        </div>
        <div className="text-3xl font-bold mb-1">3</div>
        <div className="text-sm text-gray-500">New reviews</div>
      </div>
    </div>
  </section>
);
