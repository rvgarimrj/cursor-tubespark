import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateVideoScript } from '@/lib/ai/script-generator';
import { YouTubeNativeAnalyticsService } from '@/lib/analytics/youtube-native-analytics';
import { checkUserLimits, incrementUsage } from '@/lib/billing/limits';
import { ScriptGenerationRequest, ScriptType, VideoIdea } from '@/types';
import { z } from 'zod';

// Enhanced request validation schema with YouTube-Native support
const GenerateScriptSchema = z.object({
  ideaId: z.string().uuid(),
  scriptType: z.enum(['basic', 'premium']),
  frameworkType: z.enum(['youtube_native', 'traditional']).default('youtube_native'),
  customizations: z.object({
    tone: z.enum(['professional', 'casual', 'energetic']).optional(),
    duration: z.enum(['short', 'medium', 'long']).optional(),
    audience: z.string().max(100).optional()
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = GenerateScriptSchema.parse(body);
    const { ideaId, scriptType, frameworkType, customizations } = validatedData;
    
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get the video idea
    const { data: idea, error: ideaError } = await supabase
      .from('video_ideas')
      .select('*')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ 
        success: false,
        error: 'Video idea not found' 
      }, { status: 404 });
    }

    // Check user limits
    const action = scriptType === 'basic' ? 'script_basic' : 'script_premium';
    const limitsCheck = await checkUserLimits(user.id, action);
    
    if (!limitsCheck.allowed) {
      return NextResponse.json({ 
        success: false,
        error: 'UPGRADE_REQUIRED',
        message: `You have reached your ${scriptType} script limit for this month. Upgrade your plan to generate more scripts.`,
        limits: limitsCheck
      }, { status: 402 });
    }

    // Check if script already exists for this idea, type and framework
    const { data: existingScript } = await supabase
      .from('video_scripts')
      .select('id')
      .eq('idea_id', ideaId)
      .eq('user_id', user.id)
      .eq('script_type', scriptType)
      .eq('framework_type', frameworkType)
      .single();

    if (existingScript) {
      return NextResponse.json({ 
        success: false,
        error: 'Script already exists for this idea, type and framework',
        scriptId: existingScript.id
      }, { status: 409 });
    }

    // Get comprehensive YouTube/channel data for personalization
    let youtubeData = undefined;
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('youtube_channel_id')
        .eq('id', user.id)
        .single();

      if (userProfile?.youtube_channel_id) {
        // Fetch comprehensive YouTube channel data
        const { data: channelData } = await supabase
          .from('youtube_channels')
          .select('*')
          .eq('id', userProfile.youtube_channel_id)
          .single();

        if (channelData) {
          // Get top performing videos for personalization
          const { data: topVideos } = await supabase
            .from('youtube_videos')
            .select('title, views, engagement_rate')
            .eq('channel_id', userProfile.youtube_channel_id)
            .order('views', { ascending: false })
            .limit(5);

          youtubeData = {
            channelTitle: channelData.title,
            niche: channelData.category || idea.niche || 'general',
            demographics: `${channelData.category} audience with ${channelData.subscriber_count} subscribers`,
            averageViews: channelData.average_views,
            averageEngagement: channelData.average_engagement_rate,
            topPerformingVideos: topVideos?.map(video => ({
              title: video.title,
              views: video.views,
              engagement: video.engagement_rate
            })) || [],
            successPatterns: channelData.success_patterns || ['storytelling', 'practical value'],
            bestPerformingHours: channelData.best_posting_hours || '19:00-21:00',
            audienceStyle: channelData.audience_style || 'engaged and curious'
          };
        }
      }

      // If no YouTube data, create basic data from idea
      if (!youtubeData) {
        youtubeData = {
          niche: idea.niche || idea.channelType || 'general',
          demographics: `${idea.channelType} audience`,
          audienceStyle: 'general YouTube audience'
        };
      }
    } catch (error) {
      console.log('No YouTube data available for personalization, using defaults');
      youtubeData = {
        niche: idea.niche || idea.channelType || 'general',
        demographics: `${idea.channelType} audience`,
        audienceStyle: 'general YouTube audience'
      };
    }

    // Generate the script using enhanced AI with framework selection
    const script = await generateVideoScript({
      idea: idea as VideoIdea,
      scriptType,
      frameworkType,
      youtubeData,
      customizations
    });

    // Analyze the generated script for performance predictions
    const analysis = await YouTubeNativeAnalyticsService.analyzeScript(script, youtubeData);

    // Save script with complete analysis using the analytics service
    const scriptId = await YouTubeNativeAnalyticsService.saveScriptWithAnalysis(
      user.id,
      ideaId,
      script,
      analysis
    );

    // Increment usage counter
    const usageResult = await incrementUsage(user.id, action);
    if (!usageResult.success) {
      console.error('Failed to increment usage:', usageResult.error);
      // Don't fail the request, just log the error
    }

    // Track enhanced engagement event with framework information
    try {
      await supabase
        .from('engagement_tracking')
        .insert({
          user_id: user.id,
          idea_id: ideaId,
          engagement_type: 'click_script',
          engagement_value: {
            scriptType,
            frameworkType,
            fromLocation: 'idea_modal',
            hookStrength: analysis.hookStrength,
            predictedRetention: analysis.retentionPrediction
          }
        });
    } catch (error) {
      console.error('Failed to track engagement:', error);
      // Don't fail the request
    }

    // Get the saved script with all analysis data
    const { data: savedScript } = await supabase
      .from('video_scripts')
      .select('*')
      .eq('id', scriptId)
      .single();

    return NextResponse.json({
      success: true,
      scriptId,
      script: {
        id: savedScript.id,
        ideaId: savedScript.idea_id,
        userId: savedScript.user_id,
        scriptType: savedScript.script_type,
        frameworkType: savedScript.framework_type,
        content: savedScript.content,
        generationCost: savedScript.generation_cost,
        createdAt: savedScript.created_at,
        // Include performance predictions
        hookStrength: savedScript.hook_strength,
        retentionScore: savedScript.retention_score,
        predictedRetention: savedScript.predicted_retention,
        predictedEngagement: savedScript.predicted_engagement,
        confidenceLevel: savedScript.confidence_level,
        viralFactors: savedScript.viral_factors
      },
      analysis: {
        hookStrength: analysis.hookStrength,
        retentionPrediction: analysis.retentionPrediction,
        engagementPrediction: analysis.engagementPrediction,
        viralElements: analysis.viralElements,
        overallQualityScore: analysis.overallQualityScore,
        confidenceLevel: analysis.confidenceLevel,
        performancePrediction: analysis.performancePrediction
      },
      message: `${scriptType === 'basic' ? 'Basic' : 'Premium'} ${frameworkType === 'youtube_native' ? 'YouTube-Native' : 'Traditional'} script generated successfully!`,
      frameworkBenefits: frameworkType === 'youtube_native' ? {
        expectedRetentionIncrease: '42%',
        expectedEngagementIncrease: '180%', 
        algorithmBoost: '300%'
      } : null
    });

  } catch (error) {
    console.error('Script generation error:', error);
    
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
      message: 'Failed to generate script. Please try again.'
    }, { status: 500 });
  }
}

