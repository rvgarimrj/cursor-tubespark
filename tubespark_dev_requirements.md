# 🚀 TUBESPARK - REQUISITOS E ARTEFATOS PARA DESENVOLVIMENTO

**Data**: 01 de Agosto de 2025  
**Versão**: 1.0  
**Destinatário**: Desenvolvedor Sênior  
**Objetivo**: Implementar sistema de roteiros e monetização para maximizar receita

---

## 📋 RESUMO EXECUTIVO

Este documento detalha **todos os artefatos, requisitos técnicos e dependências** necessários para implementar as melhorias críticas no TubeSpark. O foco é transformar o produto atual em uma **máquina de conversão** que gere receita recorrente através de roteiros inteligentes.

**Meta de Receita**: $10k-25k MRR em 6 meses  
**Prazo de Implementação**: 6 semanas  
**Prioridade**: 🔥 **CRÍTICA** - Impacto direto na receita

---

## 🎯 OBJETIVOS DE NEGÓCIO

### **Problema Atual**
- Sistema atual gera apenas ideias (sem conversão)
- Não há sistema de monetização efetivo
- Usuários não têm incentivo para upgrade
- Falta tracking de ROI e success stories

### **Solução Proposta**
- **Sistema de Roteiros**: Converter ideias em roteiros profissionais
- **Billing Inteligente**: Monetização baseada em valor entregue
- **Analytics de ROI**: Provar valor através de métricas reais
- **Engagement System**: Aumentar retenção e conversão

### **KPIs de Sucesso**
```typescript
const successKPIs = {
  conversion: {
    ideaToScript: ">30%",      // 30% das ideias viram roteiros
    freeToProRate: ">8%",      // 8% dos users free viram pro
    monthlyChurn: "<5%",       // Churn mensal abaixo de 5%
  },
  revenue: {
    month1: "$500-1500 MRR",
    month3: "$3000-8000 MRR", 
    month6: "$10000-25000 MRR"
  }
}
```

---

## 🏗️ ARQUITETURA TÉCNICA

### **Stack Atual (Manter)**
```typescript
const currentStack = {
  frontend: "Next.js 15 + React 19",
  backend: "Next.js API Routes",
  database: "Supabase (PostgreSQL)",
  auth: "Stack Auth + OAuth YouTube",
  ai: "OpenAI GPT-4o-mini",
  styling: "Tailwind CSS + shadcn/ui",
  deployment: "Vercel"
}
```

### **Novas Dependências (Adicionar)**
```json
{
  "dependencies": {
    "stripe": "^14.0.0",
    "@stripe/stripe-js": "^2.0.0",
    "lucide-react": "^0.263.1",
    "date-fns": "^2.30.0",
    "recharts": "^2.8.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/stripe": "^8.0.0"
  }
}
```

### **Variáveis de Ambiente Necessárias**
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_... # ou sk_test_ para desenvolvimento
STRIPE_PUBLISHABLE_KEY=pk_live_... # ou pk_test_
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (criar no dashboard Stripe)
STRIPE_STARTER_PRICE_ID=price_1234567890
STRIPE_PRO_PRICE_ID=price_0987654321
STRIPE_BUSINESS_PRICE_ID=price_1122334455

# OpenAI (já existente - verificar limites)
OPENAI_API_KEY=sk-... # Verificar se tem créditos suficientes

# YouTube API (já existente)
YOUTUBE_API_KEY=AIza... # Verificar quotas

# App URLs
NEXT_PUBLIC_APP_URL=https://tubespark.com # ou localhost para dev
```

---

## 🗄️ MODIFICAÇÕES NO BANCO DE DADOS

### **Novas Tabelas (Criar via Supabase SQL Editor)**

#### **1. Tabela: video_scripts**
```sql
CREATE TABLE video_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES video_ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  script_type VARCHAR(20) NOT NULL CHECK (script_type IN ('basic', 'premium')),
  content JSONB NOT NULL,
  generation_cost DECIMAL(10,4) DEFAULT 0,
  was_used BOOLEAN DEFAULT false,
  published_video_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes para performance
  INDEX idx_scripts_user (user_id),
  INDEX idx_scripts_idea (idea_id),
  INDEX idx_scripts_type (script_type),
  INDEX idx_scripts_created (created_at DESC)
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_scripts_updated_at BEFORE UPDATE
ON video_scripts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### **2. Tabela: engagement_tracking**
```sql
CREATE TABLE engagement_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES video_ideas(id) ON DELETE CASCADE,
  engagement_type VARCHAR(50) NOT NULL, -- 'favorite', 'share', 'copy', 'time_spent', 'expand'
  engagement_value JSONB, -- Dados específicos do engagement
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_engagement_user_idea (user_id, idea_id),
  INDEX idx_engagement_type (engagement_type),
  INDEX idx_engagement_created (created_at DESC)
);
```

