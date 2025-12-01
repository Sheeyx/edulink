// src/providers/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/* ===== Types ===== */
export type MemberRole = "STUDENT" | "MENTOR" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: MemberRole | null;
  image?: string | null;
} | null;

type AuthContextValue = {
  user: AuthUser;
  setUser: (u: AuthUser) => void;     // persists automatically
  logout: () => void;                 // clears tokens + user (all tabs sync)
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

function setTokens(access: string, refresh: string, accessSec: number, refreshSec: number) {
  try {
    localStorage.setItem("accessToken", access || "");
    localStorage.setItem("refreshToken", refresh || "");
    localStorage.setItem("accessTokenExpiresAt", String(Date.now() + (accessSec || 0) * 1000));
    localStorage.setItem("refreshTokenExpiresAt", String(Date.now() + (refreshSec || 0) * 1000));
  } catch {}
}
function clearTokens() {
  try {
    ["accessToken","refreshToken","accessTokenExpiresAt","refreshTokenExpiresAt"].forEach(k =>
      localStorage.removeItem(k)
    );
  } catch {}
}

/* ===== Context ===== */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ===== Provider ===== */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, _setUser] = useState<AuthUser>(null);

  // Load user on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.role && !validRoles.includes(parsed.role)) parsed.role = null;
      _setUser(parsed);
    } catch (err) {
      console.error("Failed to parse currentUser:", err);
      localStorage.removeItem("currentUser");
    }
  }, []);

  // Cross-tab sync (login/logout in other tab)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : null;
          _setUser(parsed);
        } catch {
          _setUser(null);
        }
      }
      if (e.key === "accessToken" && e.newValue === null) {
        // token cleared in another tab → ensure user is also cleared
        const snapshot = localStorage.getItem("currentUser");
        if (!snapshot) _setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persisting setter
  const setUser = (u: AuthUser) => {
    _setUser(u);
    try {
      if (u) localStorage.setItem("currentUser", JSON.stringify(u));
      else localStorage.removeItem("currentUser");
    } catch (err) {
      console.error("Failed to persist currentUser:", err);
    }
  };

  // Logout: clear tokens + user + broadcast via localStorage
  const logout = () => {
    clearTokens();
    try {
      localStorage.removeItem("currentUser");
    } catch {}
    _setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, setUser, logout, roleSafe, redirectByRole }),
    [user]
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
  try { return localStorage.getItem("accessToken"); } catch { return null; }
}
export function getRefreshToken(): string | null {
  try { return localStorage.getItem("refreshToken"); } catch { return null; }
}
export { setTokens, clearTokens, redirectByRole, roleSafe };
