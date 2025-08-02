-- ================================
-- Migração 007: Corrigir função get_affiliate_dashboard_stats
-- Resolve ambiguidade de colunas
-- ================================

-- Drop da função existente
DROP FUNCTION IF EXISTS get_affiliate_dashboard_stats(UUID);

-- Recriar função corrigida
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
    
    -- Get referral stats (CORRIGIDO: especificando cu.user_id)
    SELECT 
        COUNT(DISTINCT cu.user_id) as total,
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

-- Recriar permissão
GRANT EXECUTE ON FUNCTION get_affiliate_dashboard_stats TO authenticated;

-- Adicionar comentário
COMMENT ON FUNCTION get_affiliate_dashboard_stats IS 'Returns comprehensive affiliate dashboard statistics (v2 - fixed ambiguous columns)';