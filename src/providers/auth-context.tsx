"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/* ===== Types ===== */
export type MemberRole = "STUDENT" | "MENTOR" | "ADMIN";

export type AuthUser = {
  // ✅ required basics
  id: string;
  email: string;

  // ✅ optional basics
  name?: string | null;
  role?: MemberRole | null;
  image?: string | null;

  // ✅ member fields (needed for profile panel)
  _id?: string; // sometimes backend returns _id
  memberFullName?: string | null;
  memberPhone?: string | null;
  memberBio?: string | null;
  memberImage?: string | null;
  memberStatus?: string | null;
  memberAuth?: string | null;

  // ✅ tokens (optional)
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresIn?: number | null;
  refreshTokenExpiresIn?: number | null;
} | null;

type SetUserAction = AuthUser | ((prev: AuthUser) => AuthUser);

type AuthContextValue = {
  user: AuthUser;

  /**
   * True once the initial localStorage read has completed. Until then,
   * `user` is always null even for a logged-in visitor — consumers that
   * render differently for logged-in/out (e.g. the navbar) should show a
   * neutral skeleton while `!ready` instead of assuming "logged out".
   */
  ready: boolean;

  /**
   * ✅ now supports:
   * setUser(userObject)
   * setUser(prev => ({...prev, ...patch}))
   */
  setUser: (u: SetUserAction) => void;

  logout: () => void;
  roleSafe: (r?: string | null) => MemberRole;
  redirectByRole: (r?: string | null) => "/user" | "/mentor" | "/dashboard";
};

/* ===== Helpers ===== */
const validRoles = ["STUDENT", "MENTOR", "ADMIN"] as const;

function roleSafe(r?: string | null): MemberRole {
  const v = (r ?? "").toUpperCase();
  return (validRoles as readonly string[]).includes(v) ? (v as MemberRole) : "STUDENT";
}

function redirectByRole(r?: string | null) {
  const v = roleSafe(r);
  if (v === "MENTOR") return "/mentor";
  if (v === "ADMIN") return "/dashboard";
  return "/user";
}

export function setTokens(access: string, refresh: string, accessSec: number, refreshSec: number) {
  try {
    localStorage.setItem("accessToken", access || "");
    localStorage.setItem("refreshToken", refresh || "");
    localStorage.setItem("accessTokenExpiresAt", String(Date.now() + (accessSec || 0) * 1000));
    localStorage.setItem("refreshTokenExpiresAt", String(Date.now() + (refreshSec || 0) * 1000));
  } catch {}
}

export function clearTokens() {
  try {
    ["accessToken", "refreshToken", "accessTokenExpiresAt", "refreshTokenExpiresAt"].forEach((k) =>
      localStorage.removeItem(k)
    );
  } catch {}
}

/* ===== Context ===== */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ===== Provider ===== */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, _setUser] = useState<AuthUser>(null);
  const [ready, setReady] = useState(false);

  // Load user on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) {
        const parsed = JSON.parse(raw);

        // normalize role
        if (parsed?.role) parsed.role = roleSafe(parsed.role);

        _setUser(parsed);
      }
    } catch (err) {
      console.error("Failed to parse currentUser:", err);
      localStorage.removeItem("currentUser");
      _setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : null;
          if (parsed?.role) parsed.role = roleSafe(parsed.role);
          _setUser(parsed);
        } catch {
          _setUser(null);
        }
      }

      if (e.key === "accessToken" && e.newValue === null) {
        // token cleared in another tab → ensure user cleared too
        const snapshot = localStorage.getItem("currentUser");
        if (!snapshot) _setUser(null);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persisting setter (supports function updater)
  const setUser = (action: SetUserAction) => {
    _setUser((prev) => {
      const next = typeof action === "function" ? (action as any)(prev) : action;

      try {
        if (next) localStorage.setItem("currentUser", JSON.stringify(next));
        else localStorage.removeItem("currentUser");
      } catch (err) {
        console.error("Failed to persist currentUser:", err);
      }

      return next;
    });
  };

  const logout = () => {
    clearTokens();
    try {
      localStorage.removeItem("currentUser");
    } catch {}
    _setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, setUser, logout, roleSafe, redirectByRole }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ===== Hook ===== */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("❌ useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ===== Optional exports for callers that need tokens ===== */
export function getAccessToken(): string | null {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}
export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem("refreshToken");
  } catch {
    return null;
  }
}

export { redirectByRole, roleSafe };
