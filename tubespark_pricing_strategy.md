# 📊 TubeSpark - Estratégia de Preços e Planos de Assinatura

**Data:** 4 de Agosto de 2025  
**Versão:** 1.0  
**Preparado para:** Equipe de Desenvolvimento  
**Aprovado por:** CEO

---

## 🎯 OBJETIVO

Implementar sistema de preços otimizado para **maximizar lucro** desde o primeiro usuário, com **97%+ de margem** em todos os planos pagos.

---

## 📋 ESTRUTURA DE PLANOS

### 🆓 **FREEMIUM**
**Objetivo:** Aquisição de usuários com custo mínimo de API

| Recurso | Limite | Custo API Estimado |
|---------|--------|-------------------|
| Ideias personalizadas | 5/mês | $0.004 |
| Roteiros básicos | 2/mês | $0.004 |
| Roteiros premium | ❌ Bloqueado | $0 |
| Análise de tendências | Básica | Incluído |
| Suporte | Comunitário | $0 |
| **CUSTO TOTAL/MÊS** | | **$0.008** |

### 🚀 **STARTER**
**Objetivo:** Plano de entrada com alta margem de lucro

| Recurso | Limite | Custo API Estimado |
|---------|--------|-------------------|
| Ideias personalizadas | 100/mês | $0.08 |
| Roteiros básicos | 20/mês | $0.04 |
| Roteiros premium | 3/mês | $0.024 |
| Análise de tendências | Avançada | Incluído |
| Análise de competidores | ❌ Bloqueado | $0 |
| Suporte | Email | $0 |
| **CUSTO TOTAL/MÊS** | | **$0.144** |

### 💎 **PRO**
**Objetivo:** Plano premium com recursos ilimitados controlados

| Recurso | Limite | Custo API Estimado |
|---------|--------|-------------------|
| Ideias personalizadas | Ilimitado* | $0.16 |
| Roteiros básicos | Ilimitado* | $0.10 |
| Roteiros premium | 25/mês | $0.20 |
| Análise de tendências | Completa | Incluído |
| Análise de competidores | ✅ Incluído | Incluído |
| Otimização SEO | ✅ Incluído | Incluído |
| Suporte | Prioritário | $0 |
| **CUSTO TOTAL/MÊS** | | **$0.46** |

*_Ilimitado baseado em fair use policy (estimativa: 200 ideias + 50 roteiros básicos/mês)_

---

## 💰 PREÇOS POR REGIÃO

### 🇧🇷 **BRASIL (Mercado Principal)**

| Plano | Mensal | Anual | Desconto | Margem Mensal | Margem Anual |
|-------|--------|-------|----------|---------------|--------------|
| Freemium | R$ 0 | R$ 0 | - | -R$ 0,05 | -R$ 0,60 |
| Starter | R$ 47,00 | R$ 470,00 | 17% | 98,2% | 98,4% |
| Pro | R$ 97,00 | R$ 970,00 | 17% | 97,2% | 97,4% |

### 🇺🇸 **ESTADOS UNIDOS**

| Plano | Mensal | Anual | Desconto | Margem Mensal | Margem Anual |
|-------|--------|-------|----------|---------------|--------------|
| Freemium | $0 | $0 | - | -$0,008 | -$0,096 |
| Starter | $12 | $120 | 17% | 98,8% | 98,9% |
| Pro | $24 | $240 | 17% | 98,1% | 98,2% |

### 🇪🇸 **ESPANHA**

| Plano | Mensal | Anual | Desconto | Margem Mensal | Margem Anual |
|-------|--------|-------|----------|---------------|--------------|
| Freemium | €0 | €0 | - | -€0,007 | -€0,084 |
| Starter | €11 | €110 | 17% | 98,7% | 98,8% |
| Pro | €22 | €220 | 17% | 97,9% | 98,0% |

### 🇫🇷 **FRANÇA**

