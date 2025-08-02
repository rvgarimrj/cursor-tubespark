-- ================================
-- Teste Simplificado - Apenas o Essencial
-- Evita problemas com subscription_plan enum
-- ================================

-- Limpar dados anteriores
DELETE FROM public.discount_coupons WHERE code = 'SIMPLES20';
DELETE FROM public.affiliates WHERE youtube_channel_id = 'UC_simple123';

-- 1. Usar um usuário existente ou criar um novo
-- Primeiro, vamos ver se tem algum usuário disponível
DO $$
DECLARE
    test_user_id UUID;
    test_affiliate_id UUID;
BEGIN
    -- Pegar o primeiro usuário existente ou criar um novo
    SELECT id INTO test_user_id FROM public.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        test_user_id := gen_random_uuid();
        INSERT INTO public.users (id, email, name) 
        VALUES (test_user_id, 'affiliate@test.com', 'Test Affiliate');
    END IF;
    
    -- Criar afiliado
    INSERT INTO public.affiliates (
        user_id,
        youtube_channel_id,
        channel_name,
        channel_url,
        contact_email,
        subscriber_count,
        status,
        tier
    ) VALUES (
        test_user_id,
        'UC_simple123',
        'Simple Test Channel',
        'https://youtube.com/channel/UC_simple123',
        'affiliate@test.com',
        25000,
        'approved',
        'bronze'
    ) RETURNING id INTO test_affiliate_id;
    
    -- Criar cupom
    INSERT INTO public.discount_coupons (
        affiliate_id,
        code,
        discount_type,
        discount_value,
        description
    ) VALUES (
        test_affiliate_id,
        'SIMPLES20',
        'percentage',
        20,
        'Desconto de teste'
    );
    
    RAISE NOTICE 'Afiliado criado com ID: %', test_affiliate_id;
    RAISE NOTICE 'Cupom SIMPLES20 criado com sucesso!';
END $$;

-- 2. Verificar dados criados
SELECT '=== AFILIADO CRIADO ===' as info;
SELECT 
    channel_name,
    tier,
    status,
    commission_rate * 100 || '%' as commission
FROM public.affiliates 
WHERE youtube_channel_id = 'UC_simple123';

SELECT '=== CUPOM CRIADO ===' as info;
SELECT 
    code,
    discount_type,
    discount_value || '%' as discount,
    is_active
FROM public.discount_coupons 
WHERE code = 'SIMPLES20';

-- 3. Testar validação do cupom (sem especificar plano)
SELECT '=== VALIDAÇÃO DO CUPOM ===' as info;
SELECT validate_coupon('SIMPLES20', gen_random_uuid(), NULL);

-- 4. Ver estatísticas básicas
SELECT '=== ESTATÍSTICAS DO AFILIADO ===' as info;
SELECT get_affiliate_dashboard_stats(
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_simple123')
);

-- ================================
-- Para limpar depois:
-- DELETE FROM public.discount_coupons WHERE code = 'SIMPLES20';
-- DELETE FROM public.affiliates WHERE youtube_channel_id = 'UC_simple123';
-- ================================