#### **3. Tabela: subscriptions**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id VARCHAR(100) UNIQUE,
  stripe_subscription_id VARCHAR(100) UNIQUE,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('free', 'starter', 'pro', 'business')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'paused', 'trialing')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_subs_user (user_id),
  INDEX idx_subs_status (status),
  INDEX idx_subs_stripe_customer (stripe_customer_id)
);

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE
ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### **4. Tabela: usage_tracking**
```sql
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month_year VARCHAR(7) NOT NULL, -- Format: '2025-08'
  ideas_generated INTEGER DEFAULT 0,
  scripts_basic INTEGER DEFAULT 0,
  scripts_premium INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, month_year),
  
  -- Indexes
  INDEX idx_usage_user_month (user_id, month_year),
  INDEX idx_usage_month (month_year)
);

CREATE TRIGGER update_usage_tracking_updated_at BEFORE UPDATE
ON usage_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### **5. Tabela: plan_limits**
```sql
CREATE TABLE plan_limits (
  plan_type VARCHAR(20) PRIMARY KEY,
  ideas_per_month INTEGER, -- -1 = ilimitado
  scripts_basic_per_month INTEGER,
  scripts_premium_per_month INTEGER,
  api_calls_per_month INTEGER,
  features JSONB, -- Feature flags por plano
  price_monthly DECIMAL(10,2),
  stripe_price_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir dados dos planos
INSERT INTO plan_limits (plan_type, ideas_per_month, scripts_basic_per_month, scripts_premium_per_month, api_calls_per_month, features, price_monthly, stripe_price_id) VALUES
('free', 10, 2, 0, 100, '{"youtube_integration": true, "competitor_analysis": false, "trend_analysis": false, "api_access": false}', 0.00, NULL),
('starter', 100, 20, 5, 1000, '{"youtube_integration": true, "competitor_analysis": false, "trend_analysis": true, "api_access": false}', 9.99, 'price_starter_id_here'),
('pro', -1, -1, 50, 5000, '{"youtube_integration": true, "competitor_analysis": true, "trend_analysis": true, "api_access": false}', 29.99, 'price_pro_id_here'),
('business', -1, -1, -1, 25000, '{"youtube_integration": true, "competitor_analysis": true, "trend_analysis": true, "api_access": true}', 99.99, 'price_business_id_here');

CREATE TRIGGER update_plan_limits_updated_at BEFORE UPDATE
ON plan_limits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Modificações em Tabelas Existentes**

#### **video_ideas (Adicionar colunas)**
```sql
ALTER TABLE video_ideas ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
ALTER TABLE video_ideas ADD COLUMN IF NOT EXISTS published_video_url VARCHAR(500);
ALTER TABLE video_ideas ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;
ALTER TABLE video_ideas ADD COLUMN IF NOT EXISTS estimated_views INTEGER DEFAULT 0;
ALTER TABLE video_ideas ADD COLUMN IF NOT EXISTS estimated_likes INTEGER DEFAULT 0;
ALTER TABLE video_ideas ADD COLUMN IF NOT EXISTS estimated_comments INTEGER DEFAULT 0;

-- Index para performance
CREATE INDEX IF NOT EXISTS idx_video_ideas_status ON video_ideas(status);
CREATE INDEX IF NOT EXISTS idx_video_ideas_published ON video_ideas(published_at DESC) WHERE status = 'published';
```

#### **users (Adicionar colunas se necessário)**
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'pt';
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo';
```

---

## 📁 ESTRUTURA DE ARQUIVOS

### **Novos Arquivos a Criar**

```
src/
├── lib/
│   ├── billing/
│   │   ├── limits.ts                    # Sistema de verificação de limites
│   │   ├── stripe.ts                    # Configuração Stripe
│   │   └── plans.ts                     # Definições de planos
│   ├── engagement/
│   │   ├── tracking.ts                  # Sistema de engagement tracking
│   │   └── analytics.ts                 # Análise de engagement
│   └── scripts/
│       ├── generator.ts                 # Lógica de geração de roteiros
│       ├── prompts.ts                   # Templates de prompts
│       └── types.ts                     # Types para roteiros
│
├── components/
│   ├── billing/
│   │   ├── UpgradePrompt.tsx           # Modal de upgrade
│   │   ├── PlanSelector.tsx            # Seletor de planos
│   │   ├── UsageIndicator.tsx          # Indicador de uso
│   │   └── BillingHistory.tsx          # Histórico de billing
│   ├── scripts/
│   │   ├── ScriptGenerationModal.tsx   # Modal de geração
│   │   ├── ScriptViewer.tsx            # Visualizador de roteiros
│   │   ├── ScriptList.tsx              # Lista de roteiros
│   │   └── ScriptActions.tsx           # Ações do roteiro
│   └── dashboard/
│       ├── ConversionMetrics.tsx       # Métricas de conversão
│       ├── ROITracker.tsx              # Tracking de ROI
│       ├── EngagementStats.tsx         # Stats de engagement
│       └── UsageDashboard.tsx          # Dashboard de uso
│
├── app/api/
│   ├── billing/
│   │   ├── create-checkout/route.ts    # Criar checkout Stripe
│   │   ├── webhooks/route.ts           # Webhooks Stripe
│   │   └── cancel-subscription/route.ts # Cancelar assinatura
│   ├── scripts/
│   │   ├── generate/route.ts           # Gerar roteiro
│   │   ├── list/route.ts               # Listar roteiros
│   │   └── [id]/route.ts               # CRUD roteiro específico
│   ├── engagement/
│   │   ├── track/route.ts              # Track engagement
│   │   └── stats/route.ts              # Stats de engagement
│   └── analytics/
│       ├── roi/route.ts                # Calcular ROI
│       ├── conversion/route.ts         # Métricas de conversão
│       └── usage/route.ts              # Análise de uso
│
├── app/dashboard/
│   ├── scripts/
│   │   ├── page.tsx                    # Lista de roteiros
│   │   └── [id]/page.tsx               # Visualizar roteiro
│   ├── billing/
│   │   └── page.tsx                    # Página de billing
│   └── analytics/
│       └── page.tsx                    # Analytics detalhado
│
└── types/
    ├── billing.ts                      # Types para billing
    ├── scripts.ts                      # Types para roteiros
    ├── engagement.ts                   # Types para engagement
    └── analytics.ts                    # Types para analytics
```

### **Arquivos a Modificar**

```
src/
├── components/dashboard/
│   ├── IdeaCard.tsx                    # ADICIONAR: Botões de engagement
│   └── DashboardLayout.tsx             # ADICIONAR: Usage indicator
├── app/dashboard/
│   └── page.tsx                        # ADICIONAR: Novas métricas
├── lib/
│   └── supabase/                       # VERIFICAR: Schemas atualizados
└── middleware.ts                       # ADICIONAR: Rate limiting
```

---

## 🔧 CONFIGURAÇÕES EXTERNAS NECESSÁRIAS

### **1. Stripe Setup (CRÍTICO)**

#### **Passo 1: Criar Conta Stripe**
1. Acessar [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Criar conta business (não pessoal)
3. Completar verificação de identidade
4. Configurar informações bancárias

#### **Passo 2: Criar Produtos e Preços**
```javascript
// Criar via Stripe Dashboard ou API
const products = [
  {
    name: "TubeSpark Starter",
    description: "100 ideias + 20 roteiros básicos + 5 premium",
    price: 9.99,
    interval: "month",
    features: ["100 ideias/mês", "20 roteiros básicos", "5 roteiros premium"]
  },
  {
    name: "TubeSpark Pro", 
    description: "Ideias ilimitadas + 50 roteiros premium + análise competidores",
    price: 29.99,
    interval: "month",
    features: ["Ideias ilimitadas", "Roteiros básicos ilimitados", "50 roteiros premium"]
  },
  {
    name: "TubeSpark Business",
    description: "Tudo ilimitado + API + White-label",
    price: 99.99,
    interval: "month", 
    features: ["Tudo ilimitado", "Acesso API", "White-label", "Suporte dedicado"]
  }
];
```

#### **Passo 3: Configurar Webhooks**
- URL: `https://tubespark.com/api/billing/webhooks`
- Eventos necessários:
  - `customer.subscription.created`
  - `customer.subscription.updated` 
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### **2. Verificar Limites de APIs**

#### **OpenAI API**
```bash
# Verificar créditos atuais
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Limites recomendados para escala:
# - $100-500/mês para começar  
# - Rate limiting: 60 requests/minute
# - Monitorar custos por roteiro (básico: ~$0.03, premium: ~$0.08)
```

#### **YouTube Data API**
```bash
# Quotas atuais do Google Cloud Console
# - Queries per day: 10,000 (padrão)
# - Queries per 100 seconds: 100
# - Recomendado: Solicitar aumento para 50,000/day
```

### **3. Configurações de Email (Opcional)**
```bash
# Para notifications e onboarding
RESEND_API_KEY=re_... # ou outro provedor
SUPPORT_EMAIL=support@tubespark.com
```

---

## 🎨 ESPECIFICAÇÕES DE UI/UX

### **Design System (Manter Consistência)**
```typescript
const designTokens = {
  colors: {
    primary: "blue-600",      // Manter cor atual
    success: "green-600",     // Para ROI positivo
    warning: "yellow-600",    // Para limites próximos
    danger: "red-600",        // Para erros/limits
    premium: "purple-600",    // Para features premium
  },
  
  animations: {
    modal: "fade-in-up",      // Modais aparecem de baixo
    notification: "slide-in", // Notifications da direita
    loading: "pulse",         // Estados de loading
  },
  
  spacing: {
    section: "space-y-6",     // Entre seções
    card: "p-6",              // Padding dos cards
    modal: "p-8",             // Padding dos modais
  }
}
```

### **Componentes Visuais Críticos**

#### **1. Botões de Engagement**
```tsx
// Especificação visual
const engagementButtons = {
  favorite: {
    icon: "Star",
    color: "yellow-500", 
    activeState: "fill-yellow-400",
    animation: "hover:scale-105"
  },
  share: {
    icon: "Share2",
    color: "blue-500",
    animation: "hover:rotate-12"
  },
  copy: {
    icon: "Copy", 
    color: "gray-500",
    feedback: "Copied!"
  }
}
```

#### **2. Modal de Roteiros**
```tsx
const scriptModal = {
  size: "max-w-4xl",
  sections: ["basic", "premium"],
  visualHierarchy: {
    title: "text-2xl font-bold",
    price: "text-3xl font-bold", 
    features: "text-sm space-y-1",
    cta: "w-full py-3 font-semibold"
  },
  animations: {
    entrance: "fade-in-up",
    planSwitch: "smooth transition-all",
    loading: "button disabled + spinner"
  }
}
```

#### **3. Upgrade Prompts**
```tsx
const upgradePrompts = {
  triggers: {
    ideasLimit: "Você atingiu o limite de ideias! 🚀",
    scriptsLimit: "Limite de roteiros atingido! 🎬", 
    premiumFeature: "Recurso Premium 👑"
  },
  urgency: {
    scarcity: "2 roteiros grátis restantes",
    social: "97% dos users que geram roteiro publicam",
    loss: "Não perca esta ideia viral"
  },
  layout: "grid-cols-3 gap-4", // 3 planos lado a lado
  highlight: "border-2 border-purple-500 shadow-lg" // Plano recomendado
}
```

---

## 📊 ESPECIFICAÇÕES DE DADOS E ANALYTICS

### **Estrutura do Content JSONB (video_scripts)**

#### **Roteiro Básico**
```json
{
  "type": "basic",
  "hook": "Frase de abertura impactante de 1-2 frases",
  "mainPoints": [
    "Ponto principal 1 com call to action implícito",
    "Ponto principal 2 com elemento de curiosidade", 
    "Ponto principal 3 com conclusão forte"
  ],
  "cta": "Call to action convincente e específico",
  "estimatedDuration": "3-5 minutos",
  "generatedAt": "2025-08-01T10:30:00Z",
  "promptVersion": "v1.0"
}
```

#### **Roteiro Premium**
```json
{
  "type": "premium",
  "hook": "Frase de abertura testada e otimizada",
  "alternativeHooks": [
    "Hook alternativo 1 para A/B testing",
    "Hook alternativo 2 mais provocativo",
    "Hook alternativo 3 focado em curiosidade"
  ],
  "introduction": "Parágrafo de introdução que conecta com a audiência",
  "mainContent": {
    "sections": [
      {
        "title": "Seção 1: Problema/Contexto",
        "content": "Conteúdo detalhado com storytelling",
        "timing": "0:30-2:00",
        "visualSuggestions": [
          "B-roll de pessoas frustradas",
          "Gráficos mostrando estatísticas"
        ],
        "engagementTriggers": [
          "Pergunta retórica aos 1:15",
          "Teaser do que vem a seguir aos 1:45"
        ]
      },
      {
        "title": "Seção 2: Solução/Método",
        "content": "Explicação detalhada com exemplos práticos",
        "timing": "2:00-5:30",
        "visualSuggestions": [
          "Demonstração na tela",
          "Before/after comparisons"
        ],
        "engagementTriggers": [
          "CTA para comentar experiências aos 3:00",
          "Mencionar próximo ponto importante aos 5:00"
        ]
      }
    ]
  },
  "transitions": [
    "Transição 1: 'Mas aqui está o que a maioria não sabe...'",
    "Transição 2: 'Agora que você entendeu X, vamos para Y...'"
  ],
  "conclusion": "Conclusão impactante com resumo dos benefícios",
  "cta": "Call to action específico com senso de urgência",
  "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "thumbnailSuggestions": [
    "Ideia 1: Expressão facial curiosa + texto grande",
    "Ideia 2: Before/after visual + arrow",
    "Ideia 3: Número grande + benefit statement"
  ],
  "estimatedDuration": "8-12 minutos",
  "targetAudience": "Descrição específica da audiência",
  "engagementTips": [
    "Usar pausa dramática após hook",
    "Variar tom de voz entre seções",
    "Incluir gesture específico no CTA"
  ],
  "postingRecommendations": {
    "bestTime": "19:00-21:00 (timezone do canal)",
    "bestDay": "Terça ou Quinta-feira",
    "seasonality": "Conteúdo evergreen, bom em qualquer época"
  },
  "performancePrediction": {
    "expectedViews": "15,000-35,000 baseado em histórico similar",
    "expectedEngagement": "4.2% baseado no nicho",
    "confidenceLevel": "Alto (85%)",
    "factors": [
      "Título otimizado para SEO",
      "Hook testado em canais similares",
      "Timing adequado para audiência"
    ]
  },
  "generatedAt": "2025-08-01T10:30:00Z",
  "promptVersion": "v2.1",
  "channelPersonalization": {
    "basedOnTopVideos": ["Video Title 1", "Video Title 2"],
    "audienceInsights": "Audiência engaja mais com conteúdo prático",
    "successPatterns": ["Listas", "Como fazer", "Dicas rápidas"]
  }
}
```

### **Métricas de Tracking**

#### **Engagement Events**
```typescript
type EngagementEvent = {
  type: 'favorite' | 'share' | 'copy' | 'time_spent' | 'expand' | 'click_script';
  value: {
    // Para time_spent
    timeSpent?: number; // em milissegundos
    
    // Para share
    platform?: 'twitter' | 'facebook' | 'whatsapp' | 'copy_link';
    
    // Para copy
    contentType?: 'idea_title' | 'idea_full' | 'script_section';
    
    // Para expand
    section?: 'description' | 'tags' | 'full_content';
    
    // Para click_script  
    scriptType?: 'basic' | 'premium';
    fromLocation?: 'idea_card' | 'dashboard' | 'notification';
  };
  metadata: {
    ideaId: string;
    userId: string;
    timestamp: string;
    sessionId: string;
    userAgent: string;
    referrer?: string;
  };
}
```

#### **Conversion Funnel Tracking**
```typescript
const conversionFunnel = {
  // Estágio 1: Awareness
  landingPageView: { event: 'page_view', page: '/dashboard' },
  
  // Estágio 2: Interest  
  ideaGenerated: { event: 'idea_generated', category: string },
  ideaViewed: { event: 'idea_viewed', timeSpent: number },
  
  // Estágio 3: Consideration
  ideaFavorited: { event: 'idea_favorited', ideaId: string },
  scriptButtonClicked: { event: 'script_button_clicked', scriptType: string },
  
  // Estágio 4: Intent
  scriptModalOpened: { event: 'script_modal_opened', plan: string },
  upgradePromptShown: { event: 'upgrade_prompt_shown', trigger: string },
  
  // Estágio 5: Purchase
  checkoutInitiated: { event: 'checkout_initiated', plan: string },
  paymentCompleted: { event: 'payment_completed', amount: number },
  
  // Estágio 6: Retention
  scriptGenerated: { event: 'script_generated', type: string },
  scriptUsed: { event: 'script_used', videoPublished: boolean },
  
  // Estágio 7: Advocacy
  videoPublished: { event: 'video_published', views: number },
  referralSent: { event: 'referral_sent', method: string }
}
```

---

## 🔐 SEGURANÇA E VALIDAÇÕES

### **Rate Limiting**
```typescript
// Implementar em middleware.ts
const rateLimits = {
  ideaGeneration: "10 per hour per user",
  scriptGeneration: "5 per hour per user", 
  apiCalls: "100 per hour per user",
  
  // Limites por IP para prevenir abuse
  globalIp: "1000 requests per hour",
  
  // Limites especiais para premium users
  premiumMultiplier: 5 // 5x mais limites
}
```

### **Validações de Input**
```typescript
// Schemas Zod para validação
const schemas = {
  scriptGeneration: z.object({
    ideaId: z.string().uuid(),
    scriptType: z.enum(['basic', 'premium']),
    customizations: z.object({
      tone: z.enum(['professional', 'casual', 'energetic']).optional(),
      duration: z.enum(['short', 'medium', 'long']).optional(),
      audience: z.string().max(100).optional()
    }).optional()
  }),
  
  engagementTracking: z.object({
    ideaId: z.string().uuid(),
    engagementType: z.enum(['favorite', 'share', 'copy', 'time_spent']),
    value: z.record(z.any()).optional(),
    metadata: z.object({
      sessionId: z.string(),
      timestamp: z.string().datetime()
    })
  })
}
```

### **Permissões e RBAC**
```typescript
const permissions = {
  free: {
    ideas: { generate: 10, view: "unlimited" },
    scripts: { basic: 2, premium: 0 },
    features: ["youtube_integration"]
  },
  
  starter: {
    ideas: { generate: 100, view: "unlimited" },
    scripts: { basic: 20, premium: 5 },
    features: ["youtube_integration", "trend_analysis"]
  },
  
  pro: {
    ideas: { generate: "unlimited", view: "unlimited" },
    scripts: { basic: "unlimited", premium: 50 },
    features: ["youtube_integration", "trend_analysis", "competitor_analysis"]
  },
  
  business: {
    ideas: { generate: "unlimited", view: "unlimited" },
    scripts: { basic: "unlimited", premium: "unlimited" },
    features: ["all", "api_access", "white_label", "multi_user"]
  }
}
```

### **Middleware de Autenticação**
```typescript
// src/middleware.ts - Adicionar verificações
export async function middleware(request: NextRequest) {
  // Verificações existentes...
  
  // Rate limiting para APIs críticas
  if (request.nextUrl.pathname.startsWith('/api/scripts/generate')) {
    const rateLimitResult = await checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return new Response('Rate limit exceeded', { status: 429 });
    }
  }
  
  // Verificação de plano para features premium
  if (request.nextUrl.pathname.startsWith('/api/analytics/advanced')) {
    const planCheck = await checkPlanAccess(request, ['pro', 'business']);
    if (!planCheck.allowed) {
      return new Response('Premium feature', { status: 403 });
    }
  }
}
```

---

## 🧪 TESTES E QUALIDADE

### **Testes Unitários (Implementar)**
```typescript
// __tests__/billing/limits.test.ts
describe('Billing Limits', () => {
  test('should block free user after 10 ideas', async () => {
    const result = await checkUserLimits('user_id', 'idea');
    expect(result.allowed).toBe(false);
    expect(result.upgradeRequired).toBe(true);
  });
  
  test('should allow premium user unlimited scripts', async () => {
    const result = await checkUserLimits('premium_user_id', 'script_premium');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(-1); // unlimited
  });
});

// __tests__/scripts/generation.test.ts
describe('Script Generation', () => {
  test('should generate basic script under 30 seconds', async () => {
    const startTime = Date.now();
    const script = await generateScript(mockIdea, 'basic');
    const duration = Date.now() - startTime;
    
    expect(script).toHaveProperty('hook');
    expect(script).toHaveProperty('mainPoints');
    expect(duration).toBeLessThan(30000);
  });
});
```

### **Testes de Integração**
```typescript
// __tests__/integration/stripe.test.ts
describe('Stripe Integration', () => {
  test('should create checkout session', async () => {
    const response = await request(app)
      .post('/api/billing/create-checkout')
      .send({ planType: 'pro' })
      .expect(200);
      
    expect(response.body).toHaveProperty('checkoutUrl');
    expect(response.body.checkoutUrl).toContain('checkout.stripe.com');
  });
});
```

### **Testes de Performance**
```typescript
// __tests__/performance/load.test.ts
describe('Performance Tests', () => {
  test('idea generation should handle 100 concurrent requests', async () => {
    const promises = Array(100).fill(null).map(() => 
      generateIdea({ category: 'gaming', keywords: ['minecraft'] })
    );
    
    const results = await Promise.all(promises);
    expect(results).toHaveLength(100);
    expect(results.every(r => r.success)).toBe(true);
  });
});
```

---

## 📈 MONITORAMENTO E OBSERVABILIDADE

### **Métricas de Negócio (Implementar)**
```typescript
// src/lib/analytics/metrics.ts
const businessMetrics = {
  // Conversion Funnel
  conversionRate: {
    visitToSignup: "Track page views -> registrations",
    signupToFirstIdea: "Track registrations -> first idea generated", 
    ideaToScript: "Track ideas generated -> scripts requested",
    freeToProConversion: "Track free users -> paid subscriptions"
  },
  
  // Revenue Metrics
  revenue: {
    mrr: "Monthly Recurring Revenue",
    arr: "Annual Recurring Revenue", 
    ltv: "Customer Lifetime Value",
    cac: "Customer Acquisition Cost",
    churnRate: "Monthly churn percentage"
  },
  
  // Product Metrics
  engagement: {
    ideasPerUser: "Average ideas generated per user",
    scriptsPerUser: "Average scripts generated per user",
    timeToFirstScript: "Time from signup to first script",
    sessionDuration: "Average session length"
  }
}
```

### **Error Tracking**
```typescript
// src/lib/monitoring/errors.ts
const errorCategories = {
  // API Errors
  openaiTimeout: { severity: 'high', alert: true },
  stripeWebhookFailed: { severity: 'critical', alert: true },
  databaseConnectionLost: { severity: 'critical', alert: true },
  
  // Business Logic Errors  
  scriptGenerationFailed: { severity: 'medium', alert: false },
  usageLimitCalculationError: { severity: 'medium', alert: true },
  
  // User Experience Errors
  checkoutAbandoned: { severity: 'low', alert: false },
  longLoadTimes: { severity: 'medium', alert: false }
}
```

### **Logging Strategy**
```typescript
// src/lib/logging/logger.ts
const logLevels = {
  error: {
    uses: ["Failed payments", "API errors", "Database errors"],
    retention: "30 days",
    alerts: true
  },
  warn: {
    uses: ["Rate limits hit", "Usage approaching limits", "Slow responses"],
    retention: "7 days", 
    alerts: false
  },
  info: {
    uses: ["User actions", "Successful payments", "Feature usage"],
    retention: "7 days",
    alerts: false
  },
  debug: {
    uses: ["Development debugging", "Performance metrics"],
    retention: "1 day",
    alerts: false
  }
}
```

---

## 🚀 DEPLOYMENT E INFRAESTRUTURA

### **Variáveis de Ambiente por Ambiente**

#### **Development (.env.local)**
```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# OpenAI
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### **Production (.env.production)**
```bash
# Database (Supabase Production)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Stripe (Live Mode)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI (Production limits)
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=https://tubespark.com
NODE_ENV=production

# Monitoring
SENTRY_DSN=https://...
LOGTAIL_SOURCE_TOKEN=...
```

### **Vercel Deployment Configuration**
```json
// vercel.json
{
  "functions": {
    "app/api/scripts/generate/route.ts": {
      "maxDuration": 30
    },
    "app/api/billing/webhooks/route.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://tubespark.com"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/upgrade",
      "destination": "/dashboard?tab=billing",
      "permanent": false
    }
  ]
}
```

### **Database Migration Strategy**
```bash
# Migrations em ordem (executar via Supabase SQL Editor)
1. create_video_scripts_table.sql
2. create_engagement_tracking_table.sql  
3. create_subscriptions_table.sql
4. create_usage_tracking_table.sql
5. create_plan_limits_table.sql
6. alter_video_ideas_add_status.sql
7. create_indexes_performance.sql
8. insert_initial_plan_data.sql

