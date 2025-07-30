import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
    afterSignOut: "/",
    home: "/dashboard",
    forgotPassword: "/auth/forgot-password",
    passwordReset: "/auth/reset-password",
  },
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  clientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  serverKey: process.env.STACK_SECRET_SERVER_KEY!,
});

export const stackAuth = stackServerApp;