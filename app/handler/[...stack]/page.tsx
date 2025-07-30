import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/auth/stack-auth";

export default function Handler(props: any) {
  return <StackHandler app={stackServerApp} routeProps={props} />;
}