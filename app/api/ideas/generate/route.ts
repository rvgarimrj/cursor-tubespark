import { NextRequest, NextResponse } from 'next/server';
import { generateVideoIdeas } from '@/lib/ai/idea-generator';
import { VideoIdeaInput } from '@/types/ideas';
import { stackServerApp } from '@/lib/auth/stack-auth';

export async function POST(request: NextRequest) {
  try {
    // Get user from Stack Auth
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const input: VideoIdeaInput = await request.json();

    // Validate input
    if (!input.niche || !input.channelType || !input.audienceAge || !input.contentStyle) {
      return NextResponse.json(
        { error: 'Missing required fields: niche, channelType, audienceAge, contentStyle' },
        { status: 400 }
      );
    }

    // Generate ideas using OpenAI
    const ideas = await generateVideoIdeas(input);

    return NextResponse.json({
      success: true,
      ideas,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating ideas:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate ideas',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}