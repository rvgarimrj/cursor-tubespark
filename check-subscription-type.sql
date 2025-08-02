-- ================================
-- Verificar tipo da coluna subscription_plan
-- ================================

-- 1. Ver o tipo exato da coluna
SELECT 
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
AND column_name = 'subscription_plan';

-- 2. Se for um ENUM, ver os valores possíveis
SELECT 
    t.typname AS enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'subscription_plan'
GROUP BY t.typname;

-- 3. Ver a estrutura da tabela users
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;