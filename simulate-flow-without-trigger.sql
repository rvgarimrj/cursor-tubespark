-- ================================
-- Simulação Completa SEM problemas de ENUM
-- Desabilita o trigger temporariamente
-- ================================

-- 1. Desabilitar trigger problemático temporariamente
ALTER TABLE public.subscriptions DISABLE TRIGGER trigger_update_user_subscription;

-- 2. Simulação completa do fluxo
DO $$
DECLARE
    v_customer_id UUID;
    v_subscription_id UUID;
    v_affiliate_id UUID;
    v_coupon_result JSONB;
    v_commission_result JSONB;
BEGIN
    -- Criar cliente
    v_customer_id := gen_random_uuid();
    INSERT INTO public.users (id, email, name) 
    VALUES (v_customer_id, 'cliente_venda@test.com', 'Cliente Comprador');
    
    RAISE NOTICE 'Cliente criado: %', v_customer_id;
    
    -- Pegar o afiliado
    SELECT id INTO v_affiliate_id 
    FROM public.affiliates 
    WHERE youtube_channel_id = 'UC_simple123';
    
    IF v_affiliate_id IS NULL THEN
        RAISE EXCEPTION 'Afiliado não encontrado! Execute simple-affiliate-test.sql primeiro';
    END IF;
    
    RAISE NOTICE 'Afiliado encontrado: %', v_affiliate_id;
    
    -- Criar subscription
    v_subscription_id := gen_random_uuid();
    INSERT INTO public.subscriptions (
        id,
        user_id,
        plan_type,
        status,
        current_period_start,
        current_period_end,
        stripe_subscription_id
    ) VALUES (
        v_subscription_id,
        v_customer_id,
        'starter',
        'active',
        NOW(),
        NOW() + INTERVAL '30 days',
        'sub_' || substr(md5(random()::text), 1, 10)
    );
    
    RAISE NOTICE 'Subscription criada: %', v_subscription_id;
    
    -- Aplicar cupom
    v_coupon_result := apply_coupon(
        'SIMPLES20',           -- código do cupom
        v_customer_id,         -- cliente
        v_subscription_id,     -- subscription
        9.99,                  -- valor original ($9.99 do plano starter)
        '192.168.1.1'::inet,
        'Mozilla/5.0',
        'https://youtube.com/simpleschannel'
    );
    
    RAISE NOTICE 'Cupom aplicado: %', v_coupon_result;
    
    -- Verificar se cupom foi aplicado com sucesso
    IF (v_coupon_result->>'valid')::boolean THEN
        -- Criar comissão
        v_commission_result := create_affiliate_commission(
            v_affiliate_id,
            v_subscription_id,
            (v_coupon_result->>'coupon_use_id')::UUID
        );
        
        RAISE NOTICE 'Comissão criada: %', v_commission_result;
        
        -- Atualizar contadores do afiliado manualmente
        UPDATE public.affiliates 
        SET 
            total_referrals = total_referrals + 1,
            updated_at = NOW()
        WHERE id = v_affiliate_id;
        
        RAISE NOTICE 'Afiliado atualizado com sucesso!';
    ELSE
        RAISE NOTICE 'Falha na aplicação do cupom: %', v_coupon_result->>'error';
    END IF;
    
END $$;

-- 3. Reabilitar o trigger
ALTER TABLE public.subscriptions ENABLE TRIGGER trigger_update_user_subscription;

-- 4. Verificar resultados
SELECT '=== CUPOM UTILIZADO ===' as info;
SELECT 
    dc.code,
    cu.original_amount,
    cu.discount_amount,
    cu.final_amount,
    ROUND((cu.discount_amount / cu.original_amount) * 100, 1) || '%' as savings,
    cu.used_at
FROM public.coupon_uses cu
JOIN public.discount_coupons dc ON cu.coupon_id = dc.id
WHERE dc.code = 'SIMPLES20'
ORDER BY cu.used_at DESC
LIMIT 1;

SELECT '=== COMISSÃO GERADA ===' as info;
SELECT 
    'Comissão Bronze (20%)' as tier,
    ac.base_amount as valor_base,
    ac.commission_amount as comissao,
    ac.status,
    ac.created_at
FROM public.affiliate_commissions ac
JOIN public.affiliates a ON ac.affiliate_id = a.id
WHERE a.youtube_channel_id = 'UC_simple123'
ORDER BY ac.created_at DESC
LIMIT 1;

SELECT '=== ESTATÍSTICAS FINAIS ===' as info;
SELECT get_affiliate_dashboard_stats(
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_simple123')
);

SELECT '=== RESUMO DO AFILIADO ===' as info;
SELECT 
    channel_name,
    tier,
    total_referrals,
    total_conversions,
    total_commissions_earned,
    CASE 
        WHEN total_referrals > 0 
        THEN ROUND((total_conversions::DECIMAL / total_referrals) * 100, 1) || '%'
        ELSE '0%'
    END as conversion_rate_calc
FROM public.affiliates 
WHERE youtube_channel_id = 'UC_simple123';