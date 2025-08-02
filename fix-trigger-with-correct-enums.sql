-- ================================
-- Corrigir função com valores corretos dos ENUMs
-- ================================

-- Corrigir a função update_user_subscription com os valores exatos dos ENUMs
CREATE OR REPLACE FUNCTION update_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'active') THEN
        UPDATE public.users 
        SET 
            subscription_plan = CASE 
                -- Verificar se plan_type é um valor válido no enum subscription_plan
                WHEN NEW.plan_type IN ('free', 'pro', 'enterprise', 'starter', 'business') 
                THEN NEW.plan_type::subscription_plan 
                ELSE subscription_plan  -- manter o valor atual se inválido
            END,
            subscription_status = CASE 
                -- Verificar se status é um valor válido no enum subscription_status
                WHEN NEW.status IN ('active', 'cancelled', 'expired') 
                THEN NEW.status::subscription_status 
                ELSE subscription_status  -- manter o valor atual se inválido
            END,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Agora você pode executar o teste completo sem desabilitar o trigger:
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
    VALUES (v_customer_id, 'cliente_venda2@test.com', 'Cliente Comprador 2');
    
    RAISE NOTICE 'Cliente criado: %', v_customer_id;
    
    -- Pegar o afiliado
    SELECT id INTO v_affiliate_id 
    FROM public.affiliates 
    WHERE youtube_channel_id = 'UC_simple123';
    
    IF v_affiliate_id IS NULL THEN
        RAISE EXCEPTION 'Afiliado não encontrado!';
    END IF;
    
    -- Criar subscription com valor válido do enum
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
        'starter',  -- válido no enum subscription_plan
        'active',   -- válido no enum subscription_status
        NOW(),
        NOW() + INTERVAL '30 days',
        'sub_' || substr(md5(random()::text), 1, 10)
    );
    
    RAISE NOTICE 'Subscription criada com trigger funcionando!';
    
    -- Aplicar cupom
    v_coupon_result := apply_coupon(
        'SIMPLES20',
        v_customer_id,
        v_subscription_id,
        9.99,
        '192.168.1.100'::inet,
        'Mozilla/5.0',
        'https://youtube.com/simpleschannel'
    );
    
    RAISE NOTICE 'Cupom aplicado: %', v_coupon_result;
    
    -- Criar comissão se cupom foi aplicado
    IF (v_coupon_result->>'valid')::boolean THEN
        v_commission_result := create_affiliate_commission(
            v_affiliate_id,
            v_subscription_id,
            (v_coupon_result->>'coupon_use_id')::UUID
        );
        
        RAISE NOTICE 'Comissão criada: %', v_commission_result;
    END IF;
    
END $$;

-- Ver resultados finais
SELECT '=== 💰 RESULTADO DA VENDA ===' as info;
SELECT 
    dc.code as cupom,
    cu.original_amount as preco_original,
    cu.discount_amount as desconto,
    cu.final_amount as preco_final,
    ROUND((cu.discount_amount / cu.original_amount) * 100) || '% OFF' as economia
FROM public.coupon_uses cu
JOIN public.discount_coupons dc ON cu.coupon_id = dc.id
WHERE dc.code = 'SIMPLES20'
ORDER BY cu.used_at DESC
LIMIT 1;

SELECT '=== 🎯 COMISSÃO DO AFILIADO ===' as info;
SELECT 
    a.channel_name,
    a.tier,
    ac.commission_rate * 100 || '%' as taxa_comissao,
    '$' || ac.base_amount as valor_base,
    '$' || ac.commission_amount as comissao_recebida,
    ac.status as status_pagamento
FROM public.affiliate_commissions ac
JOIN public.affiliates a ON ac.affiliate_id = a.id
WHERE a.youtube_channel_id = 'UC_simple123'
ORDER BY ac.created_at DESC
LIMIT 1;

SELECT '=== 📊 DASHBOARD ATUALIZADO ===' as info;
SELECT get_affiliate_dashboard_stats(
    (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_simple123')
);