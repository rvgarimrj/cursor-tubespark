-- ================================
-- Script de Teste Simplificado
-- Versão sem UNION para evitar erros de tipo
-- ================================

-- 1. Criar usuário de teste
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
    'free',
    0,
    10
) ON CONFLICT (id) DO NOTHING;

-- 2. Criar afiliado
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
) ON CONFLICT (youtube_channel_id) DO NOTHING;

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
) ON CONFLICT (code) DO NOTHING;

-- 4. Verificar dados criados (queries separadas)

-- Ver usuário
SELECT 'USUÁRIO CRIADO:' as "=== INFORMAÇÃO ===";
SELECT id, email, name, subscription_plan 
FROM public.users 
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Ver afiliado
SELECT '
AFILIADO CRIADO:' as "=== INFORMAÇÃO ===";
SELECT 
    id,
    channel_name,
    youtube_channel_id,
    tier,
    commission_rate * 100 as commission_percentage,
    status
FROM public.affiliates 
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Ver cupons
SELECT '
CUPONS CRIADOS:' as "=== INFORMAÇÃO ===";
SELECT 
    code,
    discount_type,
    discount_value,
    CASE 
        WHEN discount_type = 'percentage' THEN discount_value || '%'
        ELSE 'R$ ' || discount_value
    END as discount_display,
    max_uses,
    current_uses,
    is_active
FROM public.discount_coupons 
WHERE affiliate_id IN (
    SELECT id FROM public.affiliates 
    WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- 5. Testar validação de cupom
SELECT '
TESTE DE VALIDAÇÃO DO CUPOM TESTE20:' as "=== INFORMAÇÃO ===";
SELECT validate_coupon('TESTE20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'starter');

-- 6. Ver estatísticas do afiliado
SELECT '
ESTATÍSTICAS DO AFILIADO:' as "=== INFORMAÇÃO ===";
SELECT get_affiliate_dashboard_stats(
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123')
);

-- ================================
-- TESTE COMPLETO DE USO DE CUPOM
-- ================================

-- Criar um cliente para testar
INSERT INTO public.users (
    id,
    email,
    name,
    subscription_plan
) VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'cliente@test.com',
    'Cliente Teste',
    'free'
) ON CONFLICT (id) DO NOTHING;

-- Criar subscription para o cliente
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
) ON CONFLICT (id) DO NOTHING;

-- Aplicar cupom
SELECT '
APLICAÇÃO DE CUPOM:' as "=== INFORMAÇÃO ===";
SELECT apply_coupon(
    'TESTE20',                                    -- código do cupom
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',     -- ID do cliente
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',     -- ID da subscription
    9.99,                                         -- valor original
    '192.168.1.1'::inet,                         -- IP do cliente
    'Mozilla/5.0',                               -- User agent
    'https://youtube.com/testcreator'            -- Referrer
);

-- Ver uso do cupom
SELECT '
USOS DO CUPOM:' as "=== INFORMAÇÃO ===";
SELECT 
    cu.used_at,
    dc.code,
    u.email as cliente,
    cu.original_amount,
    cu.discount_amount,
    cu.final_amount
FROM public.coupon_uses cu
JOIN public.discount_coupons dc ON cu.coupon_id = dc.id
JOIN public.users u ON cu.user_id = u.id
WHERE dc.affiliate_id IN (
    SELECT id FROM public.affiliates 
    WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- ================================
-- LIMPEZA (quando terminar testes)
-- ================================
/*
-- Para limpar TODOS os dados de teste:
DELETE FROM public.coupon_uses WHERE user_id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');
DELETE FROM public.subscriptions WHERE user_id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
DELETE FROM public.discount_coupons WHERE affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
DELETE FROM public.affiliates WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
DELETE FROM public.users WHERE id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');
*/