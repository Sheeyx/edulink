"use client";

import { useRouter } from "next/navigation";
import DetailPanel from "../profile/DetailPanel";

export default function UserCoursesPage() {
  const router = useRouter();

  return (
    <DetailPanel panel="courses" onBack={() => router.push("/user")} />
  );
}
