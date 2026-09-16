// src/app/mentor/MentorDashboardClient.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useRefreshRoleOnce } from "@/hooks/useRefreshRoleOnce";
import { buildActions, buildTiles } from "./_components/actions-data";
import MainArea from "./_components/MainArea";

export type PanelType =
  | null
  | "profile"
  | "courses"
  | "create-course"
  | "earnings"
  | "assignments"
  | "messages"
  | "explore"
  | "students";

export type MentorDashboardProps = {
  name: string;
  memberId: string;
  avatarUrl?: string;
};

type Props = MentorDashboardProps & {
  initialPanel?: PanelType;
};

export default function MentorDashboardClient({
  name,
  memberId,
  avatarUrl,
  initialPanel = null,
}: Props) {
  useRefreshRoleOnce?.();

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [panel, setPanel] = useState<PanelType>(initialPanel);

  // Sync URL → state (e.g., /mentor/edit-profile forces "profile")
  useEffect(() => {
    if (pathname.endsWith("/mentor/edit-profile")) {
      setPanel("profile");
    } else if (pathname === "/mentor") {
      // If you want to auto-open Create from ?mode=create
      const mode = sp.get("mode");
      if (mode === "create") setPanel("create-course");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // State → URL helpers
  const openProfile = () => {
    setPanel("profile");
    router.push("/mentor/edit-profile");
  };

  const openCourses = () => {
    setPanel("courses");
    router.push("/mentor"); // your /mentor page shows courses when panel=courses
  };

  const openCreateCourse = () => {
    setPanel("create-course");
    router.push("/mentor?mode=create");
  };

  const closePanel = () => {
    setPanel(null);
    router.push("/mentor");
  };

  // Actions / Tiles (no Sidebar here; Sidebar is in layout)
  const actions = useMemo(
    () =>
      buildActions((p: PanelType) => {
        if (p === "profile") router.push("/mentor/edit-profile");
        else if (p === "courses") router.push("/mentor");
        setPanel(p);
      }),
    [router]
  );

  const tiles = useMemo(
    () =>
      buildTiles((p: PanelType) => {
        if (p === "profile") router.push("/mentor/edit-profile");
        else if (p === "create-course") router.push("/mentor?mode=create");
        else router.push("/mentor");
        setPanel(p);
      }),
    [router]
  );

  return (
      <div className="mx-auto max-w-7xl">
        {/* NOTE: Sidebar is handled in app/mentor/layout.tsx.
           That layout should define a grid and place {children} into the content span.
           Here we ONLY render the main content area. */}
        <section className="w-full">
          <MainArea
            actions={actions}
            panel={panel}
            memberId={memberId}
            onClosePanel={closePanel}
          />
        </section>
      </div>
  );
}
