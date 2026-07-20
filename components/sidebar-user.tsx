"use client";

import { SidebarSeparator } from "@/components/ui/sidebar";
import { clearAuth, getStoredAuth, getUserInitials } from "@/src/lib/auth";
import type { AuthUser } from "@/src/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SidebarUserFooter() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    function refreshUser() {
      setUser(getStoredAuth()?.user ?? null);
    }

    refreshUser();
    window.addEventListener("auth-user-updated", refreshUser);
    return () => window.removeEventListener("auth-user-updated", refreshUser);
  }, []);

  function handleSignOut() {
    clearAuth();
    router.push("/login");
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #a67c3e, #c49a4f)" }}
        >
          {user ? getUserInitials(user.name) : "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "#1C2541" }}
          >
            {user?.name ?? "Guest"}
          </p>
          <p className="truncate text-xs" style={{ color: "#9ca3af" }}>
            {user?.email ?? "Not signed in"}
          </p>
        </div>
      </div>

      <SidebarSeparator className="my-3" />

      {user ? (
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors bg-red-50"
          style={{ color: "#ef4444" }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      ) : (
        <Link
          href="/login"
          className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
          style={{ color: "#1C2541" }}
        >
          Sign In
        </Link>
      )}
    </>
  );
}
