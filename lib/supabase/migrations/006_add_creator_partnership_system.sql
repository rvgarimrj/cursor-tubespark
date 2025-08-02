-- ================================
-- Creator Partnership System Migration
-- Implements complete affiliate/creator partnership system
-- Goal: $0 → $50k MRR in 6 months via creator partnerships
-- ================================

-- Create custom types for creator system
CREATE TYPE affiliate_tier AS ENUM ('bronze', 'silver', 'gold');
CREATE TYPE affiliate_status AS ENUM ('pending', 'approved', 'rejected', 'suspended', 'inactive');
CREATE TYPE commission_status AS ENUM ('pending', 'paid', 'failed', 'disputed');
CREATE TYPE activity_type AS ENUM ('signup', 'conversion', 'content_creation', 'social_share', 'channel_analysis', 'application');

-- ================================
-- TABLE 1: AFFILIATES (CREATORS)
-- ================================
CREATE TABLE public.affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- YouTube Channel Information
    youtube_channel_id VARCHAR(100) UNIQUE NOT NULL,
    youtube_channel_handle VARCHAR(100),
    channel_name VARCHAR(200) NOT NULL,
    channel_url VARCHAR(500) NOT NULL,
    
    -- Channel Analytics (Auto-populated via YouTube API)
    subscriber_count INTEGER DEFAULT 0,
    average_views INTEGER DEFAULT 0,
    total_videos INTEGER DEFAULT 0,
    channel_country VARCHAR(2), -- ISO country code
    channel_language VARCHAR(10), -- language code
    main_categories JSONB, -- Primary content categories
    
    -- Tier and Status Management
    tier affiliate_tier DEFAULT 'bronze',
    status affiliate_status DEFAULT 'pending',
    commission_rate DECIMAL(5,2) DEFAULT 0.20, -- 20% default for bronze
    commission_duration_months INTEGER DEFAULT 12, -- Duration of commission payments
    
    -- Performance Metrics
    total_referrals INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_commissions_earned DECIMAL(12,2) DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0, -- Calculated field
    
    -- Application Details
    application_notes TEXT,
    admin_notes TEXT,
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Contact and Payment Info
    contact_email VARCHAR(255) NOT NULL,
    payment_method JSONB, -- Stripe Connect details
    tax_information JSONB, -- Tax forms and details
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- TABLE 2: DISCOUNT COUPONS
-- ================================
CREATE TABLE public.discount_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    
    -- Coupon Details
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    description TEXT,
    
    -- Usage Limits and Tracking
    max_uses INTEGER, -- NULL = unlimited
    current_uses INTEGER DEFAULT 0,
    max_uses_per_user INTEGER DEFAULT 1,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Validity Period
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Applicable Plans (if NULL, applies to all)
    applicable_plans JSONB, -- ["starter", "pro", "business"] or null for all
    
    -- Status and Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- TABLE 3: COUPON USES
-- ================================
CREATE TABLE public.coupon_uses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID REFERENCES public.discount_coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    
    -- Transaction Details
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    original_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    final_amount DECIMAL(10,2) NOT NULL,
    
    -- Stripe Information
    stripe_customer_id VARCHAR(100),
    stripe_subscription_id VARCHAR(100),
    
    -- Usage Metadata
    user_ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    
    -- Timestamps
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- TABLE 4: AFFILIATE COMMISSIONS
-- ================================
CREATE TABLE public.affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    coupon_use_id UUID REFERENCES public.coupon_uses(id) ON DELETE SET NULL,
    
    -- Commission Details
    commission_rate DECIMAL(5,2) NOT NULL, -- Rate at time of earning
    base_amount DECIMAL(10,2) NOT NULL, -- Amount commission is calculated on
    commission_amount DECIMAL(10,2) NOT NULL, -- Actual commission earned
    
    -- Payment Information
    status commission_status DEFAULT 'pending',
    paid_amount DECIMAL(10,2) DEFAULT 0,
    payment_date TIMESTAMP WITH TIME ZONE,
    stripe_transfer_id VARCHAR(100), -- For Stripe Connect transfers
    
    -- Billing Period
    billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- TABLE 5: AFFILIATE ACTIVITIES
