import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EngagementType, EngagementEvent } from '@/types';
import { z } from 'zod';

// Request validation schema
const TrackEngagementSchema = z.object({
  ideaId: z.string().uuid(),
  engagementType: z.enum(['favorite', 'share', 'copy', 'time_spent', 'expand', 'click_script']),
  engagementValue: z.record(z.any()).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = TrackEngagementSchema.parse(body);
    const { ideaId, engagementType, engagementValue } = validatedData;
    
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Verify the idea belongs to the user
    const { data: idea, error: ideaError } = await supabase
      .from('video_ideas')
      .select('id')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ 
        success: false,
        error: 'Video idea not found' 
      }, { status: 404 });
    }

    // Save engagement event
    const { data: engagement, error: saveError } = await supabase
      .from('engagement_tracking')
      .insert({
        user_id: user.id,
        idea_id: ideaId,
        engagement_type: engagementType,
        engagement_value: engagementValue || null
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving engagement:', saveError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to track engagement' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      engagementId: engagement.id,
      message: 'Engagement tracked successfully'
    });

  } catch (error) {
    console.error('Engagement tracking error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to track engagement. Please try again.'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve engagement stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get('ideaId');
    const timeframe = searchParams.get('timeframe') || '7d'; // 1d, 7d, 30d, 90d

    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Calculate date range
    const now = new Date();
    const timeframes = {
      '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    } as const;

    const startDate = timeframes[timeframe as keyof typeof timeframes] || timeframes['7d'];

    let query = supabase
      .from('engagement_tracking')
      .select(`
        *,
        video_ideas (
          id,
          title,
          category
        )
      `)
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (ideaId) {
      query = query.eq('idea_id', ideaId);
    }

    const { data: engagements, error } = await query;

    if (error) {
      console.error('Error fetching engagements:', error);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to fetch engagement data' 
      }, { status: 500 });
    }

    // Process engagement statistics
    const stats = {
      totalEvents: engagements?.length || 0,
      byType: {} as Record<EngagementType, number>,
      byIdea: {} as Record<string, { title: string; count: number; types: Record<EngagementType, number> }>,
      timeline: [] as Array<{ date: string; count: number; types: Record<EngagementType, number> }>,
      topIdeas: [] as Array<{ ideaId: string; title: string; totalEngagement: number }>
    };

    // Initialize engagement type counters
    const engagementTypes: EngagementType[] = ['favorite', 'share', 'copy', 'time_spent', 'expand', 'click_script'];
    engagementTypes.forEach(type => {
      stats.byType[type] = 0;
    });

    // Process each engagement event
    engagements?.forEach(engagement => {
      const type = engagement.engagement_type as EngagementType;
      const ideaId = engagement.idea_id;
      const ideaTitle = engagement.video_ideas?.title || 'Unknown Idea';
      const date = new Date(engagement.created_at).toISOString().split('T')[0];

      // Count by type
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // Count by idea
      if (!stats.byIdea[ideaId]) {
        stats.byIdea[ideaId] = {
          title: ideaTitle,
          count: 0,
          types: {} as Record<EngagementType, number>
        };
        engagementTypes.forEach(t => {
          stats.byIdea[ideaId].types[t] = 0;
        });
      }
      stats.byIdea[ideaId].count += 1;
      stats.byIdea[ideaId].types[type] += 1;

      // Timeline data
      let timelineEntry = stats.timeline.find(entry => entry.date === date);
      if (!timelineEntry) {
        timelineEntry = {
          date,
          count: 0,
          types: {} as Record<EngagementType, number>
        };
        engagementTypes.forEach(t => {
          timelineEntry!.types[t] = 0;
        });
        stats.timeline.push(timelineEntry);
      }
      timelineEntry.count += 1;
      timelineEntry.types[type] += 1;
    });

    // Sort timeline by date
    stats.timeline.sort((a, b) => a.date.localeCompare(b.date));

    // Generate top ideas
    stats.topIdeas = Object.entries(stats.byIdea)
      .map(([ideaId, data]) => ({
        ideaId,
        title: data.title,
        totalEngagement: data.count
      }))
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      stats,
      timeframe,
      period: {
        start: startDate.toISOString(),
        end: now.toISOString()
      }
    });

  } catch (error) {
    console.error('Error in GET /api/engagement/track:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}