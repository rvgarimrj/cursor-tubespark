# 🚀 Guia de Migração - Sistema de Creator Partnerships

Este guia irá orientá-lo através do processo de aplicação da migração do sistema de creator partnerships no Supabase.

## 📋 Pré-requisitos

- ✅ Acesso ao Supabase Dashboard
- ✅ Permissões de administrador no projeto
- ✅ Backup do banco de dados (recomendado)

## 🎯 O que esta migração adiciona

### 5 Novas Tabelas:
1. **affiliates** - Informações dos creators/afiliados
2. **discount_coupons** - Sistema de cupons de desconto
3. **coupon_uses** - Rastreamento de uso de cupons
4. **affiliate_commissions** - Comissões dos afiliados
5. **affiliate_activities** - Atividades e rastreamento

### 4 Funções Principais:
1. **validate_coupon** - Valida cupons de desconto
2. **apply_coupon** - Aplica cupom e cria registro de uso
3. **create_affiliate_commission** - Cria registro de comissão
4. **get_affiliate_dashboard_stats** - Estatísticas do dashboard

### Sistema de Tiers:
- 🥉 **Bronze**: 20% de comissão
- 🥈 **Silver**: 25% de comissão
- 🥇 **Gold**: 30% de comissão

## 📝 Passo a Passo

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://app.supabase.com
2. Faça login com suas credenciais
3. Selecione o projeto TubeSpark

### Passo 2: Abrir o SQL Editor

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query** (Nova consulta)

### Passo 3: Preparar a Migração

1. Copie TODO o conteúdo do arquivo:
   ```
   lib/supabase/migrations/006_add_creator_partnership_system.sql
   ```

2. Cole no SQL Editor do Supabase

### Passo 4: Revisar a Migração

Antes de executar, verifique:
- ✅ O SQL está completo (deve terminar com o comentário sobre `get_affiliate_dashboard_stats`)
- ✅ Não há erros de sintaxe destacados no editor

### Passo 5: Executar a Migração

1. Clique no botão **Run** (Executar)
2. Aguarde a execução completa
3. Você verá uma mensagem de sucesso se tudo correr bem

### Passo 6: Verificar a Migração

Execute esta query para verificar se as tabelas foram criadas:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'affiliates', 
  'discount_coupons', 
  'coupon_uses', 
  'affiliate_commissions', 
  'affiliate_activities'
);
```

Deve retornar 5 linhas.

### Passo 7: Verificar as Funções

Execute esta query para verificar as funções:

```sql
-- Verificar funções criadas
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'validate_coupon',
  'apply_coupon',
  'create_affiliate_commission',
  'get_affiliate_dashboard_stats'
);
```

Deve retornar 4 linhas.

## 🧪 Teste Rápido

### Teste 1: Criar um Afiliado de Teste

```sql
-- Criar um usuário de teste primeiro (se necessário)
INSERT INTO public.users (id, email, name, subscription_plan)
VALUES ('test-user-123', 'creator@test.com', 'Test Creator', 'free')
ON CONFLICT (id) DO NOTHING;

-- Criar um afiliado
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
  'test-user-123',
  'UC_testchannel123',
  'Test Creator Channel',
  'https://youtube.com/channel/UC_testchannel123',
  'creator@test.com',
  50000,
  'approved',
  'silver'
);
```

### Teste 2: Criar um Cupom

```sql
-- Criar um cupom de desconto
INSERT INTO public.discount_coupons (
  affiliate_id,
  code,
  discount_type,
  discount_value,
  description
) VALUES (
  (SELECT id FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123'),
  'TESTE20',
  'percentage',
  20,
  '20% de desconto para novos usuários'
);
```

### Teste 3: Validar o Cupom

```sql
-- Testar a função de validação
SELECT validate_coupon('TESTE20', 'test-user-123', 'starter');
```

## 🛡️ Troubleshooting

### Erro: "type already exists"
Se receber este erro, significa que parte da migração já foi aplicada. Execute:

```sql
-- Limpar tipos existentes (CUIDADO!)
DROP TYPE IF EXISTS affiliate_tier CASCADE;
DROP TYPE IF EXISTS affiliate_status CASCADE;
DROP TYPE IF EXISTS commission_status CASCADE;
DROP TYPE IF EXISTS activity_type CASCADE;
```

Depois execute a migração novamente.

### Erro: "relation already exists"
Se alguma tabela já existe, você pode:
1. Pular a criação dessa tabela específica
2. Ou fazer backup e recriar

### Erro: "function already exists"
Se alguma função já existe, adicione antes da criação:

```sql
DROP FUNCTION IF EXISTS nome_da_funcao CASCADE;
```

## ✅ Próximos Passos

Após aplicar a migração com sucesso:

1. **Execute os testes novamente**:
   ```bash
   node test-database-migration.js
   node test-creator-apis.js
   ```

2. **Limpe os dados de teste**:
   ```sql
   -- Limpar dados de teste
   DELETE FROM public.discount_coupons WHERE code = 'TESTE20';
   DELETE FROM public.affiliates WHERE youtube_channel_id = 'UC_testchannel123';
   DELETE FROM public.users WHERE id = 'test-user-123';
   ```

3. **Configure as primeiras parcerias**:
   - Crie os primeiros creators parceiros
   - Configure cupons de lançamento
   - Teste o fluxo completo

## 📊 Monitoramento

Para monitorar o sistema após a migração:

```sql
-- Ver todos os afiliados
SELECT * FROM public.affiliates;

-- Ver cupons ativos
SELECT * FROM public.discount_coupons WHERE is_active = true;

-- Ver uso de cupons
SELECT * FROM public.coupon_uses ORDER BY used_at DESC;

-- Ver comissões pendentes
SELECT * FROM public.affiliate_commissions WHERE status = 'pending';
```

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase
2. Confirme que todas as partes da migração foram aplicadas
3. Execute os scripts de teste para diagnóstico

---

**Importante**: Esta migração adiciona funcionalidades críticas de monetização. Faça backup antes de aplicar em produção!