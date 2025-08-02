import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { 
  CreatorApplicationRequest, 
  CreatorApplicationResponse,
  ChannelAnalysis,
  AffiliateTier,
  AffiliateStatus
} from '@/types/creators';

// Import the channel analysis function
async function analyzeYouTubeChannel(channelUrl: string): Promise<ChannelAnalysis> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/creators/analyze-channel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channelUrl }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze channel');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Channel analysis failed');
  }

  return data.analysis;
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuth();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: CreatorApplicationRequest = await request.json();
    const { channelUrl, contactEmail, applicationNotes, agreesToTerms } = body;

    // Validate required fields
    if (!channelUrl || !contactEmail || !agreesToTerms) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: channelUrl, contactEmail, and agreesToTerms are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email address format'
      }, { status: 400 });
    }

    // Validate YouTube URL format
    const youtubeUrlPattern = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/;
    if (!youtubeUrlPattern.test(channelUrl)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid YouTube channel URL'
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Check if user already has an application
    const { data: existingAffiliate, error: checkError } = await supabase
      .from('affiliates')
      .select('id, status, channel_url')
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing affiliate:', checkError);
      return NextResponse.json({
        success: false,
        error: 'Failed to check existing application'
      }, { status: 500 });
    }

    if (existingAffiliate) {
      return NextResponse.json({
        success: false,
        error: `You already have an application with status: ${existingAffiliate.status}. Contact support if you need to update your application.`
      }, { status: 409 });
    }

    // Check if this channel URL is already registered
    const { data: existingChannel, error: channelCheckError } = await supabase
      .from('affiliates')
      .select('id, user_id, channel_name')
      .eq('channel_url', channelUrl)
      .single();

    if (channelCheckError && channelCheckError.code !== 'PGRST116') {
      console.error('Error checking existing channel:', channelCheckError);
      return NextResponse.json({
        success: false,
        error: 'Failed to validate channel uniqueness'
      }, { status: 500 });
    }

    if (existingChannel) {
      return NextResponse.json({
        success: false,
        error: 'This YouTube channel is already registered in our affiliate program'
      }, { status: 409 });
    }

    // Analyze the channel
    let analysis: ChannelAnalysis;
    try {
      analysis = await analyzeYouTubeChannel(channelUrl);
    } catch (error) {
      console.error('Channel analysis failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to analyze YouTube channel. Please ensure the URL is correct and the channel is public.'
      }, { status: 400 });
    }

    // Check minimum requirements (at least 1000 subscribers for Bronze tier)
    if (analysis.subscriberCount < 1000) {
      return NextResponse.json({
        success: false,
        error: 'Channel does not meet minimum requirements. You need at least 1,000 subscribers to join our affiliate program.'
      }, { status: 400 });
    }

    // Extract channel ID from the analysis
    const channelId = analysis.channelId;

    // Create affiliate application
    const affiliateData = {
      user_id: user.id,
      youtube_channel_id: channelId,
      youtube_channel_handle: analysis.channelHandle,
      channel_name: analysis.channelName,
      channel_url: channelUrl,
      subscriber_count: analysis.subscriberCount,
      average_views: analysis.averageViews,
      total_videos: analysis.totalVideos,
      channel_country: analysis.channelCountry,
      channel_language: analysis.channelLanguage,
      main_categories: analysis.mainCategories,
      tier: analysis.suggestedTier,
      status: 'pending' as AffiliateStatus,
      commission_rate: analysis.commissionRate,
      commission_duration_months: analysis.suggestedTier === 'gold' ? null : 
                                   analysis.suggestedTier === 'silver' ? 18 : 12,
      contact_email: contactEmail,
      application_notes: applicationNotes
    };

    const { data: newAffiliate, error: createError } = await supabase
      .from('affiliates')
      .insert(affiliateData)
      .select()
      .single();

    if (createError) {
      console.error('Error creating affiliate application:', createError);
      return NextResponse.json({
        success: false,
        error: 'Failed to submit application. Please try again.'
      }, { status: 500 });
    }

    // Create initial coupon for the affiliate (they can use this once approved)
    const couponCode = `${analysis.suggestedTier.toUpperCase()}${channelId.slice(-6)}`;
    const discountValue = analysis.suggestedTier === 'gold' ? 40 : 
                         analysis.suggestedTier === 'silver' ? 30 : 20;

    const couponData = {
      affiliate_id: newAffiliate.id,
      code: couponCode,
      discount_type: 'percentage',
      discount_value: discountValue,
      description: `${discountValue}% discount from ${analysis.channelName}`,
      max_uses: null, // Unlimited uses
      max_uses_per_user: 1,
      min_purchase_amount: 0,
      applicable_plans: ['starter', 'pro', 'business'],
      is_active: false // Will be activated when affiliate is approved
    };

    const { error: couponError } = await supabase
      .from('discount_coupons')
      .insert(couponData);

    if (couponError) {
      console.error('Error creating initial coupon:', couponError);
      // Don't fail the application if coupon creation fails
    }

    // Log the application activity
    const activityData = {
      affiliate_id: newAffiliate.id,
      activity_type: 'application',
      description: `Creator applied for ${analysis.suggestedTier} tier affiliate program`,
      metadata: {
        channel_analysis: analysis,
        application_notes: applicationNotes,
        submitted_at: new Date().toISOString()
      }
    };

    const { error: activityError } = await supabase
      .from('affiliate_activities')
      .insert(activityData);

    if (activityError) {
      console.error('Error logging affiliate activity:', activityError);
      // Don't fail the application if activity logging fails
    }

    const response: CreatorApplicationResponse = {
      success: true,
      application: {
        id: newAffiliate.id,
        status: newAffiliate.status,
        suggestedTier: newAffiliate.tier,
        analysis
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Creator application error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Application submission failed'
    }, { status: 500 });
  }
}

// GET endpoint to check application status
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuth();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get user's affiliate application
    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .select(`
        id,
        status,
        tier,
        channel_name,
        channel_url,
        subscriber_count,
        total_conversions,
        total_commissions_earned,
        conversion_rate,
        created_at,
        approved_at,
        commission_rate
      `)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching affiliate status:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch application status'
      }, { status: 500 });
    }

    if (!affiliate) {
      return NextResponse.json({
        success: true,
        hasApplication: false
      });
    }

    // Get coupon info if approved
    let coupon = null;
    if (affiliate.status === 'approved') {
      const { data: couponData } = await supabase
        .from('discount_coupons')
        .select('code, discount_value, is_active')
        .eq('affiliate_id', affiliate.id)
        .single();
      
      coupon = couponData;
    }

    return NextResponse.json({
      success: true,
      hasApplication: true,
      application: {
        ...affiliate,
        coupon
      }
    });

  } catch (error) {
    console.error('Application status check error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check application status'
    }, { status: 500 });
  }
}