# Rollback strategy
rollback_1_drop_new_tables.sql
rollback_2_restore_video_ideas.sql
```

---

## ⚡ PERFORMANCE E OTIMIZAÇÕES

### **Caching Strategy**
```typescript
// src/lib/cache/strategy.ts
const cacheConfig = {
  // Static data (rarely changes)
  planLimits: { ttl: '1 hour', revalidate: 'background' },
  userSubscription: { ttl: '10 minutes', revalidate: 'on-demand' },
  
  // Dynamic data (changes frequently)
  usageTracking: { ttl: '1 minute', revalidate: 'on-write' },
  engagementStats: { ttl: '5 minutes', revalidate: 'background' },
  
  // Expensive operations
  scriptGeneration: { ttl: '24 hours', key: 'idea_id + script_type' },
  youtubeAnalytics: { ttl: '6 hours', key: 'channel_id + date' }
}
```

### **Database Optimizations**
```sql
-- Indexes críticos para performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_video_scripts_user_created 
ON video_scripts(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_engagement_user_type_created 
ON engagement_tracking(user_id, engagement_type, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_tracking_lookup 
ON usage_tracking(user_id, month_year) 
INCLUDE (ideas_generated, scripts_basic, scripts_premium);

-- Partial indexes para dados ativos
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_active_subscriptions 
ON subscriptions(user_id) WHERE status = 'active';

-- Composite indexes para queries complexas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ideas_published_performance 
ON video_ideas(user_id, status, published_at DESC) 
WHERE status = 'published';
```

### **API Response Optimization**
```typescript
// src/lib/api/optimization.ts
const responseOptimization = {
  // Pagination para listas grandes
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Campos selecionados por endpoint
  ideaListFields: ['id', 'title', 'category', 'created_at', 'status'],
  scriptListFields: ['id', 'idea_id', 'script_type', 'created_at', 'was_used'],
  
  // Compression para responses grandes
  enableGzip: true,
  minCompressionSize: 1024,
  
  // Response caching headers
  staticDataMaxAge: 3600, // 1 hour
  dynamicDataMaxAge: 300  // 5 minutes
}
```

---

## 🎯 CHECKLIST DE ACEITAÇÃO

### **✅ Funcionalidades Core**

#### **Sistema de Engagement**
- [ ] Botões de favoritar, compartilhar, copiar implementados
- [ ] Tracking de tempo na ideia funcionando
- [ ] API de engagement salvando dados corretamente
- [ ] Métricas de engagement aparecendo no dashboard
- [ ] Botão "Criar Roteiro" aparece após engagement

#### **Sistema de Roteiros**
- [ ] Modal de geração com opções básico/premium
- [ ] Integração OpenAI gerando roteiros válidos
- [ ] Roteiros salvos no banco com estrutura correta
- [ ] Visualização de roteiros criada e funcional
- [ ] Sistema de custo por roteiro implementado

#### **Sistema de Billing**
- [ ] Integração Stripe configurada e testada
- [ ] Checkout sessions sendo criadas corretamente
- [ ] Webhooks processando eventos do Stripe
- [ ] Sistema de limites bloqueando usuários free
- [ ] Upgrade prompts aparecendo nos momentos certos

#### **Analytics e ROI**
- [ ] Tracking de vídeos publicados
- [ ] Cálculo de ROI baseado em visualizações
- [ ] Dashboard mostrando métricas de conversão
- [ ] Success stories sendo coletadas
- [ ] Insights automáticos sendo gerados

### **✅ Qualidade e Performance**

#### **Testes**
- [ ] Testes unitários para lógica de billing
- [ ] Testes de integração para APIs críticas  
- [ ] Testes de performance para geração de roteiros
- [ ] Testes E2E para fluxo de conversão completo

#### **Segurança**
- [ ] Rate limiting implementado e funcionando
- [ ] Validação de input com Zod em todas APIs
- [ ] Permissões por plano verificadas
- [ ] Logs de segurança implementados

#### **Performance**
- [ ] Tempos de resposta < 2s para geração de ideias
- [ ] Tempos de resposta < 30s para geração de roteiros
- [ ] Caching implementado para dados estáticos
- [ ] Indexes de banco otimizados

### **✅ Deployment e Monitoramento**

#### **Infraestrutura**
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations do banco executadas
- [ ] Vercel deployment configurado
- [ ] Domínio personalizado configurado

#### **Monitoramento**
- [ ] Error tracking implementado
- [ ] Métricas de negócio sendo coletadas
- [ ] Alerts configurados para falhas críticas
- [ ] Dashboard de monitoramento acessível

---

## 📞 SUPORTE E COMUNICAÇÃO

### **Canais de Comunicação**
```typescript
const communicationChannels = {
  urgent: {
    method: "WhatsApp/Telegram",
    response: "< 2 horas",
    uses: ["Production down", "Critical bugs", "Security issues"]
  },
  
  normal: {
    method: "Email/Slack", 
    response: "< 24 horas",
    uses: ["Feature questions", "Implementation details", "Code reviews"]
  },
  
  async: {
    method: "GitHub Issues/Comments",
    response: "< 48 horas", 
    uses: ["Documentation", "Future features", "Optimizations"]
  }
}
```

### **Reporting e Updates**
```typescript
const reportingSchedule = {
  daily: {
    time: "18:00 BRT",
    format: "Quick update via WhatsApp",
    content: ["Progress made", "Blockers found", "Next day plan"]
  },
  
  weekly: {
    time: "Friday 17:00 BRT",
    format: "Detailed email report", 
    content: ["Week accomplishments", "Metrics achieved", "Next week goals"]
  },
  
  milestones: {
    trigger: "Major feature completed",
    format: "Demo call + documentation",
    content: ["Feature walkthrough", "Testing results", "Next steps"]
  }
}
```

### **Definition of Done**
```typescript
const definitionOfDone = {
  feature: [
    "✅ Code implemented and tested",
    "✅ Database migrations applied", 
    "✅ UI/UX reviewed and approved",
    "✅ Performance benchmarks met",
    "✅ Documentation updated",
    "✅ Deployed to staging and tested",
    "✅ Security review completed",
    "✅ Monitoring and alerts configured"
  ],
  
  release: [
    "✅ All features tested in staging",
    "✅ Performance tests passed",
    "✅ Security audit completed",
    "✅ Backup procedures verified", 
    "✅ Rollback plan documented",
    "✅ Team trained on new features",
    "✅ Customer communication prepared",
    "✅ Monitoring dashboards updated"
  ]
}
```

---

## 🏆 CRITÉRIOS DE SUCESSO

### **Métricas Técnicas**
```typescript
const technicalSuccess = {
  performance: {
    apiResponseTime: "< 2s for 95% of requests",
    scriptGeneration: "< 30s average",
    pageLoadTime: "< 3s for dashboard",
    uptime: "> 99.5%"
  },
  
  scalability: {
    concurrentUsers: "Handle 1000+ concurrent users",
    dailyRequests: "Process 50k+ API requests/day", 
    dataGrowth: "Handle 1M+ records efficiently"
  },
  
  reliability: {
    errorRate: "< 1% for critical flows",
    paymentSuccess: "> 99% success rate",
    dataIntegrity: "Zero data loss incidents"
  }
}
```

### **Métricas de Negócio**
```typescript
const businessSuccess = {
  month1: {
    revenue: "$500-1500 MRR",
    users: "200+ active users",
    conversion: "5%+ free to paid",
    engagement: "30%+ idea to script conversion"
  },
  
  month3: {
    revenue: "$3000-8000 MRR", 
    users: "1000+ active users",
    conversion: "8%+ free to paid",
    churn: "< 5% monthly churn"
  },
  
  month6: {
    revenue: "$10000-25000 MRR",
    users: "5000+ active users", 
    conversion: "12%+ free to paid",
    ltv: "$180+ customer LTV"
  }
}
```

### **Indicadores de Qualidade**
```typescript
const qualityIndicators = {
  userSatisfaction: {
    nps: "> 50 (Net Promoter Score)",
    supportTickets: "< 5% of active users",
    featureAdoption: "70%+ users try new features"
  },
  
  technicalDebt: {
    codeQuality: "SonarQube score > 8.0",
    testCoverage: "> 80% for critical paths",
    documentation: "All APIs documented",
    securityVulns: "Zero high/critical vulnerabilities"
  }
}
```

---

## 📋 PRÓXIMOS PASSOS IMEDIATOS

### **Hoje (Dia 1)**
1. **Configurar ambiente**
   - [ ] Clonar repositório atual
   - [ ] Instalar novas dependências
   - [ ] Configurar variáveis de ambiente development

2. **Setup Stripe (2 horas)**
   - [ ] Criar conta Stripe (se não existir)
   - [ ] Criar produtos e preços
   - [ ] Copiar keys para .env

3. **Primeira implementação (4 horas)**
   - [ ] Adicionar botões de engagement no IdeaCard
   - [ ] Criar sistema básico de tracking
   - [ ] Testar funcionamento

### **Semana 1 (Dias 2-7)**
1. **Sistema de engagement completo**
   - [ ] APIs de tracking implementadas
   - [ ] Métricas no dashboard
   - [ ] Testes básicos

2. **Preparação para roteiros**
   - [ ] Schema do banco criado
   - [ ] Modal básico implementado
   - [ ] Integração OpenAI testada

### **Semana 2 (Dias 8-14)**
1. **Sistema de roteiros funcional**
   - [ ] Geração básica e premium
   - [ ] Visualização de roteiros
   - [ ] Sistema de custos

2. **Billing MVP**
   - [ ] Checkout Stripe funcionando
   - [ ] Sistema de limites básico
   - [ ] Upgrade prompts

### **Validação Intermediária (Dia 14)**
- [ ] Demo para CEO
- [ ] Teste com 5 usuários beta
- [ ] Ajustes baseados em feedback
- [ ] Go/No-go para segunda metade

---

## 💡 DICAS DE IMPLEMENTAÇÃO

### **Ordem de Prioridade (CRÍTICA)**
1. **PRIMEIRO**: Engagement tracking (base para tudo)
2. **SEGUNDO**: Roteiros básicos (core value)
3. **TERCEIRO**: Billing system (monetização)
4. **QUARTO**: Analytics (otimização)

### **Pontos de Atenção**
```typescript
const criticalPoints = {
  openaiCosts: "Monitor spending - pode explodir rapidamente",
  stripeWebhooks: "CRUCIAL - testar exaustivamente",
  userExperience: "Cada friction reduz conversão em 20%+",
  dataConsistency: "Billing inconsistente = perda de receita",
  performance: "Scripts lentos = alta taxa de abandono"
}
```

### **Quick Wins para Demonstrar Valor**
```typescript
const quickWins = [
  "Botão favoritar → Dopamine hit imediato",
  "Contador de uso → Cria urgência para upgrade", 
  "Roteiro básico grátis → Prova valor da IA",
  "Upgrade prompt bem posicionado → Conversão alta",
  "Success stories → Social proof poderoso"
]
```

---

**Status**: 🚀 **DOCUMENTO COMPLETO E PRONTO PARA IMPLEMENTAÇÃO**  
**Próxima Ação**: Repassar para desenvolvedor sênior e iniciar Dia 1  
**Expectativa**: Primeiro upgrade pago em 14 dias! 💰

*Este documento contém TODOS os requisitos técnicos, especificações, código de exemplo e diretrizes necessárias para implementar com sucesso o sistema de roteiros e monetização do TubeSpark.*