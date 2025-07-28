// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  youtube_channel_id?: string;
  youtube_access_token?: string;
  youtube_refresh_token?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  subscription_plan: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'cancelled' | 'expired';
  usage_count: number;
  usage_limit: number;
}

// YouTube Types
export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  subscriber_count: number;
  view_count: number;
  video_count: number;
  created_at: string;
  category: string;
  country?: string;
  language?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string;
  duration: string;
  tags: string[];
  category_id: string;
}

export interface YouTubeAnalytics {
  channel_id: string;
  date: string;
  views: number;
  watch_time: number;
  subscribers_gained: number;
  subscribers_lost: number;
  revenue?: number;
  cpm?: number;
  ctr: number;
}

// Video Idea Types
export interface VideoIdea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  estimated_views: number;
  difficulty_score: number;
  trend_score: number;
  seo_score: number;
  thumbnail_ideas: string[];
  script_outline?: string;
  target_audience: string;
  estimated_duration: string;
  best_posting_time?: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'planned' | 'in_progress' | 'published' | 'archived';
}

export interface IdeaGenerationRequest {
  channel_id?: string;
  niche: string;
  target_audience: string;
  content_style: 'educational' | 'entertainment' | 'review' | 'vlog' | 'tutorial' | 'news';
  duration_preference: 'shorts' | 'medium' | 'long';
  trending_topics?: boolean;
  competitor_analysis?: boolean;
  seo_focus?: boolean;
  count: number;
}

export interface IdeaGenerationResponse {
  ideas: VideoIdea[];
  trends_used: string[];
  competitors_analyzed: string[];
  generation_time: number;
  confidence_score: number;
}

// Trend Analysis Types
export interface TrendingTopic {
  id: string;
  keyword: string;
  search_volume: number;
  competition_level: 'low' | 'medium' | 'high';
  trend_direction: 'rising' | 'stable' | 'declining';
  related_keywords: string[];
  youtube_videos_count: number;
  avg_views: number;
  peak_date?: string;
  category: string;
  region?: string;
}

export interface CompetitorAnalysis {
  channel_id: string;
  channel_name: string;
  recent_videos: YouTubeVideo[];
  avg_views: number;
  upload_frequency: number;
  content_gaps: string[];
  successful_formats: string[];
  trending_topics: string[];
  analysis_date: string;
}

// Content Calendar Types
export interface ContentCalendar {
  id: string;
  user_id: string;
  video_idea_id: string;
  scheduled_date: string;
  posting_time: string;
  status: 'scheduled' | 'posted' | 'cancelled';
  notes?: string;
  actual_post_date?: string;
  performance_metrics?: {
    views: number;
    likes: number;
    comments: number;
    ctr: number;
  };
}

// AI Configuration Types
export interface AIProvider {
  name: 'openai' | 'anthropic' | 'groq';
  model: string;
  api_key?: string;
  enabled: boolean;
}

export interface AIConfig {
  providers: AIProvider[];
  default_provider: string;
  temperature: number;
  max_tokens: number;
  prompt_templates: {
    idea_generation: string;
    title_optimization: string;
    description_writing: string;
    seo_optimization: string;
  };
}

// Analytics Types
export interface UserAnalytics {
  user_id: string;
  date: string;
  ideas_generated: number;
  api_calls: number;
  successful_generations: number;
  average_response_time: number;
  most_used_categories: string[];
  peak_usage_hours: number[];
}

export interface SystemMetrics {
  date: string;
  total_users: number;
  active_users: number;
  ideas_generated: number;
  api_success_rate: number;
  average_response_time: number;
  error_count: number;
  revenue: number;
}

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      youtube_channels: {
        Row: YouTubeChannel;
        Insert: Omit<YouTubeChannel, 'created_at'>;
        Update: Partial<YouTubeChannel>;
      };
      video_ideas: {
        Row: VideoIdea;
        Insert: Omit<VideoIdea, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VideoIdea, 'id' | 'created_at'>>;
      };
      trending_topics: {
        Row: TrendingTopic;
        Insert: Omit<TrendingTopic, 'id'>;
        Update: Partial<TrendingTopic>;
      };
      content_calendar: {
        Row: ContentCalendar;
        Insert: Omit<ContentCalendar, 'id'>;
        Update: Partial<Omit<ContentCalendar, 'id'>>;
      };
      user_analytics: {
        Row: UserAnalytics;
        Insert: UserAnalytics;
        Update: Partial<UserAnalytics>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      subscription_plan: 'free' | 'pro' | 'enterprise';
      subscription_status: 'active' | 'cancelled' | 'expired';
      content_style: 'educational' | 'entertainment' | 'review' | 'vlog' | 'tutorial' | 'news';
      duration_preference: 'shorts' | 'medium' | 'long';
      competition_level: 'low' | 'medium' | 'high';
      trend_direction: 'rising' | 'stable' | 'declining';
    };
  };
}