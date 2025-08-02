-- ================================
-- Migração 005: Criar Tabelas Faltantes
-- Cria as tabelas core que estão faltando no sistema
-- ================================

-- ================================
-- TABLE: PLAN LIMITS
-- Define os planos e seus limites
-- ================================
CREATE TABLE IF NOT EXISTS public.plan_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_type VARCHAR(50) UNIQUE NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Limites de uso
    ideas_per_month INTEGER NOT NULL DEFAULT 10,
    scripts_per_month INTEGER NOT NULL DEFAULT 5,
    saved_ideas_limit INTEGER NOT NULL DEFAULT 50,
    
    -- Features
    ai_models_access TEXT[] DEFAULT ARRAY['gpt-3.5-turbo'],
    youtube_integration BOOLEAN DEFAULT false,
    analytics_access BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    custom_branding BOOLEAN DEFAULT false,
    team_collaboration BOOLEAN DEFAULT false,
    api_access BOOLEAN DEFAULT false,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir planos padrão
INSERT INTO public.plan_limits (plan_type, plan_name, price_monthly, price_yearly, ideas_per_month, scripts_per_month, saved_ideas_limit, ai_models_access, youtube_integration, analytics_access) VALUES
('free', 'Free', 0, 0, 10, 3, 20, ARRAY['gpt-3.5-turbo'], false, false),
('starter', 'Starter', 9.99, 99.99, 50, 20, 100, ARRAY['gpt-3.5-turbo', 'gpt-4'], true, true),
('pro', 'Pro', 29.99, 299.99, 200, 100, 500, ARRAY['gpt-3.5-turbo', 'gpt-4', 'claude-3'], true, true),
('business', 'Business', 99.99, 999.99, -1, -1, -1, ARRAY['all'], true, true)
ON CONFLICT (plan_type) DO NOTHING;

-- ================================
-- TABLE: SUBSCRIPTIONS
-- Gerencia as assinaturas dos usuários
-- ================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) REFERENCES public.plan_limits(plan_type),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    
    -- Stripe Information
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_payment_method_id VARCHAR(255),
    
    -- Billing Period
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    
    -- Trial Information
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one active subscription per user
    CONSTRAINT unique_active_subscription UNIQUE (user_id, status)
);

-- ================================
-- TABLE: USAGE TRACKING
-- Rastreia o uso de recursos pelos usuários
-- ================================
CREATE TABLE IF NOT EXISTS public.usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- 'idea_generation', 'script_generation', etc.
    
    -- Usage counts
    count INTEGER NOT NULL DEFAULT 1,
    
    -- Billing period
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique tracking per user, resource, and period
    CONSTRAINT unique_usage_period UNIQUE (user_id, resource_type, period_start, period_end)
);

-- ================================
-- TABLE: VIDEO SCRIPTS
-- Armazena scripts gerados para vídeos
-- ================================
CREATE TABLE IF NOT EXISTS public.video_scripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    idea_id UUID REFERENCES public.video_ideas(id) ON DELETE CASCADE,
    
    -- Script Content
    title VARCHAR(500) NOT NULL,
    hook TEXT NOT NULL,
    introduction TEXT,
    main_points JSONB, -- Array of main points with timing
    conclusion TEXT,
    call_to_action TEXT,
    
    -- Script Metadata
    estimated_duration INTEGER, -- in seconds
    word_count INTEGER,
    language VARCHAR(10) DEFAULT 'pt',
    tone VARCHAR(50), -- 'professional', 'casual', 'educational', etc.
    target_audience TEXT,
    
    -- SEO and Keywords
    keywords TEXT[],
    tags TEXT[],
    
    -- Generation Details
    ai_model VARCHAR(100),
    generation_prompt TEXT,
    generation_params JSONB,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'final', 'archived'
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- INDEXES
-- ================================

-- Plan limits indexes
CREATE INDEX IF NOT EXISTS idx_plan_limits_type ON public.plan_limits(plan_type);
CREATE INDEX IF NOT EXISTS idx_plan_limits_active ON public.plan_limits(is_active);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period ON public.subscriptions(current_period_end);

-- Usage tracking indexes
CREATE INDEX IF NOT EXISTS idx_usage_user_resource ON public.usage_tracking(user_id, resource_type);
CREATE INDEX IF NOT EXISTS idx_usage_period ON public.usage_tracking(period_start, period_end);

-- Video scripts indexes
CREATE INDEX IF NOT EXISTS idx_scripts_user ON public.video_scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_idea ON public.video_scripts(idea_id);
CREATE INDEX IF NOT EXISTS idx_scripts_status ON public.video_scripts(status);

-- ================================
-- ROW LEVEL SECURITY
-- ================================

-- Enable RLS
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_scripts ENABLE ROW LEVEL SECURITY;

-- Plan limits policies (public read)
CREATE POLICY "Anyone can view plan limits" ON public.plan_limits
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage plan limits" ON public.plan_limits
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON public.usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage" ON public.usage_tracking
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Video scripts policies
CREATE POLICY "Users can view own scripts" ON public.video_scripts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scripts" ON public.video_scripts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scripts" ON public.video_scripts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts" ON public.video_scripts
    FOR DELETE USING (auth.uid() = user_id);

-- ================================
-- TRIGGERS
-- ================================

-- Update subscription in users table when subscription changes
CREATE OR REPLACE FUNCTION update_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'active') THEN
        UPDATE public.users 
        SET 
            subscription_plan = NEW.plan_type,
            subscription_status = NEW.status,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_subscription
    AFTER INSERT OR UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_user_subscription();

-- Track usage when ideas are generated
CREATE OR REPLACE FUNCTION track_idea_generation()
RETURNS TRIGGER AS $$
DECLARE
    current_period_start DATE;
    current_period_end DATE;
BEGIN
    -- Get current billing period (month)
    current_period_start := date_trunc('month', NOW());
    current_period_end := date_trunc('month', NOW() + interval '1 month');
    
    -- Insert or update usage tracking
    INSERT INTO public.usage_tracking (
        user_id,
        resource_type,
        count,
        period_start,
        period_end,
        metadata
    ) VALUES (
        NEW.user_id,
        'idea_generation',
        1,
        current_period_start,
        current_period_end,
        jsonb_build_object('idea_id', NEW.id)
    )
    ON CONFLICT (user_id, resource_type, period_start, period_end)
    DO UPDATE SET 
        count = usage_tracking.count + 1,
        metadata = usage_tracking.metadata || jsonb_build_object('last_idea_id', NEW.id);
    
    -- Update user's usage count
    UPDATE public.users 
    SET 
        usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_idea_generation
    AFTER INSERT ON public.video_ideas
    FOR EACH ROW EXECUTE FUNCTION track_idea_generation();

-- Add updated_at triggers
CREATE TRIGGER update_plan_limits_updated_at BEFORE UPDATE ON public.plan_limits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_scripts_updated_at BEFORE UPDATE ON public.video_scripts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ================================
-- COMMENTS
-- ================================

COMMENT ON TABLE public.plan_limits IS 'Define os planos de assinatura e seus limites de uso';
COMMENT ON TABLE public.subscriptions IS 'Gerencia as assinaturas dos usuários';
COMMENT ON TABLE public.usage_tracking IS 'Rastreia o uso de recursos para billing e limites';
COMMENT ON TABLE public.video_scripts IS 'Armazena scripts gerados para vídeos';