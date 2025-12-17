// app/user/_components/LearningDashboard/constants.tsx

export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";

export const getRoleLabel = (role: "STUDENT" | "MENTOR" | "ADMIN") =>
  role === "MENTOR" ? "Mentor" : role === "ADMIN" ? "Admin" : "Student";
