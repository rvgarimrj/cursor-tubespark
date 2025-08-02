import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/auth/server";

export default function Handler(props: any) {
  return <StackHandler app={stackServerApp} routeProps={props} fullPage />;
}