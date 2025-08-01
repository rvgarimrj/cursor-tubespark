import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/supabase/ideas';
import { stackServerApp } from '@/lib/auth/stack-auth';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/ideas - Starting request');
    
    // Get user from Stack Auth
    const user = await stackServerApp.getUser();
    console.log('User from Stack Auth:', user ? { id: user.id, email: user.primaryEmail } : 'No user');
    
    if (!user) {
      console.log('No user found, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching ideas for user:', user.id);
    
    // Get user ideas from database
    const ideas = await IdeasService.getUserIdeas(user.id);
    console.log('Ideas fetched from database:', ideas.length, 'ideas');

    return NextResponse.json({
      success: true,
      ideas
    });

  } catch (error) {
    console.error('Error fetching ideas:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch ideas',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}