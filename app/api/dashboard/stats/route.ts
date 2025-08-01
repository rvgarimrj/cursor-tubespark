import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/supabase/ideas';
import { stackServerApp } from '@/lib/auth/stack-auth';

export async function GET(request: NextRequest) {
  try {
    // Get user from Stack Auth
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user stats from database
    const stats = await IdeasService.getUserStats(user.id);
    const usage = await IdeasService.getUserUsage(user.id);

    return NextResponse.json({
      success: true,
      stats: {
        ideasGenerated: stats.totalIdeas,
        ideasThisMonth: stats.ideasThisMonth,
        videosPlanned: stats.plannedIdeas,
        trendsTracked: 0, // TODO: Implement trending topics
        competitors: 0, // TODO: Implement competitor analysis
        usage
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}