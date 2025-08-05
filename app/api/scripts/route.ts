import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { VideoScript } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get user's scripts with idea information
    const { data: scripts, error: scriptsError } = await supabase
      .from('video_scripts')
      .select(`
        *,
        video_ideas (
          id,
          title,
          description,
          category,
          trend_score,
          estimated_views
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (scriptsError) {
      console.error('Error fetching scripts:', scriptsError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to fetch scripts' 
      }, { status: 500 });
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('video_scripts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error counting scripts:', countError);
    }

    // Transform data to match VideoScript interface
    const transformedScripts = scripts?.map(script => ({
      id: script.id,
      ideaId: script.idea_id,
      userId: script.user_id,
      scriptType: script.script_type as 'basic' | 'premium',
      content: script.content,
      generationCost: script.generation_cost,
      wasUsed: script.was_used,
      publishedVideoUrl: script.published_video_url,
      createdAt: script.created_at,
      updatedAt: script.updated_at,
      idea: script.video_ideas ? {
        id: script.video_ideas.id,
        title: script.video_ideas.title,
        description: script.video_ideas.description,
        niche: script.video_ideas.category,
        trendScore: script.video_ideas.trend_score,
        estimatedViews: `${script.video_ideas.estimated_views || 0}+`
      } : undefined
    })) || [];

    return NextResponse.json({
      success: true,
      scripts: transformedScripts,
      pagination: {
        total: count || 0,
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in GET /api/scripts:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Get specific script by ID
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { scriptId, updates } = body;
    
    if (!scriptId) {
      return NextResponse.json({ 
        success: false,
        error: 'Script ID is required' 
      }, { status: 400 });
    }

    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Update script
    const { data: script, error: updateError } = await supabase
      .from('video_scripts')
      .update({
        was_used: updates.wasUsed,
        published_video_url: updates.publishedVideoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', scriptId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating script:', updateError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to update script' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      script,
      message: 'Script updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/scripts:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}