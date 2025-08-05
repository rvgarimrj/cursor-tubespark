import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { VideoScript } from '@/types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id) {
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

    // Get specific script with idea information
    const { data: script, error: scriptError } = await supabase
      .from('video_scripts')
      .select(`
        *,
        video_ideas (
          id,
          title,
          description,
          category,
          trend_score,
          estimated_views,
          tags,
          target_audience,
          estimated_duration
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (scriptError) {
      if (scriptError.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false,
          error: 'Script not found' 
        }, { status: 404 });
      }
      
      console.error('Error fetching script:', scriptError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to fetch script' 
      }, { status: 500 });
    }

    // Transform data to match VideoScript interface
    const transformedScript: VideoScript = {
      id: script.id,
      ideaId: script.idea_id,
      userId: script.user_id,
      scriptType: script.script_type as 'basic' | 'premium',
      content: script.content,
      generationCost: script.generation_cost,
      wasUsed: script.was_used,
      publishedVideoUrl: script.published_video_url,
      createdAt: script.created_at,
      updatedAt: script.updated_at
    };

    return NextResponse.json({
      success: true,
      script: transformedScript,
      idea: script.video_ideas ? {
        id: script.video_ideas.id,
        title: script.video_ideas.title,
        description: script.video_ideas.description,
        niche: script.video_ideas.category,
        trendScore: script.video_ideas.trend_score,
        estimatedViews: `${script.video_ideas.estimated_views || 0}+`,
        tags: script.video_ideas.tags || [],
        channelType: script.video_ideas.target_audience || 'other',
        duration: script.video_ideas.estimated_duration || '5-10 min'
      } : null
    });

  } catch (error) {
    console.error('Error in GET /api/scripts/[id]:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
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
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (body.wasUsed !== undefined) {
      updateData.was_used = body.wasUsed;
    }

    if (body.publishedVideoUrl !== undefined) {
      updateData.published_video_url = body.publishedVideoUrl;
    }

    const { data: script, error: updateError } = await supabase
      .from('video_scripts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false,
          error: 'Script not found' 
        }, { status: 404 });
      }

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
    console.error('Error in PUT /api/scripts/[id]:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id) {
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

    // Delete script
    const { error: deleteError } = await supabase
      .from('video_scripts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting script:', deleteError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to delete script' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Script deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/scripts/[id]:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}