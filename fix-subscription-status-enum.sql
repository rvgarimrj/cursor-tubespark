-- ================================
-- Corrigir função para lidar com ENUMs corretamente
-- ================================

-- 1. Verificar quais ENUMs existem
SELECT 
    t.typname AS enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN ('subscription_plan', 'subscription_status')
GROUP BY t.typname;

-- 2. Corrigir a função update_user_subscription
CREATE OR REPLACE FUNCTION update_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'active') THEN
        -- Verificar se os valores existem nos ENUMs e fazer cast correto
        UPDATE public.users 
        SET 
            subscription_plan = CASE 
                WHEN NEW.plan_type IN (SELECT unnest(enum_range(NULL::subscription_plan))::text) 
                THEN NEW.plan_type::subscription_plan 
                ELSE subscription_plan 
            END,
            subscription_status = CASE 
                WHEN NEW.status IN (SELECT unnest(enum_range(NULL::subscription_status))::text) 
                THEN NEW.status::subscription_status 
                ELSE subscription_status 
            END,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Alternativa: Desabilitar temporariamente o trigger para testes
-- ALTER TABLE public.subscriptions DISABLE TRIGGER trigger_update_user_subscription;