-- ================================
CREATE TABLE public.affiliate_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- The referred user
    
    -- Activity Details
    activity_type activity_type NOT NULL,
    description TEXT,
    metadata JSONB, -- Additional data specific to activity type
    
    -- Performance Tracking
    conversion_value DECIMAL(10,2) DEFAULT 0, -- Value if this led to conversion
    commission_earned DECIMAL(10,2) DEFAULT 0, -- Commission earned from this activity
    
    -- Attribution
    referrer_url TEXT,
    landing_page TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- MODIFY EXISTING TABLES
-- ================================

-- Add referral tracking to subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS referred_by_affiliate_id UUID REFERENCES public.affiliates(id);
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS discount_applied DECIMAL(10,2) DEFAULT 0;

-- Add referral tracking to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referred_by_affiliate_id UUID REFERENCES public.affiliates(id);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_source JSONB; -- UTM parameters, landing page, etc.

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Affiliates indexes
CREATE INDEX idx_affiliates_youtube_channel ON public.affiliates(youtube_channel_id);
CREATE INDEX idx_affiliates_tier_status ON public.affiliates(tier, status);
CREATE INDEX idx_affiliates_status ON public.affiliates(status);
CREATE INDEX idx_affiliates_performance ON public.affiliates(total_conversions DESC, conversion_rate DESC);

-- Coupons indexes
CREATE INDEX idx_coupons_code ON public.discount_coupons(code);
CREATE INDEX idx_coupons_affiliate ON public.discount_coupons(affiliate_id);
CREATE INDEX idx_coupons_active ON public.discount_coupons(is_active) WHERE is_active = true;
CREATE INDEX idx_coupons_validity ON public.discount_coupons(valid_from, valid_until);

-- Coupon uses indexes
CREATE INDEX idx_coupon_uses_coupon ON public.coupon_uses(coupon_id);
CREATE INDEX idx_coupon_uses_user ON public.coupon_uses(user_id);
CREATE INDEX idx_coupon_uses_affiliate ON public.coupon_uses(affiliate_id);
CREATE INDEX idx_coupon_uses_date ON public.coupon_uses(used_at DESC);

-- Commissions indexes
CREATE INDEX idx_commissions_affiliate ON public.affiliate_commissions(affiliate_id);
CREATE INDEX idx_commissions_status ON public.affiliate_commissions(status);
CREATE INDEX idx_commissions_period ON public.affiliate_commissions(billing_period_start, billing_period_end);
CREATE INDEX idx_commissions_payment_date ON public.affiliate_commissions(payment_date DESC);

-- Activities indexes
CREATE INDEX idx_activities_affiliate ON public.affiliate_activities(affiliate_id);
CREATE INDEX idx_activities_type ON public.affiliate_activities(activity_type);
CREATE INDEX idx_activities_date ON public.affiliate_activities(created_at DESC);

-- Modified table indexes
CREATE INDEX idx_subscriptions_affiliate ON public.subscriptions(referred_by_affiliate_id) WHERE referred_by_affiliate_id IS NOT NULL;
CREATE INDEX idx_users_affiliate ON public.users(referred_by_affiliate_id) WHERE referred_by_affiliate_id IS NOT NULL;

-- ================================
-- ROW LEVEL SECURITY POLICIES
-- ================================

-- Enable RLS on new tables
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_activities ENABLE ROW LEVEL SECURITY;

-- Affiliates policies
CREATE POLICY "Affiliates can view own data" ON public.affiliates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can apply as affiliate" ON public.affiliates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Affiliates can update own data" ON public.affiliates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage affiliates" ON public.affiliates
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Discount coupons policies
CREATE POLICY "Anyone can view active coupons for validation" ON public.discount_coupons
    FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Affiliates can view own coupons" ON public.discount_coupons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.affiliates a 
            WHERE a.id = affiliate_id AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Admin can manage coupons" ON public.discount_coupons
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Coupon uses policies
CREATE POLICY "Users can view own coupon uses" ON public.coupon_uses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Affiliates can view their coupon uses" ON public.coupon_uses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.affiliates a 
            WHERE a.id = affiliate_id AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Service can manage coupon uses" ON public.coupon_uses
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Affiliate commissions policies
CREATE POLICY "Affiliates can view own commissions" ON public.affiliate_commissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.affiliates a 
            WHERE a.id = affiliate_id AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Service can manage commissions" ON public.affiliate_commissions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Affiliate activities policies
