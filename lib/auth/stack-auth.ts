import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/pt/auth/signin",
    signUp: "/pt/auth/signup",
    afterSignIn: "/pt/dashboard",
    afterSignUp: "/pt/dashboard",
    afterSignOut: "/pt",
    home: "/pt/dashboard",
    forgotPassword: "/pt/auth/forgot-password",
    passwordReset: "/pt/auth/reset-password",
  },
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  clientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  serverKey: process.env.STACK_SECRET_SERVER_KEY!,
});

export const stackAuth = stackServerApp;