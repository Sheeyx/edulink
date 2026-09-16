// src/app/admin/page.tsx
"use client";

import { FiUsers, FiBook, FiUserCheck } from "react-icons/fi";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="Total Students"
          value="2,847"
          trend="+12%"
          icon={<FiUsers className="text-brand-primary/80" size={28} />}
          bg="from-brand-primary/15 to-brand-primary/10"
        />

        <KpiCard
          title="Active Mentors"
          value="142"
          trend="+5%"
          icon={<FiUserCheck className="text-blue-500" size={28} />}
          bg="from-blue-100 to-blue-50"
        />

        <KpiCard
          title="Active Courses"
          value="89"
          trend="+6%"
          icon={<FiBook className="text-green-500" size={28} />}
          bg="from-green-100 to-green-50"
        />

        <KpiCard
          title="Monthly Revenue"
          value="$84.2K"
          trend="+9%"
          icon={<FiBook className="text-orange-500" size={28} />}
          bg="from-orange-100 to-orange-50"
        />
      </div>

      {/* LATEST USERS */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Latest Users</h2>

        <div className="divide-y">
          <UserRow name="Emma Wilson" role="Student" email="emma.w@gmail.com" status="Active" />
          <UserRow name="James Lee" role="Mentor" email="james.lee@gmail.com" status="Pending" />
          <UserRow name="Sophia Chen" role="Student" email="sophia.c@gmail.com" status="Active" />
        </div>
      </div>

      {/* TOP COURSES */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Top Performing Courses</h2>

        <CourseRow
          title="IELTS Preparation Master Course"
          mentor="Dr. Sarah Kim"
          students="482 Students"
          progress={87}
          color="bg-brand-primary/80"
        />

        <CourseRow
          title="Full Stack Web Development"
          mentor="Prof. Julia Davis"
          students="269 Students"
          progress={79}
          color="bg-blue-500"
        />

        <CourseRow
          title="TOPIK Level 2"
          mentor="Mr. Lee Jong"
          students="198 Students"
          progress={75}
          color="bg-green-500"
        />
      </div>
    </div>
  );
}

/* ------- COMPONENTS ------- */

function KpiCard({ title, value, trend, icon, bg }: any) {
  return (
    <div className={`bg-gradient-to-br ${bg} p-6 rounded-3xl shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          {icon}
          <p className="mt-3 text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-500 text-sm">{title}</p>
        </div>

        <span className="text-green-600 font-semibold">{trend}</span>
      </div>
    </div>
  );
}

function UserRow({ name, role, email, status }: any) {
  const color =
    status === "Active"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{role} • {email}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${color}`}>{status}</span>
    </div>
  );
}

function CourseRow({ title, mentor, students, progress, color }: any) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{mentor} • {students}</p>
        </div>
        <span className="text-gray-600 font-semibold">{progress}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