CREATE POLICY "Affiliates can view own activities" ON public.affiliate_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.affiliates a 
            WHERE a.id = affiliate_id AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Service can manage activities" ON public.affiliate_activities
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ================================
-- TRIGGERS FOR AUTOMATION
-- ================================

-- Auto-update affiliate performance metrics
CREATE OR REPLACE FUNCTION update_affiliate_performance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update affiliate performance metrics when commission is created
    IF TG_OP = 'INSERT' THEN
        UPDATE public.affiliates 
        SET 
            total_commissions_earned = total_commissions_earned + NEW.commission_amount,
            updated_at = NOW()
        WHERE id = NEW.affiliate_id;
        
        -- Update conversion count if this is a new conversion
        IF NEW.coupon_use_id IS NOT NULL THEN
            UPDATE public.affiliates 
            SET 
                total_conversions = total_conversions + 1,
                conversion_rate = CASE 
                    WHEN total_referrals > 0 THEN (total_conversions + 1)::DECIMAL / total_referrals
                    ELSE 0
                END,
                updated_at = NOW()
            WHERE id = NEW.affiliate_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_affiliate_performance
    AFTER INSERT ON public.affiliate_commissions
    FOR EACH ROW EXECUTE FUNCTION update_affiliate_performance();

-- Auto-update coupon usage count
CREATE OR REPLACE FUNCTION update_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.discount_coupons 
        SET 
            current_uses = current_uses + 1,
            updated_at = NOW()
        WHERE id = NEW.coupon_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_coupon_usage
    AFTER INSERT ON public.coupon_uses
    FOR EACH ROW EXECUTE FUNCTION update_coupon_usage();

-- Auto-create activity when affiliate applies
CREATE OR REPLACE FUNCTION create_application_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.affiliate_activities (
            affiliate_id,
            activity_type,
            description,
            metadata
        ) VALUES (
            NEW.id,
            'application',
            'Creator applied for affiliate program',
            jsonb_build_object(
                'channel_name', NEW.channel_name,
                'subscriber_count', NEW.subscriber_count,
                'tier', NEW.tier
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_application_activity
    AFTER INSERT ON public.affiliates
    FOR EACH ROW EXECUTE FUNCTION create_application_activity();

-- ================================
-- CREATOR PARTNERSHIP FUNCTIONS
-- ================================

-- Function to validate coupon and return discount info
CREATE OR REPLACE FUNCTION validate_coupon(
    coupon_code_param TEXT,
    user_id_param UUID,
    plan_type_param TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    coupon_record RECORD;
    user_uses_count INTEGER;
    result JSONB;
BEGIN
    -- Get coupon details
    SELECT dc.*, a.status as affiliate_status
    INTO coupon_record
    FROM public.discount_coupons dc
    JOIN public.affiliates a ON dc.affiliate_id = a.id
    WHERE UPPER(dc.code) = UPPER(coupon_code_param)
    AND dc.is_active = true
    AND (dc.valid_until IS NULL OR dc.valid_until > NOW())
    AND dc.valid_from <= NOW();
    
    -- Check if coupon exists
    IF coupon_record IS NULL THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Coupon not found or expired'
        );
    END IF;
    
    -- Check if affiliate is approved
    IF coupon_record.affiliate_status != 'approved' THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Coupon unavailable'
        );
    END IF;
    
    -- Check usage limits
    IF coupon_record.max_uses IS NOT NULL AND coupon_record.current_uses >= coupon_record.max_uses THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Coupon usage limit reached'
        );
    END IF;
    
    -- Check per-user limits
    SELECT COUNT(*) INTO user_uses_count
    FROM public.coupon_uses cu
    WHERE cu.coupon_id = coupon_record.id AND cu.user_id = user_id_param;
    
    IF coupon_record.max_uses_per_user IS NOT NULL AND user_uses_count >= coupon_record.max_uses_per_user THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'You have already used this coupon the maximum number of times'
        );
    END IF;
    
    -- Check if coupon applies to the plan
    IF coupon_record.applicable_plans IS NOT NULL AND plan_type_param IS NOT NULL THEN
        IF NOT (coupon_record.applicable_plans ? plan_type_param) THEN
            RETURN jsonb_build_object(
                'valid', false,
                'error', 'Coupon not applicable to this plan'
            );
        END IF;
    END IF;
    
    -- Return valid coupon info
    RETURN jsonb_build_object(
        'valid', true,
        'coupon_id', coupon_record.id,
        'affiliate_id', coupon_record.affiliate_id,
        'discount_type', coupon_record.discount_type,
        'discount_value', coupon_record.discount_value,
        'min_purchase_amount', coupon_record.min_purchase_amount,
        'description', coupon_record.description
    );
