import { StackServerApp } from '@stackframe/stack';

const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
});

export async function getAuth() {
  try {
    const user = await stackServerApp.getUser();
    return { user, error: null };
  } catch (error) {
    console.error('Authentication error:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Authentication failed' };
  }
}

export { stackServerApp };