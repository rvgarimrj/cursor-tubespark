"use client";

import { StackProvider } from "@stackframe/stack";
import { stackClientApp } from "./client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <StackProvider app={stackClientApp}>{children}</StackProvider>;
}