END;
$$;

-- Function to apply coupon and create usage record
CREATE OR REPLACE FUNCTION apply_coupon(
    coupon_code_param TEXT,
    user_id_param UUID,
    subscription_id_param UUID,
    original_amount_param DECIMAL,
    user_ip_param INET DEFAULT NULL,
    user_agent_param TEXT DEFAULT NULL,
    referrer_url_param TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    coupon_validation JSONB;
    discount_amount DECIMAL;
    final_amount DECIMAL;
    coupon_use_id UUID;
    subscription_record RECORD;
BEGIN
    -- Validate coupon first
    SELECT s.plan_type INTO subscription_record
    FROM public.subscriptions s WHERE s.id = subscription_id_param;
    
    coupon_validation := validate_coupon(coupon_code_param, user_id_param, subscription_record.plan_type);
    
    IF NOT (coupon_validation->>'valid')::BOOLEAN THEN
        RETURN coupon_validation;
    END IF;
    
    -- Check minimum purchase amount
    IF original_amount_param < (coupon_validation->>'min_purchase_amount')::DECIMAL THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Minimum purchase amount not met'
        );
    END IF;
    
    -- Calculate discount
    IF coupon_validation->>'discount_type' = 'percentage' THEN
        discount_amount := original_amount_param * (coupon_validation->>'discount_value')::DECIMAL / 100;
    ELSE
        discount_amount := (coupon_validation->>'discount_value')::DECIMAL;
    END IF;
    
    -- Don't allow discount to be more than original amount
    discount_amount := LEAST(discount_amount, original_amount_param);
    final_amount := original_amount_param - discount_amount;
    
    -- Create coupon use record
    INSERT INTO public.coupon_uses (
        coupon_id,
        user_id,
        affiliate_id,
        subscription_id,
        original_amount,
        discount_amount,
        final_amount,
        user_ip_address,
        user_agent,
        referrer_url
    ) VALUES (
        (coupon_validation->>'coupon_id')::UUID,
        user_id_param,
        (coupon_validation->>'affiliate_id')::UUID,
        subscription_id_param,
        original_amount_param,
        discount_amount,
        final_amount,
        user_ip_param,
        user_agent_param,
        referrer_url_param
    ) RETURNING id INTO coupon_use_id;
    
    -- Update subscription with coupon info
    UPDATE public.subscriptions
    SET 
        referred_by_affiliate_id = (coupon_validation->>'affiliate_id')::UUID,
        coupon_code = coupon_code_param,
        discount_applied = discount_amount,
        updated_at = NOW()
    WHERE id = subscription_id_param;
    
    RETURN jsonb_build_object(
        'valid', true,
        'coupon_use_id', coupon_use_id,
        'original_amount', original_amount_param,
        'discount_amount', discount_amount,
        'final_amount', final_amount,
        'savings_percentage', ROUND((discount_amount / original_amount_param) * 100, 2)
    );
END;
$$;

-- Function to calculate and create commission
CREATE OR REPLACE FUNCTION create_affiliate_commission(
    affiliate_id_param UUID,
    subscription_id_param UUID,
    coupon_use_id_param UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    affiliate_record RECORD;
    subscription_record RECORD;
    commission_amount DECIMAL;
    commission_id UUID;
BEGIN
    -- Get affiliate details
    SELECT * INTO affiliate_record 
    FROM public.affiliates 
    WHERE id = affiliate_id_param AND status = 'approved';
    
    IF affiliate_record IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Affiliate not found or not approved');
    END IF;
    
    -- Get subscription details
    SELECT s.*, pl.price_monthly
    INTO subscription_record
    FROM public.subscriptions s
    JOIN public.plan_limits pl ON s.plan_type = pl.plan_type
    WHERE s.id = subscription_id_param;
    
    IF subscription_record IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Subscription not found');
    END IF;
    
    -- Calculate commission
    commission_amount := subscription_record.price_monthly * affiliate_record.commission_rate;
    
    -- Create commission record
    INSERT INTO public.affiliate_commissions (
        affiliate_id,
        subscription_id,
        coupon_use_id,
        commission_rate,
        base_amount,
        commission_amount,
        billing_period_start,
        billing_period_end
    ) VALUES (
        affiliate_id_param,
        subscription_id_param,
        coupon_use_id_param,
        affiliate_record.commission_rate,
        subscription_record.price_monthly,
        commission_amount,
        subscription_record.current_period_start,
        subscription_record.current_period_end
    ) RETURNING id INTO commission_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'commission_id', commission_id,
        'commission_amount', commission_amount,
        'commission_rate', affiliate_record.commission_rate
    );
