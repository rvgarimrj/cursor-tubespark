import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

const webhookSecret = process.env.YOUTUBE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    
    // Verify webhook signature
    const signature = headersList.get('x-youtube-signature');
    const timestamp = headersList.get('x-youtube-timestamp');
    
    if (!signature || !timestamp) {
      console.error('Missing YouTube webhook headers');
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    // Verify signature (custom implementation)
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(timestamp + body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid YouTube webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Check timestamp to prevent replay attacks
    const now = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp);
    
    if (Math.abs(now - requestTime) > 300) { // 5 minutes tolerance
      console.error('YouTube webhook timestamp too old');
      return NextResponse.json(
        { error: 'Request timestamp too old' },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);
    const supabase = createClient();

    // Handle different YouTube event types
    switch (data.type) {
      case 'channel_updated': {
        // Update channel data when YouTube channel is updated
        const { channelId, data: channelData } = data;
        
        const { error } = await supabase
          .from('youtube_channels')
          .update({
            title: channelData.title,
            description: channelData.description,
            thumbnail_url: channelData.thumbnailUrl,
            subscriber_count: channelData.subscriberCount,
            view_count: channelData.viewCount,
            video_count: channelData.videoCount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', channelId);

        if (error) {
          console.error('Error updating channel data:', error);
        }
        break;
      }

      case 'video_published': {
        // Handle new video published
        const { channelId, video } = data;
        
        // Save new video data
        const { error } = await supabase
          .from('youtube_videos')
          .insert({
            id: video.id,
            channel_id: channelId,
            title: video.title,
            description: video.description,
            thumbnail_url: video.thumbnailUrl,
            published_at: video.publishedAt,
            duration: video.duration,
            tags: video.tags || [],
            category_id: video.categoryId,
          });

        if (error) {
          console.error('Error saving new video:', error);
        }

        // Trigger analysis for new video performance prediction
        // This could trigger background jobs or send notifications
        break;
      }

      case 'analytics_updated': {
        // Handle analytics data updates
        const { channelId, analytics } = data;
        
        // Save analytics data
        const { error } = await supabase
          .from('youtube_analytics')
          .upsert({
            channel_id: channelId,
            date: analytics.date,
            views: analytics.views,
            watch_time: analytics.watchTime,
            subscribers_gained: analytics.subscribersGained,
            subscribers_lost: analytics.subscribersLost,
            revenue: analytics.revenue,
            cpm: analytics.cpm,
            ctr: analytics.ctr,
          }, {
            onConflict: 'channel_id,date'
          });

        if (error) {
          console.error('Error saving analytics data:', error);
        }
        break;
      }

      case 'trending_topics_updated': {
        // Handle trending topics updates
        const { trends } = data;
        
        // Update trending topics
        for (const trend of trends) {
          const { error } = await supabase
            .from('trending_topics')
            .upsert({
              keyword: trend.keyword,
              search_volume: trend.searchVolume,
              competition_level: trend.competitionLevel,
              trend_direction: trend.trendDirection,
              related_keywords: trend.relatedKeywords || [],
              youtube_videos_count: trend.youtubeVideosCount,
              avg_views: trend.avgViews,
              category: trend.category,
              region: trend.region,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'keyword'
            });

          if (error) {
            console.error('Error updating trending topic:', error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled YouTube webhook event: ${data.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('YouTube webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle webhook verification for some services
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('hub.challenge');
  const verifyToken = searchParams.get('hub.verify_token');
  
  // Verify the token matches your expected value
  if (verifyToken === webhookSecret) {
    return new NextResponse(challenge);
  }
  
  return NextResponse.json({ error: 'Invalid verify token' }, { status: 403 });
}