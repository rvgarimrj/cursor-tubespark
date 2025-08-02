-- ================================
-- Simulação Completa do Fluxo de Vendas
-- Gera dados reais nas estatísticas
-- ================================

-- 1. Primeiro, vamos pegar o afiliado que criamos
SELECT 
    id as affiliate_id,
    channel_name,
    tier,
    commission_rate
FROM public.affiliates 
WHERE youtube_channel_id = 'UC_simple123';

-- 2. Criar um cliente novo
INSERT INTO public.users (
    id,
    email,
    name
) VALUES (
    gen_random_uuid(),
    'cliente' || substr(md5(random()::text), 1, 5) || '@gmail.com',
    'Cliente Novo'
) RETURNING id as customer_id;

-- 3. Simular uso completo do cupom e geração de comissão
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
    
    -- Pegar o afiliado
    SELECT id INTO v_affiliate_id 
    FROM public.affiliates 
    WHERE youtube_channel_id = 'UC_simple123';
    
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
    
    -- Criar comissão (20% de comissão sobre $9.99 = $1.998)
    v_commission_result := create_affiliate_commission(
        v_affiliate_id,
        v_subscription_id,
        (v_coupon_result->>'coupon_use_id')::UUID
    );
    
    RAISE NOTICE 'Comissão criada: %', v_commission_result;
    
    -- Atualizar contadores do afiliado
    UPDATE public.affiliates 
    SET 
        total_referrals = total_referrals + 1,
        updated_at = NOW()
    WHERE id = v_affiliate_id;
    
END $$;

-- 4. Ver uso do cupom
SELECT '=== USO DO CUPOM ===' as info;
SELECT 
    dc.code,
    cu.original_amount,
    cu.discount_amount,
    cu.final_amount,
    cu.used_at
FROM public.coupon_uses cu
JOIN public.discount_coupons dc ON cu.coupon_id = dc.id
WHERE dc.code = 'SIMPLES20'
ORDER BY cu.used_at DESC;

-- 5. Ver comissões geradas
SELECT '=== COMISSÕES GERADAS ===' as info;
SELECT 
    ac.commission_rate * 100 || '%' as rate,
    ac.base_amount,
    ac.commission_amount,
    ac.status,
    ac.created_at
FROM public.affiliate_commissions ac
JOIN public.affiliates a ON ac.affiliate_id = a.id
WHERE a.youtube_channel_id = 'UC_simple123'
ORDER BY ac.created_at DESC;

-- 6. Ver estatísticas atualizadas
SELECT '=== ESTATÍSTICAS ATUALIZADAS ===' as info;
SELECT get_affiliate_dashboard_stats(
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_simple123')
);

-- 7. Ver dados do afiliado
SELECT '=== DADOS DO AFILIADO ===' as info;
SELECT 
    channel_name,
    tier,
    total_referrals,
    total_conversions,
    total_commissions_earned,
    conversion_rate
FROM public.affiliates 
WHERE youtube_channel_id = 'UC_simple123';