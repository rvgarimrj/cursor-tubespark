-- ================================
-- Script de Teste do Sistema de Creator Partnerships
-- Use UUIDs válidos para evitar erros
-- ================================

-- 1. Criar um usuário de teste com UUID válido
INSERT INTO public.users (
    id, 
    email, 
    name, 
    subscription_plan,
    usage_count,
    usage_limit
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- UUID válido
    'creator@test.com', 
    'Test Creator', 
    'free',
    0,
    10
) ON CONFLICT (id) DO NOTHING;

-- 2. Criar um afiliado de teste
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
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- mesmo UUID do usuário
    'UC_testchannel123',
    'Test Creator Channel',
    'https://youtube.com/channel/UC_testchannel123',
    'creator@test.com',
    50000,
    10000,
    'approved',
    'silver',
    0.25 -- 25% de comissão
) ON CONFLICT (youtube_channel_id) DO NOTHING;

-- 3. Criar cupons de teste para o afiliado
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

-- 4. Testar a validação de cupom
SELECT validate_coupon('TESTE20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'starter');

-- 5. Ver dados criados
SELECT 
    'Usuário criado:' as info,
    id::text as id,
    email,
    name as details
FROM public.users 
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

UNION ALL

SELECT 
    'Afiliado criado:' as info,
    id::text,
    channel_name as email,
    CONCAT(tier, ' - ', (commission_rate * 100)::text, '%') as details
FROM public.affiliates 
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

UNION ALL

SELECT 
    'Cupons criados:' as info,
    id::text,
    code as email,
    CONCAT(discount_type, ' - ', discount_value::text) as details
FROM public.discount_coupons 
WHERE affiliate_id IN (
    SELECT id FROM public.affiliates 
    WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- ================================
-- QUERIES ÚTEIS PARA VERIFICAÇÃO
-- ================================

-- Ver todos os afiliados
-- SELECT * FROM public.affiliates;

-- Ver todos os cupons ativos
-- SELECT * FROM public.discount_coupons WHERE is_active = true;

-- Testar validação de cupom com usuário diferente
-- SELECT validate_coupon('TESTE20', gen_random_uuid(), 'starter');

-- Ver estatísticas de um afiliado
-- SELECT get_affiliate_dashboard_stats(
--     (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123')
-- );

-- ================================
-- LIMPEZA (execute quando terminar os testes)
-- ================================

-- Para limpar os dados de teste, execute:
/*
DELETE FROM public.discount_coupons 
WHERE affiliate_id IN (
    SELECT id FROM public.affiliates WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

DELETE FROM public.affiliates WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
DELETE FROM public.users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
*/