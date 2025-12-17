"use client";

import { useRouter } from "next/navigation";
import DetailPanel from "../profile/DetailPanel";

export default function UserExplorePage() {
  const router = useRouter();

  return (
    <DetailPanel panel="explore" onBack={() => router.push("/user")} />
  );
}
