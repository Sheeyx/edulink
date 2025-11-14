// src/app/mentor/page.tsx
import MentorDashboardClient from "@/app/mentor/MentorDashboardClient";

// TODO: Replace mock data with real session/user data
const mock = { name: "Shekh", memberId: "MID", avatarUrl: "/avatar.png" };

export default function MentorHomePage() {
  return <MentorDashboardClient {...mock} initialPanel={null} />;
}
