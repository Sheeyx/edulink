// app/user/LearningDashboardClient.tsx
"use client";

import React, { useState } from "react";
import {
  UserRound, BookOpen, ClipboardList, Compass, Clock, CheckCircle, Flame, ChevronRight, GraduationCap, Users
} from "lucide-react";

type PanelType = "profile" | "courses" | "assignments" | "explore" | null;
type MemberRole = "STUDENT" | "MENTOR" | "ADMIN";

interface Props { role: MemberRole; name: string; avatarUrl?: string; }
interface BadgeProps { bg: string; fg: string; children: React.ReactNode; }
interface ActionRowProps { icon: React.ReactNode; title: string; desc: string; onClick: () => void; }
interface DetailPanelProps { panel: PanelType; onBack: () => void; }
interface SmallTileProps { iconTint: string; icon: React.ReactNode; title: string; desc: string; }

const Badge: React.FC<BadgeProps> = ({ bg, fg, children }) => (
  <div className={`${bg} ${fg} rounded-2xl p-3 flex items-center justify-center w-14 h-14`}>{children}</div>
);

const ActionRow: React.FC<ActionRowProps> = ({ icon, title, desc, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow cursor-pointer">
    {icon}
    <div className="flex-1">
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
    <div className="bg-purple-600 rounded-full p-2.5 flex-shrink-0">
      <ChevronRight className="w-5 h-5 text-white" />
    </div>
  </div>
);

const ProgressCard: React.FC = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">Your Progress</h2>
      <span className="text-sm text-gray-500">This week</span>
    </div>
    <div className="grid grid-cols-3 gap-6">
      <div className="flex flex-col items-center">
        <div className="bg-blue-50 rounded-full p-4 mb-3"><Clock className="w-7 h-7 text-blue-600" /></div>
        <div className="text-3xl font-bold mb-1">12h</div>
        <div className="text-sm text-gray-500">Study time</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-green-50 rounded-full p-4 mb-3"><CheckCircle className="w-7 h-7 text-green-600" /></div>
        <div className="text-3xl font-bold mb-1">8</div>
        <div className="text-sm text-gray-500">Completed lessons</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-orange-50 rounded-full p-4 mb-3"><Flame className="w-7 h-7 text-orange-600" /></div>
        <div className="text-3xl font-bold mb-1">5</div>
        <div className="text-sm text-gray-500">Day streak</div>
      </div>
    </div>
  </div>
);

const DetailPanel: React.FC<DetailPanelProps> = ({ panel, onBack }) => (
  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
    <button onClick={onBack} className="mb-6 text-purple-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
      <ChevronRight className="w-5 h-5 rotate-180" />
      Back
    </button>
    <h2 className="text-3xl font-bold mb-4 capitalize">{panel}</h2>
    <p className="text-gray-500">This is where the {panel} content would be displayed. Click back to return to the dashboard.</p>
  </div>
);

const SmallTile: React.FC<SmallTileProps> = ({ iconTint, icon, title, desc }) => (
  <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
    <div className={`${iconTint} rounded-2xl p-3 flex items-center justify-center w-12 h-12 flex-shrink-0`}>{icon}</div>
    <div className="flex-1">
      <h3 className="font-bold text-base mb-0.5">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
  </div>
);

const LearningDashboard: React.FC<Props> = ({ role, name, avatarUrl }) => {
  const [panel, setPanel] = useState<PanelType>(null);
  const roleLabel = role === "MENTOR" ? "Mentor" : role === "ADMIN" ? "Admin" : "Student";
  const showBecomeMentor = role === "STUDENT";

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-6">
          {/* LEFT COLUMN */}
          <aside className="space-y-5 md:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col items-center">
                <img
                  src={avatarUrl ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">Welcome, {name}!</h2>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg mb-6">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">{roleLabel}</span>
                </div>
                <button
                  onClick={() => setPanel("profile")}
                  className="w-full border-2 border-purple-600 text-purple-600 rounded-xl py-3 font-semibold mb-3 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={() => setPanel("courses")}
                  className="w-full bg-purple-600 text-white rounded-xl py-3 font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  View My Courses
                </button>
              </div>
            </div>

            {showBecomeMentor && (
              <SmallTile
                iconTint="bg-green-50 text-green-600"
                icon={<GraduationCap className="w-6 h-6" />}
                title="Become a Mentor"
                desc="Share your knowledge"
              />
            )}

            <SmallTile
              iconTint="bg-purple-50 text-purple-600"
              icon={<Users className="w-6 h-6" />}
              title="Refer a Friend"
              desc="Invite others to learn"
            />
          </aside>

          {/* RIGHT COLUMN */}
          <main className="space-y-5 md:col-span-4">
            {panel === null ? (
              <>
                <header className="mb-6">
                  <h1 className="text-4xl font-black mb-2">Let's get started</h1>
                  <p className="text-gray-500 text-base">Continue your learning journey with these quick actions</p>
                </header>

                <ActionRow
                  icon={<Badge bg="bg-blue-50" fg="text-blue-600"><UserRound className="w-6 h-6" /></Badge>}
                  title="Edit your profile"
                  desc="Add your name, photo, and interests to personalize your experience"
                  onClick={() => setPanel("profile")}
                />
                <ActionRow
                  icon={<Badge bg="bg-green-50" fg="text-green-600"><BookOpen className="w-6 h-6" /></Badge>}
                  title="My Courses"
                  desc="Continue learning where you left off and track your progress"
                  onClick={() => setPanel("courses")}
                />
                <ActionRow
                  icon={<Badge bg="bg-orange-50" fg="text-orange-600"><ClipboardList className="w-6 h-6" /></Badge>}
                  title="Assignments"
                  desc="Check your homework, submit work, and view due dates"
                  onClick={() => setPanel("assignments")}
                />
                <ActionRow
                  icon={<Badge bg="bg-purple-50" fg="text-purple-600"><Compass className="w-6 h-6" /></Badge>}
                  title="Explore new courses"
                  desc="Discover lessons and topics that match your learning goals"
                  onClick={() => setPanel("explore")}
                />

                <ProgressCard />
              </>
            ) : (
              <DetailPanel panel={panel} onBack={() => setPanel(null)} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LearningDashboard;
