"use client";

import { useRouter } from "next/navigation";
import DetailPanel from "../profile/DetailPanel";

export default function UserAssignmentsPage() {
  const router = useRouter();

  return (
    <DetailPanel panel="assignments" onBack={() => router.push("/user")} />
  );
}
