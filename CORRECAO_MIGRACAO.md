# 🔧 Correção da Migração - Tabelas Faltantes

O erro ocorreu porque a migração do sistema de creator partnerships depende de tabelas que ainda não existem no seu banco de dados. Vamos resolver isso em 2 passos:

## 📋 Tabelas que Estão Faltando:

1. **subscriptions** - Gerenciamento de assinaturas
2. **plan_limits** - Definição dos planos
3. **usage_tracking** - Rastreamento de uso
4. **video_scripts** - Scripts de vídeos

## 🎯 Solução: Aplicar Migrações em Ordem

### PASSO 1: Criar as Tabelas Base Primeiro

1. **No Supabase SQL Editor**, execute PRIMEIRO este SQL:

```sql
-- Copie TODO o conteúdo do arquivo:
lib/supabase/migrations/005_create_missing_tables.sql
```

Esta migração irá criar:
- ✅ Tabela `plan_limits` com 4 planos (free, starter, pro, business)
- ✅ Tabela `subscriptions` para gerenciar assinaturas
- ✅ Tabela `usage_tracking` para rastrear uso
- ✅ Tabela `video_scripts` para scripts gerados
- ✅ Índices e políticas de segurança
- ✅ Triggers automáticos

### PASSO 2: Aplicar a Migração de Creator Partnerships

**SOMENTE APÓS** o sucesso do Passo 1, execute:

```sql
-- Copie TODO o conteúdo do arquivo:
lib/supabase/migrations/006_add_creator_partnership_system.sql
```

## 🧪 Verificação Rápida

Após executar o PASSO 1, verifique se as tabelas foram criadas:

```sql
-- Verificar se as tabelas base existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'plan_limits',
  'subscriptions', 
  'usage_tracking',
  'video_scripts'
);
```

Deve retornar 4 linhas.

## ✅ Ordem Correta de Execução:

1. **Migração 005** - Tabelas base (execute PRIMEIRO)
2. **Migração 006** - Sistema de creator partnerships (execute DEPOIS)

## 🆘 Se Ainda Der Erro:

### Opção A: Verificar função update_updated_at_column

Se receber erro sobre `update_updated_at_column`, execute primeiro:

```sql
-- Criar função auxiliar se não existir
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Opção B: Executar em Partes

Se o SQL for muito grande, você pode executar em seções:
1. Primeiro execute apenas as CREATE TABLE
2. Depois os INSERT dos planos
3. Por fim os índices e políticas

## 📊 Resultado Esperado

Após executar ambas as migrações com sucesso, você terá:

**Da Migração 005:**
- 4 tabelas core do sistema
- 4 planos de assinatura configurados
- Sistema de rastreamento de uso

**Da Migração 006:**
- 5 tabelas do sistema de partnerships
- 4 funções de gerenciamento
- Sistema completo de comissões

Total: **9 novas tabelas** e **4 funções**

---

**IMPORTANTE**: Execute as migrações NA ORDEM CORRETA! A migração 006 depende das tabelas criadas pela migração 005.