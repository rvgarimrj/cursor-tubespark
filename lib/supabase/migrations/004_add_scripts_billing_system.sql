-- Migration 004: Add Scripts and Billing System
-- This migration adds support for video scripts, engagement tracking, billing, and usage limits

-- Create custom types for billing system
CREATE TYPE script_type AS ENUM ('basic', 'premium');
CREATE TYPE engagement_type AS ENUM ('favorite', 'share', 'copy', 'time_spent', 'expand', 'click_script');

-- Video scripts table
CREATE TABLE public.video_scripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID REFERENCES public.video_ideas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    script_type script_type NOT NULL,
    content JSONB NOT NULL,
    generation_cost DECIMAL(10,4) DEFAULT 0,
    was_used BOOLEAN DEFAULT false,
    published_video_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Engagement tracking table
CREATE TABLE public.engagement_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    idea_id UUID REFERENCES public.video_ideas(id) ON DELETE CASCADE,
    engagement_type engagement_type NOT NULL,
    engagement_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    stripe_customer_id VARCHAR(100) UNIQUE,
    stripe_subscription_id VARCHAR(100) UNIQUE,
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('free', 'starter', 'pro', 'business')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'paused', 'trialing')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE public.usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Format: '2025-08'
    ideas_generated INTEGER DEFAULT 0,
    scripts_basic INTEGER DEFAULT 0,
    scripts_premium INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month_year)
);

-- Plan limits table
CREATE TABLE public.plan_limits (
    plan_type VARCHAR(20) PRIMARY KEY,
    ideas_per_month INTEGER, -- -1 = unlimited
    scripts_basic_per_month INTEGER,
    scripts_premium_per_month INTEGER,
    api_calls_per_month INTEGER,
    features JSONB,
    price_monthly DECIMAL(10,2),
    stripe_price_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert plan limits data
INSERT INTO public.plan_limits (plan_type, ideas_per_month, scripts_basic_per_month, scripts_premium_per_month, api_calls_per_month, features, price_monthly, stripe_price_id) VALUES
('free', 10, 2, 0, 100, '{"youtube_integration": true, "competitor_analysis": false, "trend_analysis": false, "api_access": false}', 0.00, NULL),
('starter', 100, 20, 5, 1000, '{"youtube_integration": true, "competitor_analysis": false, "trend_analysis": true, "api_access": false}', 9.99, 'price_starter_to_be_set'),
('pro', -1, -1, 50, 5000, '{"youtube_integration": true, "competitor_analysis": true, "trend_analysis": true, "api_access": false}', 29.99, 'price_pro_to_be_set'),
('business', -1, -1, -1, 25000, '{"youtube_integration": true, "competitor_analysis": true, "trend_analysis": true, "api_access": true}', 99.99, 'price_business_to_be_set');

-- Modify video_ideas table to add status and published info
ALTER TABLE public.video_ideas ADD COLUMN IF NOT EXISTS status video_idea_status DEFAULT 'draft';
ALTER TABLE public.video_ideas ADD COLUMN IF NOT EXISTS published_video_url VARCHAR(500);
ALTER TABLE public.video_ideas ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.video_ideas ADD COLUMN IF NOT EXISTS estimated_views_number INTEGER DEFAULT 0;
ALTER TABLE public.video_ideas ADD COLUMN IF NOT EXISTS estimated_likes INTEGER DEFAULT 0;
ALTER TABLE public.video_ideas ADD COLUMN IF NOT EXISTS estimated_comments INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX idx_video_scripts_user_id ON public.video_scripts(user_id);
CREATE INDEX idx_video_scripts_idea_id ON public.video_scripts(idea_id);
CREATE INDEX idx_video_scripts_type ON public.video_scripts(script_type);
CREATE INDEX idx_video_scripts_created ON public.video_scripts(created_at DESC);

CREATE INDEX idx_engagement_user_idea ON public.engagement_tracking(user_id, idea_id);
CREATE INDEX idx_engagement_type ON public.engagement_tracking(engagement_type);
CREATE INDEX idx_engagement_created ON public.engagement_tracking(created_at DESC);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);

CREATE INDEX idx_usage_user_month ON public.usage_tracking(user_id, month_year);
CREATE INDEX idx_usage_month ON public.usage_tracking(month_year);

CREATE INDEX idx_video_ideas_status ON public.video_ideas(status);
CREATE INDEX idx_video_ideas_published ON public.video_ideas(published_at DESC) WHERE status = 'published';

-- Enable Row Level Security for new tables
ALTER TABLE public.video_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_scripts
CREATE POLICY "Users can view own video scripts" ON public.video_scripts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video scripts" ON public.video_scripts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video scripts" ON public.video_scripts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own video scripts" ON public.video_scripts
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for engagement_tracking
CREATE POLICY "Users can view own engagement tracking" ON public.engagement_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own engagement tracking" ON public.engagement_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for usage_tracking
CREATE POLICY "Users can view own usage tracking" ON public.usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage tracking" ON public.usage_tracking
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Plan limits are public read-only
CREATE POLICY "Anyone can view plan limits" ON public.plan_limits
    FOR SELECT USING (true);

