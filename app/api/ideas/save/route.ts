import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/supabase/ideas';
import { VideoIdea } from '@/types/ideas';
import { stackServerApp } from '@/lib/auth/stack-auth';

export async function POST(request: NextRequest) {
  try {
    // Get user from Stack Auth
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { idea }: { idea: VideoIdea } = await request.json();

    if (!idea) {
      return NextResponse.json({ error: 'Missing idea data' }, { status: 400 });
    }

    // Check user usage limits
    const usage = await IdeasService.getUserUsage(user.id);
    if (usage.used >= usage.limit) {
      return NextResponse.json(
        { error: 'Usage limit exceeded. Upgrade to Pro for unlimited ideas.' },
        { status: 429 }
      );
    }

    // Save idea to database
    const savedIdea = await IdeasService.saveIdea(idea, user.id);

    return NextResponse.json({
      success: true,
      idea: savedIdea
    });

  } catch (error) {
    console.error('Error saving idea:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to save idea',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}