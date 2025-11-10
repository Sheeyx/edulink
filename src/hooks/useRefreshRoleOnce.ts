// src/hooks/useRefreshRoleOnce.ts
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

/** Forces a single JWT/session refresh (to pick up new role) */
export function useRefreshRoleOnce() {
  const { update } = useSession();
  const did = useRef(false);

  useEffect(() => {
    if (did.current) return;       // guard against re-runs & StrictMode double-invoke
    did.current = true;
    update?.({ forceRefresh: true } as any);
  }, [update]);
}