END;
$$;

-- Function to get affiliate dashboard stats
CREATE OR REPLACE FUNCTION get_affiliate_dashboard_stats(affiliate_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stats JSONB;
    total_earnings DECIMAL;
    pending_earnings DECIMAL;
    this_month_earnings DECIMAL;
    total_referrals INTEGER;
    active_referrals INTEGER;
    conversion_rate DECIMAL;
BEGIN
    -- Get total and pending earnings
    SELECT 
        COALESCE(SUM(commission_amount), 0) as total,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END), 0) as pending
    INTO total_earnings, pending_earnings
    FROM public.affiliate_commissions
    WHERE affiliate_id = affiliate_id_param;
    
    -- Get this month's earnings
    SELECT COALESCE(SUM(commission_amount), 0)
    INTO this_month_earnings
    FROM public.affiliate_commissions
    WHERE affiliate_id = affiliate_id_param
    AND created_at >= date_trunc('month', NOW());
    
    -- Get referral stats
    SELECT 
        COUNT(DISTINCT user_id) as total,
        COUNT(DISTINCT CASE WHEN s.status = 'active' THEN cu.user_id END) as active
    INTO total_referrals, active_referrals
    FROM public.coupon_uses cu
    LEFT JOIN public.subscriptions s ON cu.user_id = s.user_id
    WHERE cu.affiliate_id = affiliate_id_param;
    
    -- Calculate conversion rate
    conversion_rate := CASE 
        WHEN total_referrals > 0 THEN (active_referrals::DECIMAL / total_referrals) * 100
        ELSE 0
    END;
    
    stats := jsonb_build_object(
        'total_earnings', total_earnings,
        'pending_earnings', pending_earnings,
        'this_month_earnings', this_month_earnings,
        'total_referrals', total_referrals,
        'active_referrals', active_referrals,
        'conversion_rate', ROUND(conversion_rate, 2),
        'generated_at', NOW()
    );
    
    RETURN stats;
END;
$$;

-- Add updated_at triggers for new tables
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON public.affiliates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discount_coupons_updated_at BEFORE UPDATE ON public.discount_coupons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_commissions_updated_at BEFORE UPDATE ON public.affiliate_commissions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT EXECUTE ON FUNCTION validate_coupon TO authenticated;
GRANT EXECUTE ON FUNCTION apply_coupon TO authenticated;
GRANT EXECUTE ON FUNCTION create_affiliate_commission TO authenticated;
GRANT EXECUTE ON FUNCTION get_affiliate_dashboard_stats TO authenticated;

-- Add table comments for documentation
COMMENT ON TABLE public.affiliates IS 'Creator/affiliate partners with tier-based commission system';
COMMENT ON TABLE public.discount_coupons IS 'Discount coupons managed by affiliates with usage tracking';
COMMENT ON TABLE public.coupon_uses IS 'Tracks coupon usage and prevents abuse';
COMMENT ON TABLE public.affiliate_commissions IS 'Manages recurring commissions for affiliates';
COMMENT ON TABLE public.affiliate_activities IS 'Tracks all affiliate activities and attribution';

COMMENT ON FUNCTION validate_coupon IS 'Validates coupon code and returns discount information';
COMMENT ON FUNCTION apply_coupon IS 'Applies coupon discount and creates usage record';
COMMENT ON FUNCTION create_affiliate_commission IS 'Creates commission record for affiliate';
COMMENT ON FUNCTION get_affiliate_dashboard_stats IS 'Returns comprehensive affiliate dashboard statistics';