"use client";

import { StackClientApp } from "@stackframe/stack";
import { defaultAuthUrls } from "./urls";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: defaultAuthUrls,
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
});

export const stackAuth = stackClientApp;