CREATE POLICY "Service role can modify plan limits" ON public.plan_limits
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Add updated_at triggers for new tables
CREATE TRIGGER update_video_scripts_updated_at BEFORE UPDATE ON public.video_scripts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at BEFORE UPDATE ON public.usage_tracking
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_limits_updated_at BEFORE UPDATE ON public.plan_limits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check user limits
CREATE OR REPLACE FUNCTION public.check_user_limits(
    p_user_id UUID,
    p_action TEXT -- 'idea', 'script_basic', 'script_premium', 'api_call'
)
RETURNS TABLE (
    allowed BOOLEAN,
    remaining INTEGER,
    limit_value INTEGER,
    used INTEGER,
    plan_type TEXT
) AS $$
DECLARE
    current_month TEXT := to_char(NOW(), 'YYYY-MM');
    user_plan TEXT := 'free';
    user_usage RECORD;
    plan_limits RECORD;
BEGIN
    -- Get user's plan
    SELECT COALESCE(s.plan_type, 'free') INTO user_plan
    FROM public.subscriptions s
    WHERE s.user_id = p_user_id AND s.status = 'active';
    
    -- Get plan limits
    SELECT * INTO plan_limits
    FROM public.plan_limits pl
    WHERE pl.plan_type = user_plan;
    
    -- Get current usage
    SELECT COALESCE(ut.ideas_generated, 0) as ideas_generated,
           COALESCE(ut.scripts_basic, 0) as scripts_basic,
           COALESCE(ut.scripts_premium, 0) as scripts_premium,
           COALESCE(ut.api_calls, 0) as api_calls
    INTO user_usage
    FROM public.usage_tracking ut
    WHERE ut.user_id = p_user_id AND ut.month_year = current_month;
    
    -- If no usage record, create default
    IF user_usage IS NULL THEN
        user_usage := ROW(0, 0, 0, 0);
    END IF;
    
    -- Check limits based on action
    CASE p_action
        WHEN 'idea' THEN
            RETURN QUERY SELECT 
                CASE WHEN plan_limits.ideas_per_month = -1 THEN true
                     ELSE user_usage.ideas_generated < plan_limits.ideas_per_month
                END,
                CASE WHEN plan_limits.ideas_per_month = -1 THEN -1
                     ELSE GREATEST(0, plan_limits.ideas_per_month - user_usage.ideas_generated)
                END,
                plan_limits.ideas_per_month,
                user_usage.ideas_generated,
                user_plan;
        WHEN 'script_basic' THEN
            RETURN QUERY SELECT 
                CASE WHEN plan_limits.scripts_basic_per_month = -1 THEN true
                     ELSE user_usage.scripts_basic < plan_limits.scripts_basic_per_month
                END,
                CASE WHEN plan_limits.scripts_basic_per_month = -1 THEN -1
                     ELSE GREATEST(0, plan_limits.scripts_basic_per_month - user_usage.scripts_basic)
                END,
                plan_limits.scripts_basic_per_month,
                user_usage.scripts_basic,
                user_plan;
        WHEN 'script_premium' THEN
            RETURN QUERY SELECT 
                CASE WHEN plan_limits.scripts_premium_per_month = -1 THEN true
                     ELSE user_usage.scripts_premium < plan_limits.scripts_premium_per_month
                END,
                CASE WHEN plan_limits.scripts_premium_per_month = -1 THEN -1
                     ELSE GREATEST(0, plan_limits.scripts_premium_per_month - user_usage.scripts_premium)
                END,
                plan_limits.scripts_premium_per_month,
                user_usage.scripts_premium,
                user_plan;
        WHEN 'api_call' THEN
            RETURN QUERY SELECT 
                CASE WHEN plan_limits.api_calls_per_month = -1 THEN true
                     ELSE user_usage.api_calls < plan_limits.api_calls_per_month
                END,
                CASE WHEN plan_limits.api_calls_per_month = -1 THEN -1
                     ELSE GREATEST(0, plan_limits.api_calls_per_month - user_usage.api_calls)
                END,
                plan_limits.api_calls_per_month,
                user_usage.api_calls,
                user_plan;
        ELSE
            RETURN QUERY SELECT false, 0, 0, 0, user_plan;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
    p_user_id UUID,
    p_action TEXT
)
RETURNS VOID AS $$
DECLARE
    current_month TEXT := to_char(NOW(), 'YYYY-MM');
BEGIN
    -- Upsert usage tracking
    INSERT INTO public.usage_tracking (user_id, month_year, ideas_generated, scripts_basic, scripts_premium, api_calls)
    VALUES (
        p_user_id, 
        current_month,
        CASE WHEN p_action = 'idea' THEN 1 ELSE 0 END,
        CASE WHEN p_action = 'script_basic' THEN 1 ELSE 0 END,
        CASE WHEN p_action = 'script_premium' THEN 1 ELSE 0 END,
        CASE WHEN p_action = 'api_call' THEN 1 ELSE 0 END
    )
    ON CONFLICT (user_id, month_year)
    DO UPDATE SET
        ideas_generated = usage_tracking.ideas_generated + CASE WHEN p_action = 'idea' THEN 1 ELSE 0 END,
        scripts_basic = usage_tracking.scripts_basic + CASE WHEN p_action = 'script_basic' THEN 1 ELSE 0 END,
        scripts_premium = usage_tracking.scripts_premium + CASE WHEN p_action = 'script_premium' THEN 1 ELSE 0 END,
        api_calls = usage_tracking.api_calls + CASE WHEN p_action = 'api_call' THEN 1 ELSE 0 END,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;