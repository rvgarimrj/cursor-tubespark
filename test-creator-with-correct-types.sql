-- ================================
-- Script de Teste com Tipos Corretos
-- Usa valores compatíveis com o enum subscription_plan
-- ================================

-- Primeiro, vamos descobrir os valores válidos do enum
SELECT unnest(enum_range(NULL::subscription_plan)) as valid_subscription_plans;

-- 1. Criar usuário de teste usando cast correto
INSERT INTO public.users (
    id, 
    email, 
    name, 
    subscription_plan,
    usage_count,
    usage_limit
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'creator@test.com', 
    'Test Creator', 
    'free'::subscription_plan,  -- Cast explícito para o enum
    0,
    10
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name;

-- 2. Criar afiliado (sem mudanças necessárias)
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
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'UC_testchannel123',
    'Test Creator Channel',
    'https://youtube.com/channel/UC_testchannel123',
    'creator@test.com',
    50000,
    10000,
    'approved',
    'silver',
    0.25
) ON CONFLICT (youtube_channel_id) DO UPDATE SET
    status = 'approved',
    tier = 'silver',
    commission_rate = 0.25;

-- 3. Criar cupons
INSERT INTO public.discount_coupons (
    affiliate_id,
    code,
    discount_type,
    discount_value,
    description,
    max_uses,
    max_uses_per_user
) VALUES 
(
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123'),
    'TESTE20',
    'percentage',
    20,
    '20% de desconto para novos usuários',
    100,
    1
),
(
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123'),
    'TESTE10FIXO',
    'fixed',
    10,
    'R$10 de desconto',
    50,
    1
) ON CONFLICT (code) DO UPDATE SET
    is_active = true,
    max_uses = 100;

-- 4. Testar validação
SELECT '=== VALIDAÇÃO DO CUPOM ===' as info;
SELECT validate_coupon('TESTE20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'starter');

-- 5. Criar cliente para teste
INSERT INTO public.users (
    id,
    email,
    name,
    subscription_plan
) VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'cliente@test.com',
    'Cliente Teste',
    'free'::subscription_plan  -- Cast explícito
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name;

-- 6. Desabilitar temporariamente o trigger problemático
ALTER TABLE public.subscriptions DISABLE TRIGGER trigger_update_user_subscription;

-- 7. Criar subscription
INSERT INTO public.subscriptions (
    id,
    user_id,
    plan_type,
    status,
    current_period_start,
    current_period_end
) VALUES (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'starter',
    'active',
    NOW(),
    NOW() + INTERVAL '30 days'
) ON CONFLICT (id) DO UPDATE SET
    status = 'active';

-- 8. Reabilitar o trigger
ALTER TABLE public.subscriptions ENABLE TRIGGER trigger_update_user_subscription;

-- 9. Aplicar cupom
SELECT '=== APLICAÇÃO DO CUPOM ===' as info;
SELECT apply_coupon(
    'TESTE20',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    9.99,
    '192.168.1.1'::inet,
    'Mozilla/5.0',
    'https://youtube.com/testcreator'
);

-- 10. Ver resultados
SELECT '=== AFILIADO CRIADO ===' as info;
SELECT 
    channel_name,
    tier,
    commission_rate * 100 as commission_percentage,
    status
FROM public.affiliates 
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

SELECT '=== CUPONS DISPONÍVEIS ===' as info;
SELECT 
    code,
    discount_type,
    discount_value,
    max_uses,
    current_uses
FROM public.discount_coupons 
WHERE affiliate_id = (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123');

SELECT '=== USOS DO CUPOM ===' as info;
SELECT 
    dc.code,
    cu.original_amount,
    cu.discount_amount,
    cu.final_amount,
    cu.used_at
FROM public.coupon_uses cu
JOIN public.discount_coupons dc ON cu.coupon_id = dc.id
WHERE cu.user_id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

SELECT '=== ESTATÍSTICAS DO AFILIADO ===' as info;
SELECT get_affiliate_dashboard_stats(
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123')
);

-- ================================
-- LIMPEZA (quando terminar)
-- ================================
/*
DELETE FROM public.coupon_uses WHERE user_id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');
DELETE FROM public.subscriptions WHERE user_id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
DELETE FROM public.discount_coupons WHERE affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
DELETE FROM public.affiliates WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
DELETE FROM public.users WHERE id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');
*/