// Enhanced GET endpoint to retrieve scripts with analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get('ideaId');
    const scriptType = searchParams.get('scriptType') as ScriptType;
    const frameworkType = searchParams.get('frameworkType');
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';

    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Build enhanced query with all YouTube-Native fields
    let query = supabase
      .from('video_scripts')
      .select(`
        *,
        video_ideas (
          id,
          title,
          category,
          tags,
          niche,
          channelType
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ideaId) {
      query = query.eq('idea_id', ideaId);
    }

    if (scriptType) {
      query = query.eq('script_type', scriptType);
    }

    if (frameworkType) {
      query = query.eq('framework_type', frameworkType);
    }

    const { data: scripts, error } = await query;

    if (error) {
      console.error('Error fetching scripts:', error);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to fetch scripts' 
      }, { status: 500 });
    }

    // Enhance scripts with analytics summary if requested
    let enhancedScripts = scripts || [];
    if (includeAnalytics && scripts?.length) {
      enhancedScripts = scripts.map(script => ({
        ...script,
        analytics: {
          hookStrength: script.hook_strength,
          retentionPrediction: script.predicted_retention,
          engagementPrediction: script.predicted_engagement,
          qualityScore: script.retention_score,
          confidenceLevel: script.confidence_level,
          viralFactorCount: script.viral_factors?.length || 0,
          frameworkAdvantage: script.framework_type === 'youtube_native' ? {
            retentionBonus: '+42%',
            engagementBonus: '+180%',
            algorithmBonus: '+300%'
          } : null
        }
      }));
    }

    // Get performance summary for the user
    let performanceSummary = null;
    if (includeAnalytics) {
      try {
        performanceSummary = await YouTubeNativeAnalyticsService.getUserScriptSummary(user.id);
      } catch (error) {
        console.error('Error fetching performance summary:', error);
      }
    }

    return NextResponse.json({
      success: true,
      scripts: enhancedScripts,
      count: scripts?.length || 0,
      performanceSummary,
      frameworkDistribution: scripts ? {
        youtubeNative: scripts.filter(s => s.framework_type === 'youtube_native').length,
        traditional: scripts.filter(s => s.framework_type === 'traditional').length
      } : null
    });

  } catch (error) {
    console.error('Error in GET /api/scripts/generate:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}