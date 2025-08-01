"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const isNew = (session?.user as any)?.isNewUser;
      console.log("SESSION VALUE:", session); // ✅ Debug

      if (isNew) {
        router.push("/auth/social");
      } else {
        router.push("/student");
      }
    }
  }, [status, session, router]);

  return <p className="text-center mt-10">Redirecting...</p>;
}
