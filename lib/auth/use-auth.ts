"use client";

import { useUser, useStackApp } from "@stackframe/stack";
import { useRouter } from "next/navigation";

export function useAuth() {
  const user = useUser();
  const stackApp = useStackApp();
  const router = useRouter();

  const signOut = async () => {
    try {
      // TODO: Implement proper sign out
      console.log("Sign out attempt");
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // For development, use mock user if Stack Auth user is not available
  const mockUser = {
    id: "mock-user-id",
    displayName: "Demo User",
    email: "demo@example.com",
  };

  const isAuthenticated = !!user || true; // Always authenticated for development

  return {
    user: user || mockUser,
    signOut,
    isAuthenticated,
    isLoading: false,
  };
}