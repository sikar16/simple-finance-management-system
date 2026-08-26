"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuth, clearAuth } from "@/src/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const auth = getStoredAuth();
      
      if (!auth) {
        clearAuth();
        setIsAuthenticated(false);
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes (e.g., logout)
    const handleAuthChange = () => {
      const auth = getStoredAuth();
      if (!auth) {
        setIsAuthenticated(false);
        router.push("/login");
      }
    };

    window.addEventListener("auth-user-updated", handleAuthChange);
    
    // Check auth on storage changes (for handling multiple tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" && e.newValue === null) {
        setIsAuthenticated(false);
        router.push("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth-user-updated", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
