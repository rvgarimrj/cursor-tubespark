-- ================================
-- Teste com Dados Reais do Sistema
-- Usa os IDs existentes no banco
-- ================================

-- 1. Primeiro, vamos ver se já existe algum usuário no sistema
SELECT id, email, name, subscription_plan 
FROM public.users 
LIMIT 5;

-- 2. Se você tem um usuário específico, pode criar um afiliado para ele
-- Substitua 'SEU_USER_ID_AQUI' pelo ID real de um usuário
/*
INSERT INTO public.affiliates (
    user_id,
    youtube_channel_id,
    channel_name,
    channel_url,
    contact_email,
    subscriber_count,
    average_views,
    status,
    tier,
    commission_rate
) VALUES (
    'SEU_USER_ID_AQUI', -- substitua pelo ID real
    'UC_' || substr(md5(random()::text), 1, 10), -- gera um channel ID único
    'Canal do Creator Teste',
    'https://youtube.com/channel/UC_exemplo',
    'creator@exemplo.com',
    75000,
    15000,
    'approved',
    'gold',
    0.30 -- 30% de comissão
);
*/

-- 3. Criar um usuário novo com dados mais realistas
DO $$
DECLARE
    new_user_id UUID;
    new_affiliate_id UUID;
BEGIN
    -- Gerar novo UUID
    new_user_id := gen_random_uuid();
    
    -- Criar usuário
    INSERT INTO public.users (
        id, 
        email, 
        name, 
        subscription_plan,
        usage_count,
        usage_limit
    ) VALUES (
        new_user_id,
        'parceiro' || substr(md5(random()::text), 1, 5) || '@gmail.com',
        'Creator Parceiro ' || substr(md5(random()::text), 1, 5),
        'free',
        0,
        10
    );
    
    -- Criar afiliado
    INSERT INTO public.affiliates (
        user_id,
        youtube_channel_id,
        channel_name,
        channel_url,
        contact_email,
        subscriber_count,
        average_views,
        status,
        tier,
        commission_rate
    ) VALUES (
        new_user_id,
        'UC_' || substr(md5(random()::text), 1, 15),
        'Tech Brasil Channel',
        'https://youtube.com/channel/UC_techbrasil',
        'parceiro' || substr(md5(random()::text), 1, 5) || '@gmail.com',
        125000,
        25000,
        'approved',
        'gold',
        0.30
    ) RETURNING id INTO new_affiliate_id;
    
    -- Criar cupons
    INSERT INTO public.discount_coupons (
        affiliate_id,
        code,
        discount_type,
        discount_value,
        description,
        max_uses,
        max_uses_per_user,
        applicable_plans
    ) VALUES 
    (
        new_affiliate_id,
        'TECH30',
        'percentage',
        30,
        '30% de desconto no primeiro mês',
        200,
        1,
        '["starter", "pro"]'::jsonb
    ),
    (
        new_affiliate_id,
        'TECHBR15',
        'percentage',
        15,
        '15% de desconto para a comunidade Tech Brasil',
        NULL, -- sem limite
        1,
        NULL -- todos os planos
    );
    
    RAISE NOTICE 'Criado usuário: %, afiliado: %', new_user_id, new_affiliate_id;
END $$;

-- 4. Verificar afiliados criados
SELECT 
    a.id,
    a.channel_name,
    a.subscriber_count,
    a.tier,
    a.commission_rate * 100 as commission_percentage,
    a.status,
    COUNT(dc.id) as total_coupons
FROM public.affiliates a
LEFT JOIN public.discount_coupons dc ON dc.affiliate_id = a.id
GROUP BY a.id, a.channel_name, a.subscriber_count, a.tier, a.commission_rate, a.status
ORDER BY a.created_at DESC;

-- 5. Verificar cupons ativos
SELECT 
    dc.code,
    dc.discount_type,
    dc.discount_value,
    dc.max_uses,
    dc.current_uses,
    a.channel_name as creator_channel
FROM public.discount_coupons dc
JOIN public.affiliates a ON dc.affiliate_id = a.id
WHERE dc.is_active = true
ORDER BY dc.created_at DESC;

-- 6. Simular uso de cupom
-- Primeiro, vamos criar um usuário cliente
DO $$
DECLARE
    customer_id UUID;
    subscription_id UUID;
    coupon_result JSONB;
BEGIN
    -- Criar cliente
    customer_id := gen_random_uuid();
    
    INSERT INTO public.users (
        id, 
        email, 
        name, 
        subscription_plan
    ) VALUES (
        customer_id,
        'cliente' || substr(md5(random()::text), 1, 5) || '@gmail.com',
        'Cliente Teste',
        'free'
    );
    
    -- Criar uma subscription
    subscription_id := gen_random_uuid();
    
    INSERT INTO public.subscriptions (
        id,
        user_id,
        plan_type,
        status,
        current_period_start,
        current_period_end
    ) VALUES (
        subscription_id,
        customer_id,
        'starter',
        'active',
        NOW(),
        NOW() + INTERVAL '30 days'
    );
    
    -- Testar aplicação de cupom
    coupon_result := apply_coupon(
        'TECH30',
        customer_id,
        subscription_id,
        9.99, -- preço original
        '192.168.1.1'::inet,
        'Mozilla/5.0',
        'https://youtube.com/techbrasil'
    );
    
    RAISE NOTICE 'Resultado do cupom: %', coupon_result;
END $$;

-- 7. Ver uso de cupons
SELECT 
    cu.id,
    cu.used_at,
    dc.code,
    cu.original_amount,
    cu.discount_amount,
    cu.final_amount,
    u.email as customer_email
FROM public.coupon_uses cu
JOIN public.discount_coupons dc ON cu.coupon_id = dc.id
JOIN public.users u ON cu.user_id = u.id
ORDER BY cu.used_at DESC
LIMIT 10;

-- 8. Dashboard do afiliado - estatísticas
SELECT 
    a.channel_name,
    a.tier,
    a.total_referrals,
    a.total_conversions,
    a.conversion_rate,
    a.total_commissions_earned,
    get_affiliate_dashboard_stats(a.id) as dashboard_stats
FROM public.affiliates a
WHERE a.status = 'approved'
ORDER BY a.total_commissions_earned DESC;