-- ================================
-- PARTE 1: Verificar e adicionar valores ao ENUM (execute separadamente)
-- ================================

-- Ver valores atuais do enum
SELECT unnest(enum_range(NULL::subscription_plan)) as existing_plans;

-- Se precisar adicionar valores, execute CADA UM separadamente:
-- ALTER TYPE subscription_plan ADD VALUE IF NOT EXISTS 'starter';
-- ALTER TYPE subscription_plan ADD VALUE IF NOT EXISTS 'pro';
-- ALTER TYPE subscription_plan ADD VALUE IF NOT EXISTS 'business';

-- ================================
-- PARTE 2: Corrigir o trigger (execute após adicionar valores)
-- ================================

CREATE OR REPLACE FUNCTION update_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'active') THEN
        -- Verificar se o plan_type existe no enum antes de fazer update
        IF NEW.plan_type IN (SELECT unnest(enum_range(NULL::subscription_plan))::text) THEN
            UPDATE public.users 
            SET 
                subscription_plan = NEW.plan_type::subscription_plan,
                subscription_status = NEW.status,
                updated_at = NOW()
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- PARTE 3: Script de teste simplificado
-- ================================

-- Limpar dados anteriores para evitar conflitos
DELETE FROM public.coupon_uses WHERE user_id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');
DELETE FROM public.subscriptions WHERE user_id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');
DELETE FROM public.discount_coupons WHERE code IN ('TESTE20', 'TESTE10FIXO');
DELETE FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123';
DELETE FROM public.users WHERE id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');

-- 1. Criar usuário creator
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
    'free'::subscription_plan,
    0,
    10
);

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
);

-- 3. Criar cupons
INSERT INTO public.discount_coupons (
    affiliate_id,
    code,
    discount_type,
    discount_value,
    description,
    max_uses
) VALUES (
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123'),
    'TESTE20',
    'percentage',
    20,
    '20% de desconto',
    100
);

-- 4. Testar validação
SELECT '=== TESTE DE VALIDAÇÃO ===' as info;
SELECT validate_coupon('TESTE20', gen_random_uuid(), 'free');

-- 5. Ver afiliado criado
SELECT '=== AFILIADO CRIADO ===' as info;
SELECT 
    channel_name,
    tier,
    commission_rate * 100 || '%' as commission,
    status
FROM public.affiliates 
WHERE youtube_channel_id = 'UC_testchannel123';

-- 6. Ver estatísticas
SELECT '=== ESTATÍSTICAS ===' as info;
SELECT get_affiliate_dashboard_stats(
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123')
);