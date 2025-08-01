import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/auth/stack-auth";
import { OAuthRedirectHandler } from "@/components/auth/oauth-redirect-handler";

export default function Handler(props: any) {
  return (
    <>
      <OAuthRedirectHandler />
      <StackHandler app={stackServerApp} routeProps={props} fullPage />
    </>
  );
}