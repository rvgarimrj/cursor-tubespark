-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
CREATE TYPE content_style AS ENUM ('educational', 'entertainment', 'review', 'vlog', 'tutorial', 'news');
CREATE TYPE duration_preference AS ENUM ('shorts', 'medium', 'long');
CREATE TYPE competition_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE trend_direction AS ENUM ('rising', 'stable', 'declining');
CREATE TYPE video_idea_status AS ENUM ('draft', 'planned', 'in_progress', 'published', 'archived');
CREATE TYPE calendar_status AS ENUM ('scheduled', 'posted', 'cancelled');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    youtube_channel_id TEXT,
    youtube_access_token TEXT,
    youtube_refresh_token TEXT,
    subscription_plan subscription_plan DEFAULT 'free',
    subscription_status subscription_status DEFAULT 'active',
    usage_count INTEGER DEFAULT 0,
    usage_limit INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- YouTube channels table
CREATE TABLE public.youtube_channels (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    subscriber_count BIGINT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    video_count INTEGER DEFAULT 0,
    category TEXT,
    country TEXT,
    language TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- YouTube videos table (for analysis)
CREATE TABLE public.youtube_videos (
    id TEXT PRIMARY KEY,
    channel_id TEXT REFERENCES public.youtube_channels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    view_count BIGINT DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    duration TEXT,
    tags TEXT[],
    category_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- YouTube analytics table
CREATE TABLE public.youtube_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id TEXT REFERENCES public.youtube_channels(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views BIGINT DEFAULT 0,
    watch_time BIGINT DEFAULT 0,
    subscribers_gained INTEGER DEFAULT 0,
    subscribers_lost INTEGER DEFAULT 0,
    revenue DECIMAL(10,2),
    cpm DECIMAL(10,2),
    ctr DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(channel_id, date)
);

-- Video ideas table
CREATE TABLE public.video_ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tags TEXT[],
    estimated_views INTEGER DEFAULT 0,
    difficulty_score INTEGER DEFAULT 0 CHECK (difficulty_score >= 0 AND difficulty_score <= 100),
    trend_score INTEGER DEFAULT 0 CHECK (trend_score >= 0 AND trend_score <= 100),
    seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
    thumbnail_ideas TEXT[],
    script_outline TEXT,
    target_audience TEXT,
    estimated_duration TEXT,
    best_posting_time TIMESTAMP WITH TIME ZONE,
    status video_idea_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trending topics table
CREATE TABLE public.trending_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword TEXT NOT NULL,
    search_volume BIGINT DEFAULT 0,
    competition_level competition_level DEFAULT 'medium',
    trend_direction trend_direction DEFAULT 'stable',
    related_keywords TEXT[],
    youtube_videos_count INTEGER DEFAULT 0,
    avg_views BIGINT DEFAULT 0,
    peak_date DATE,
    category TEXT,
    region TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor analysis table
CREATE TABLE public.competitor_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    channel_id TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    avg_views BIGINT DEFAULT 0,
    upload_frequency INTEGER DEFAULT 0,
    content_gaps TEXT[],
    successful_formats TEXT[],
    trending_topics TEXT[],
    analysis_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content calendar table
CREATE TABLE public.content_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    video_idea_id UUID REFERENCES public.video_ideas(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    posting_time TIME NOT NULL,
    status calendar_status DEFAULT 'scheduled',
    notes TEXT,
    actual_post_date TIMESTAMP WITH TIME ZONE,
    performance_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics table
CREATE TABLE public.user_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    ideas_generated INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    successful_generations INTEGER DEFAULT 0,
    average_response_time DECIMAL(10,2),
    most_used_categories TEXT[],
    peak_usage_hours INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- System metrics table
CREATE TABLE public.system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    total_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    ideas_generated INTEGER DEFAULT 0,
    api_success_rate DECIMAL(5,2),
    average_response_time DECIMAL(10,2),
    error_count INTEGER DEFAULT 0,
    revenue DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_youtube_channel_id ON public.users(youtube_channel_id);
CREATE INDEX idx_youtube_channels_user_id ON public.youtube_channels(user_id);
CREATE INDEX idx_youtube_videos_channel_id ON public.youtube_videos(channel_id);
CREATE INDEX idx_youtube_videos_published_at ON public.youtube_videos(published_at);
CREATE INDEX idx_youtube_analytics_channel_id_date ON public.youtube_analytics(channel_id, date);
CREATE INDEX idx_video_ideas_user_id ON public.video_ideas(user_id);
CREATE INDEX idx_video_ideas_status ON public.video_ideas(status);
CREATE INDEX idx_video_ideas_created_at ON public.video_ideas(created_at);
CREATE INDEX idx_trending_topics_keyword ON public.trending_topics(keyword);
CREATE INDEX idx_trending_topics_category ON public.trending_topics(category);
CREATE INDEX idx_competitor_analysis_user_id ON public.competitor_analysis(user_id);
CREATE INDEX idx_content_calendar_user_id ON public.content_calendar(user_id);
CREATE INDEX idx_content_calendar_scheduled_date ON public.content_calendar(scheduled_date);
CREATE INDEX idx_user_analytics_user_id_date ON public.user_analytics(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- YouTube channels policies
CREATE POLICY "Users can view own channels" ON public.youtube_channels
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own channels" ON public.youtube_channels
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own channels" ON public.youtube_channels
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own channels" ON public.youtube_channels
    FOR DELETE USING (auth.uid() = user_id);

-- YouTube videos policies
CREATE POLICY "Users can view videos from own channels" ON public.youtube_videos
    FOR SELECT USING (
        channel_id IN (
            SELECT id FROM public.youtube_channels WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert videos to own channels" ON public.youtube_videos
    FOR INSERT WITH CHECK (
        channel_id IN (
            SELECT id FROM public.youtube_channels WHERE user_id = auth.uid()
        )
    );

-- YouTube analytics policies
CREATE POLICY "Users can view analytics from own channels" ON public.youtube_analytics
    FOR SELECT USING (
        channel_id IN (
            SELECT id FROM public.youtube_channels WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert analytics for own channels" ON public.youtube_analytics
    FOR INSERT WITH CHECK (
        channel_id IN (
            SELECT id FROM public.youtube_channels WHERE user_id = auth.uid()
        )
    );

-- Video ideas policies
CREATE POLICY "Users can view own video ideas" ON public.video_ideas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video ideas" ON public.video_ideas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video ideas" ON public.video_ideas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own video ideas" ON public.video_ideas
    FOR DELETE USING (auth.uid() = user_id);

-- Trending topics are public read-only
CREATE POLICY "Anyone can view trending topics" ON public.trending_topics
    FOR SELECT USING (true);

-- Only service role can modify trending topics
CREATE POLICY "Service role can modify trending topics" ON public.trending_topics
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Competitor analysis policies
CREATE POLICY "Users can view own competitor analysis" ON public.competitor_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own competitor analysis" ON public.competitor_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competitor analysis" ON public.competitor_analysis
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own competitor analysis" ON public.competitor_analysis
    FOR DELETE USING (auth.uid() = user_id);

-- Content calendar policies
CREATE POLICY "Users can view own content calendar" ON public.content_calendar
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content calendar" ON public.content_calendar
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content calendar" ON public.content_calendar
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own content calendar" ON public.content_calendar
    FOR DELETE USING (auth.uid() = user_id);

-- User analytics policies
CREATE POLICY "Users can view own analytics" ON public.user_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can modify user analytics" ON public.user_analytics
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- System metrics - only service role access
CREATE POLICY "Service role can access system metrics" ON public.system_metrics
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Functions
-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_youtube_channels_updated_at BEFORE UPDATE ON public.youtube_channels
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_ideas_updated_at BEFORE UPDATE ON public.video_ideas
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trending_topics_updated_at BEFORE UPDATE ON public.trending_topics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_calendar_updated_at BEFORE UPDATE ON public.content_calendar
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment user usage count
CREATE OR REPLACE FUNCTION public.increment_usage_count(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users 
    SET usage_count = usage_count + 1
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly usage counts (run via cron)
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS VOID AS $$
BEGIN
    UPDATE public.users 
    SET usage_count = 0
    WHERE subscription_plan = 'free' OR subscription_plan = 'pro';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;