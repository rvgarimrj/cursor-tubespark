"use client";

import { useUser, useStackApp } from "@stackframe/stack";
import { useRouter } from "next/navigation";

export function useAuth() {
  const user = useUser();
  const stackApp = useStackApp();
  const router = useRouter();

  const signOut = async () => {
    try {
      await user?.signOut();
      console.log("Sign out successful");
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const isAuthenticated = !!user;

  return {
    user,
    signOut,
    isAuthenticated,
    isLoading: false,
  };
}