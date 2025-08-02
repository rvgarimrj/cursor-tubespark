-- ================================
-- Corrigir incompatibilidade de tipos
-- ================================

-- Opção 1: Corrigir a função trigger para fazer cast correto
CREATE OR REPLACE FUNCTION update_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'active') THEN
        UPDATE public.users 
        SET 
            subscription_plan = NEW.plan_type::subscription_plan,  -- Cast explícito
            subscription_status = NEW.status,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Opção 2: Se o enum subscription_plan não tem os valores necessários, adicionar
-- Primeiro, vamos verificar se os valores existem
DO $$
BEGIN
    -- Tentar adicionar valores ao enum se não existirem
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'starter' 
        AND enumtypid = 'subscription_plan'::regtype
    ) THEN
        ALTER TYPE subscription_plan ADD VALUE IF NOT EXISTS 'starter';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'pro' 
        AND enumtypid = 'subscription_plan'::regtype
    ) THEN
        ALTER TYPE subscription_plan ADD VALUE IF NOT EXISTS 'pro';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'business' 
        AND enumtypid = 'subscription_plan'::regtype
    ) THEN
        ALTER TYPE subscription_plan ADD VALUE IF NOT EXISTS 'business';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Se falhar, não fazer nada (valores já existem ou tipo não existe)
        NULL;
END $$;

-- Opção 3: Se preferir, alterar a coluna para aceitar VARCHAR
-- CUIDADO: Isto pode quebrar outras partes do sistema
/*
ALTER TABLE public.users 
ALTER COLUMN subscription_plan TYPE VARCHAR(50) 
USING subscription_plan::text;
*/

-- Opção 4: Criar um teste que use valores válidos do enum
-- Primeiro, vamos ver quais valores são válidos
SELECT unnest(enum_range(NULL::subscription_plan)) as valid_plans;