import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // Get current month/year for filtering
    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthYear = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    // Get user's subscription info
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', user.id)
      .maybeSingle();

    const planType = subscription?.plan_type || 'free';
    const isPaid = planType !== 'free';

    // Get ideas generated
    const { data: ideas, error: ideasError } = await supabase
      .from('video_ideas')
      .select('id, created_at')
      .eq('user_id', user.id)
      .gte('created_at', `${currentMonthYear}-01`);

    if (ideasError) {
      console.error('Error fetching ideas:', ideasError);
    }

    // Get engagement data
    const { data: engagements, error: engagementsError } = await supabase
      .from('engagement_tracking')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${currentMonthYear}-01`);

    if (engagementsError) {
      console.error('Error fetching engagements:', engagementsError);
    }

    // Get scripts generated
    const { data: scripts, error: scriptsError } = await supabase
      .from('video_scripts')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${currentMonthYear}-01`);

    if (scriptsError) {
      console.error('Error fetching scripts:', scriptsError);
    }

    // Calculate metrics
    const ideasGenerated = ideas?.length || 0;
    const scriptsGenerated = scripts?.length || 0;
    const totalEngagements = engagements?.length || 0;
    
    const favoriteEngagements = engagements?.filter(e => e.engagement_type === 'favorite').length || 0;
    const shareEngagements = engagements?.filter(e => e.engagement_type === 'share').length || 0;
    const scriptClickEngagements = engagements?.filter(e => e.engagement_type === 'click_script').length || 0;

    // Calculate conversion rates
    const ideaToEngagementRate = ideasGenerated > 0 ? (totalEngagements / ideasGenerated) * 100 : 0;
    const engagementToScriptRate = totalEngagements > 0 ? (scriptsGenerated / totalEngagements) * 100 : 0;
    const freeToUpgradeRate = isPaid ? 100 : 0; // If user is paid, they converted

    // Calculate average engagement time
    const timeSpentEngagements = engagements?.filter(e => 
      e.engagement_type === 'time_spent' && e.engagement_value?.time_spent
    ) || [];
    
    const avgEngagementTime = timeSpentEngagements.length > 0
      ? timeSpentEngagements.reduce((sum, e) => sum + (e.engagement_value?.time_spent || 0), 0) / timeSpentEngagements.length
      : 0;

    // Get top performing ideas (most engaged)
    const ideaEngagementCounts = ideas?.map(idea => {
      const ideaEngagements = engagements?.filter(e => e.idea_id === idea.id) || [];
      const engagementScore = ideaEngagements.length;
      const wasUsedForScript = scripts?.some(script => script.idea_id === idea.id) || false;
      
      return {
        id: idea.id,
        engagementScore,
        wasUsedForScript
      };
    }) || [];

    // Sort by engagement score and get top 5
    const topPerformingIdeas = ideaEngagementCounts
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 5);

    // Get idea titles for top performing
    const topIdeaIds = topPerformingIdeas.map(idea => idea.id);
    const { data: topIdeasData } = await supabase
      .from('video_ideas')
      .select('id, title')
      .in('id', topIdeaIds);

    const topPerformingWithTitles = topPerformingIdeas.map(idea => ({
      ...idea,
      title: topIdeasData?.find(d => d.id === idea.id)?.title || 'Unknown Idea',
      wasPublished: false // TODO: Implement when we have video publishing data
    }));

    // Calculate success rate (ideas that led to scripts)
    const successfulIdeas = ideaEngagementCounts.filter(idea => idea.wasUsedForScript).length;
    const successRate = ideasGenerated > 0 ? (successfulIdeas / ideasGenerated) * 100 : 0;

    const conversionMetrics = {
      ideasGenerated,
      ideasFavorited: favoriteEngagements,
      scriptsGenerated,
      ideasPublished: 0, // TODO: Implement when we have publishing data
      successRate,
      avgEngagementTime: Math.round(avgEngagementTime / 1000), // Convert to seconds
      topPerformingIdeas: topPerformingWithTitles,
      conversionRates: {
        ideaToEngagement: Math.round(ideaToEngagementRate * 100) / 100,
        engagementToScript: Math.round(engagementToScriptRate * 100) / 100,
        freeToUpgrade: freeToUpgradeRate
      },
      monthlyTrends: {
        currentMonth: currentMonthYear,
        planType,
        isPaidUser: isPaid
      }
    };

    return NextResponse.json({
      success: true,
      metrics: conversionMetrics
    });

  } catch (error) {
    console.error('Error fetching conversion metrics:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}