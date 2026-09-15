"use client";

import { useRouter } from "next/navigation";
import DetailPanel from "./DetailPanel";

export default function UserProfilePage() {
  const router = useRouter();

  return (
    <DetailPanel panel="profile" onBack={() => router.push("/user")} />
  );
}