| Plano | Mensal | Anual | Desconto | Margem Mensal | Margem Anual |
|-------|--------|-------|----------|---------------|--------------|
| Freemium | €0 | €0 | - | -€0,007 | -€0,084 |
| Starter | €11 | €110 | 17% | 98,7% | 98,8% |
| Pro | €22 | €220 | 17% | 97,9% | 98,0% |

---

## 🛠️ REQUISITOS TÉCNICOS DE IMPLEMENTAÇÃO

### **1. Sistema de Limites e Cotas**

```javascript
// Estrutura de limites por plano
const PLAN_LIMITS = {
  freemium: {
    ideas_per_month: 5,
    basic_scripts_per_month: 2,
    premium_scripts_per_month: 0,
    competitor_analysis: false,
    priority_support: false
  },
  starter: {
    ideas_per_month: 100,
    basic_scripts_per_month: 20,
    premium_scripts_per_month: 3,
    competitor_analysis: false,
    priority_support: false
  },
  pro: {
    ideas_per_month: -1, // Ilimitado (fair use)
    basic_scripts_per_month: -1, // Ilimitado (fair use)
    premium_scripts_per_month: 25,
    competitor_analysis: true,
    priority_support: true
  }
}
```

### **2. Tabelas de Banco de Dados**

#### **Tabela: `subscription_plans`**
```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  region VARCHAR(5) NOT NULL, -- 'BR', 'US', 'ES', 'FR'
  currency VARCHAR(3) NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2) NOT NULL,
  limits JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabela: `user_usage_tracking`**
```sql
CREATE TABLE user_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  month_year VARCHAR(7) NOT NULL, -- '2025-08'
  ideas_used INTEGER DEFAULT 0,
  basic_scripts_used INTEGER DEFAULT 0,
  premium_scripts_used INTEGER DEFAULT 0,
  api_cost_usd DECIMAL(10,6) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);
