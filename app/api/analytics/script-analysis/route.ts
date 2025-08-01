import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { YouTubeNativeAnalyticsService } from '@/lib/analytics/youtube-native-analytics';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { script, channelData } = body;

    if (!script) {
      return NextResponse.json({
        success: false,
        error: 'Script is required'
      }, { status: 400 });
    }

    // Analyze the script
    const analysis = await YouTubeNativeAnalyticsService.analyzeScript(script, channelData);

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error analyzing script:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'performance-comparison':
        const comparison = await YouTubeNativeAnalyticsService.getPerformanceComparison(user.id);
        return NextResponse.json({
          success: true,
          comparison
        });

      case 'user-summary':
        const summary = await YouTubeNativeAnalyticsService.getUserScriptSummary(user.id);
        return NextResponse.json({
          success: true,
          summary
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}