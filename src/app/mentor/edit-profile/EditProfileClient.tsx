// src/app/mentor/edit-profile/EditProfileClient.tsx
"use client";

import * as React from "react";
import UpdateMemberForm from "@/app/mentor/edit-profile/components/UpdateMemberForm";
import { useAuth } from "@/providers/auth-context";
import { useRouter } from "next/navigation";

export default function EditProfileClient() {
  const router = useRouter();
  const { user } = useAuth();

  const memberId = user?.id ?? "";
  // const name = user?.name || "Mentor";   // available if you want a header avatar
  // const avatarUrl = user?.image || "";

  // If you prefer to hard-redirect when no memberId:
  // React.useEffect(() => {
  //   if (!memberId) router.replace("/auth/login");
  // }, [memberId, router]);

  return (
    // This <section> is rendered inside the <main> column that the layout provides.
    <section className="rounded-[28px] bg-white p-7">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-1">Update your name, phone, bio and photo.</p>
      </header>

      {memberId ? (
        <UpdateMemberForm memberId={memberId} onDone={() => { /* optional toast */ }} />
      ) : (
        <p className="text-sm text-gray-600">
          No member ID found. Please{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-violet-600 hover:underline font-medium"
          >
            log in
          </button>
          .
        </p>
      )}
    </section>
  );
}
