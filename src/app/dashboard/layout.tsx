// src/app/dashboard/layout.tsx
"use client";

import { FiHome, FiUsers, FiBook, FiCreditCard, FiHelpCircle, FiSettings } from "react-icons/fi";
import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const menu = [
    { label: "Dashboard", icon: <FiHome />, href: "/dashboard" },
    { label: "Students", icon: <FiUsers />, href: "/dashboard/students" },
    { label: "Mentors", icon: <FiUsers />, href: "/dashboard/mentors" },
    { label: "Courses", icon: <FiBook />, href: "/dashboard/courses" },
    { label: "Payments", icon: <FiCreditCard />, href: "/dashboard/payments" },
    { label: "Support / Tickets", icon: <FiHelpCircle />, href: "/dashboard/support" },
    { label: "Settings", icon: <FiSettings />, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex bg-[#F8F9FB] h-screen overflow-hidden">
      
      {/* FIXED SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-[#1E1E2A] to-[#0F0F15] text-white p-6 space-y-6 rounded-r-3xl shadow-xl h-screen flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary font-bold">
            E
          </div>
          <span className="text-2xl font-semibold tracking-wide">EDULINK</span>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition text-gray-200 hover:text-white"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-base">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* SCROLLABLE MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search users, courses…"
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm w-72 focus:ring-2 focus:ring-brand-primary/40"
            />

            <div className="flex items-center gap-2 pr-3 pl-1 py-1 rounded-xl bg-white shadow-sm cursor-pointer">
              <div>
                <p className="text-sm font-medium">Sheyx</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