```

### **3. APIs Necessárias**

#### **GET /api/user/usage-status**
```javascript
// Retorna status de uso atual do usuário
{
  "current_plan": "starter",
  "billing_cycle": "monthly",
  "usage_this_month": {
    "ideas_used": 23,
    "ideas_limit": 100,
    "basic_scripts_used": 8,
    "basic_scripts_limit": 20,
    "premium_scripts_used": 1,
    "premium_scripts_limit": 3
  },
  "api_cost_this_month": 0.05,
  "days_until_reset": 8
}
```

#### **POST /api/billing/upgrade-plan**
```javascript
// Payload para upgrade de plano
{
  "new_plan": "pro",
  "billing_cycle": "annual", // "monthly" ou "annual"
  "region": "BR"
}
```

#### **POST /api/usage/track**
```javascript
// Registrar uso de API
{
  "action_type": "generate_idea", // "generate_idea", "basic_script", "premium_script"
  "api_cost": 0.0008,
  "tokens_used": 150
}
```

### **4. Middleware de Verificação de Limites**

```javascript
async function checkUsageLimits(userId, actionType) {
  const userPlan = await getUserCurrentPlan(userId);
  const currentUsage = await getCurrentMonthUsage(userId);
  const limits = PLAN_LIMITS[userPlan.name];
  
  const limitKey = `${actionType}_per_month`;
  const usageKey = `${actionType}_used`;
  
  if (limits[limitKey] !== -1 && currentUsage[usageKey] >= limits[limitKey]) {
    throw new Error(`LIMIT_EXCEEDED:${actionType}`);
  }
  
  return true;
}
```

---

## 🎨 IMPLEMENTAÇÃO DE UI/UX

### **1. Paywall Modal**
- **Trigger:** Quando usuário atinge 80% do limite
- **Design:** Modal elegante com comparação de planos
- **CTA:** "Fazer Upgrade Agora"

### **2. Usage Dashboard**
- **Localização:** Dashboard principal
- **Elementos:**
  - Barra de progresso para cada recurso
  - Contador de dias até reset
  - Botão de upgrade contextual

### **3. Billing Page**
- **Toggle mensal/anual** com destaque do desconto
- **Calculadora de economia** para plano anual
- **Comparação clara** entre planos

---

## 🌍 CONFIGURAÇÃO MULTI-IDIOMA

### **Strings de Localização**

#### **Português (pt-BR)**
```json
{
  "plans": {
    "freemium": "Gratuito",
    "starter": "Starter",
    "pro": "Pro"
  },
  "billing": {
    "monthly": "Mensal",
    "annual": "Anual",
    "save": "Economize 17%"
  },
  "limits": {
    "ideas": "ideias",
    "basic_scripts": "roteiros básicos",
    "premium_scripts": "roteiros premium"
  }
}
```

#### **Inglês (en-US)**
```json
{
  "plans": {
    "freemium": "Free",
    "starter": "Starter", 
    "pro": "Pro"
  },
  "billing": {
    "monthly": "Monthly",
    "annual": "Annual",
    "save": "Save 17%"
  },
  "limits": {
    "ideas": "ideas",
    "basic_scripts": "basic scripts",
    "premium_scripts": "premium scripts"
  }
}
```

---

## 📊 KPIs PARA MONITORAMENTO

### **Métricas de Conversão**
- **Freemium → Starter:** Meta 15% em 30 dias
- **Starter → Pro:** Meta 8% em 60 dias
- **Anual vs Mensal:** Meta 30% escolhem anual

### **Métricas de Uso**
- **API cost per user:** Manter < $0.50/mês no Pro
- **Fair use compliance:** < 5% usuários Pro excedem estimativas
- **Support tickets:** < 2% usuários/mês

### **Métricas Financeiras**
- **MRR Growth Rate:** Meta 15%/mês
- **Gross Margin:** Manter > 95%
- **CAC Payback:** < 2 meses

---

## ⚡ CRONOGRAMA DE IMPLEMENTAÇÃO

### **Sprint 1 (Semana 1-2)**
- [ ] Criar tabelas de banco de dados
- [ ] Implementar sistema de limites base
- [ ] APIs de usage tracking
- [ ] Middleware de verificação

### **Sprint 2 (Semana 3-4)**  
- [ ] Integração Stripe multi-região
- [ ] Paywall modals
- [ ] Usage dashboard
- [ ] Billing page

### **Sprint 3 (Semana 5-6)**
- [ ] Localização completa 4 idiomas
- [ ] Analytics e KPIs
- [ ] Testes A/B pricing
- [ ] Deploy production

---

## 🚨 ALERTS E MONITORAMENTO

### **Alerts de Custo**
- **Alert:** API cost/usuário > $0.60/mês
- **Action:** Review usage patterns e fair use policy

### **Alerts de Conversão**
- **Alert:** Freemium → Paid < 10%
- **Action:** Otimizar onboarding e paywall

### **Alerts Técnicos**
- **Alert:** Usage tracking failures > 1%
- **Action:** Investigar problemas de billing

---

## 📞 CONTATOS E RESPONSABILIDADES

| Responsabilidade | Responsável | Email |
|------------------|-------------|-------|
| Backend/APIs | [Dev Backend] | [email] |
| Frontend/UI | [Dev Frontend] | [email] |
| Stripe Integration | [Dev Fullstack] | [email] |
| Analytics/KPIs | [Dev Analytics] | [email] |
| QA/Testing | [QA Lead] | [email] |

---

## 🔗 RECURSOS ADICIONAIS

- **Stripe Documentation:** https://stripe.com/docs/billing
- **OpenAI Pricing:** https://openai.com/pricing
- **Figma Designs:** [Link para designs de UI]
- **API Specification:** [Link para documentação da API]

---

**🎯 META FINAL: 97%+ margem de lucro com 15%+ conversão freemium → paid em 30 dias**

---

_Documento aprovado pelo CEO em 4 de Agosto de 2025_