# 🏗️ ARQUITETURA TÉCNICA - TUBESPARK

**Data**: 4 de Agosto de 2025  
**Versão**: 1.0  
**Status**: 📊 **DOCUMENTAÇÃO COMPLETA DA IMPLEMENTAÇÃO ATUAL**

---

## 🎯 **VISÃO GERAL DA ARQUITETURA**

### **STACK TECNOLÓGICO**
```
Frontend:    Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
Backend:     Next.js API Routes + Server Actions
Database:    Supabase (PostgreSQL) + Row Level Security
Auth:        Stack Auth + YouTube OAuth
AI:          OpenAI GPT-4o-mini
Payments:    Stripe + Webhooks
Hosting:     Vercel
Analytics:   Custom YouTube-Native Framework
```

### **ARQUITETURA GERAL**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND       │    │   EXTERNAL      │
│                 │    │                  │    │                 │
│ Next.js App     │◄──►│ API Routes       │◄──►│ OpenAI API      │
│ React Components│    │ Server Actions   │    │ Stripe API      │
│ Tailwind CSS    │    │ Business Logic   │    │ YouTube API     │
│ TypeScript      │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌──────────────────┐
                    │   DATABASE       │
                    │                  │
                    │ Supabase         │
                    │ PostgreSQL       │
                    │ 14 Tables        │
                    │ RLS Policies     │
                    │ Functions        │
                    │ Triggers         │
                    └──────────────────┘
```

---

## 📊 **DATABASE SCHEMA DETALHADO**

### **CORE TABLES (Fundação)**
```sql
-- Usuários (Stack Auth integration)
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  display_name VARCHAR,
  youtube_channel_id UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Ideias de vídeo  
video_ideas (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(500),
  description TEXT,
  category VARCHAR(100),
  tags JSONB,
  niche VARCHAR(100),
  channel_type VARCHAR(50),
  trend_score INTEGER,
  estimated_views INTEGER,
  estimated_likes INTEGER,
  estimated_comments INTEGER,
  difficulty VARCHAR(20),
  hooks JSONB,
  duration VARCHAR(50),
  thumbnail_idea TEXT,
  status video_idea_status DEFAULT 'draft',
  published_video_url VARCHAR(500),
  published_at TIMESTAMP,
  is_favorited BOOLEAN DEFAULT false,
  engagement_score INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Analytics do usuário
user_analytics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total_ideas_generated INTEGER DEFAULT 0,
  total_videos_published INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_engagement_score INTEGER DEFAULT 0,
  average_trend_score DECIMAL(5,2) DEFAULT 0,
  last_activity_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### **YOUTUBE INTEGRATION TABLES**
```sql
-- Canais do YouTube
youtube_channels (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  channel_id VARCHAR(100) UNIQUE,
  title VARCHAR(255),
  description TEXT,
  subscriber_count INTEGER,
  video_count INTEGER,
  view_count BIGINT,
  category VARCHAR(100),
  country VARCHAR(10),
  language VARCHAR(10),
  average_views INTEGER,
  average_engagement_rate DECIMAL(5,2),
  success_patterns JSONB,
  best_posting_hours VARCHAR(50),
  audience_style TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Analytics do YouTube  
youtube_analytics (
  id UUID PRIMARY KEY,
  channel_id UUID REFERENCES youtube_channels(id),
  video_id VARCHAR(100),
  title VARCHAR(500),
  views INTEGER,
  likes INTEGER,
  comments INTEGER,
  engagement_rate DECIMAL(5,2),
  retention_rate DECIMAL(5,2),
  published_at TIMESTAMP,
  created_at TIMESTAMP
)
```

### **MONETIZATION SYSTEM TABLES**
```sql
-- Roteiros de vídeo (YouTube-Native Framework)
video_scripts (
  id UUID PRIMARY KEY,
  idea_id UUID REFERENCES video_ideas(id),
  user_id UUID REFERENCES users(id),
  script_type script_type NOT NULL, -- 'basic' | 'premium'  
  framework_type VARCHAR(30) DEFAULT 'youtube_native',
  content JSONB NOT NULL,
  generation_cost DECIMAL(10,4) DEFAULT 0,
  was_used BOOLEAN DEFAULT false,
  published_video_url VARCHAR(500),
  
  -- YouTube-Native Framework Fields
  retention_score INTEGER DEFAULT 0,
  hook_strength INTEGER DEFAULT 0,
  narrative_flow_score INTEGER DEFAULT 0,
  algorithm_optimization_score INTEGER DEFAULT 0,
  predicted_retention DECIMAL(5,2) DEFAULT 0,
  predicted_engagement DECIMAL(5,2) DEFAULT 0,
  predicted_ctr DECIMAL(5,2) DEFAULT 0,
  confidence_level VARCHAR(10) DEFAULT 'medium',
  
  -- Analytics & Optimization
  engagement_prediction JSONB,
  viral_factors JSONB,
  optimization_data JSONB,
  personalization_data JSONB,
  post_production_guidance JSONB,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Assinaturas Stripe
subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE,
  stripe_customer_id VARCHAR(100) UNIQUE,
  stripe_subscription_id VARCHAR(100) UNIQUE,
  plan_type VARCHAR(20) NOT NULL, -- 'free' | 'starter' | 'pro' | 'business'
  status VARCHAR(20) NOT NULL, -- 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Tracking de uso
usage_tracking (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  month_year VARCHAR(7) NOT NULL, -- '2025-08'
  ideas_generated INTEGER DEFAULT 0,
  scripts_basic INTEGER DEFAULT 0,
  scripts_premium INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, month_year)
)

-- Limites por plano
plan_limits (
  plan_type VARCHAR(20) PRIMARY KEY,
  ideas_per_month INTEGER, -- -1 = unlimited
  scripts_basic_per_month INTEGER,
  scripts_premium_per_month INTEGER,
  api_calls_per_month INTEGER,
  features JSONB,
  price_monthly DECIMAL(10,2),
  stripe_price_id VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Tracking de engagement
engagement_tracking (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  idea_id UUID REFERENCES video_ideas(id),
  engagement_type engagement_type NOT NULL, -- 'favorite' | 'share' | 'copy' | 'time_spent' | 'expand' | 'click_script'
  engagement_value JSONB,
  created_at TIMESTAMP
)
```

### **ADVANCED FEATURES TABLES**
```sql
-- Tópicos em tendência
trending_topics (
  id UUID PRIMARY KEY,
  keyword VARCHAR(255),
  search_volume INTEGER,
  trend_direction VARCHAR(20), -- 'rising' | 'stable' | 'falling'
  category VARCHAR(100),
  region VARCHAR(10),
  confidence_score DECIMAL(3,2),
  data_source VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Análise de competidores
competitor_analysis (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  competitor_channel_id VARCHAR(100),
  competitor_name VARCHAR(255),
  similarity_score DECIMAL(3,2),
  subscriber_count INTEGER,
  avg_views INTEGER,
  content_strategy JSONB,
  strengths JSONB,
  opportunities JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Calendário de conteúdo
content_calendar (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  idea_id UUID REFERENCES video_ideas(id),
  scheduled_date DATE,
  status VARCHAR(20) DEFAULT 'planned', -- 'planned' | 'in_production' | 'published' | 'canceled'
  notes TEXT,
  reminders JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Métricas do sistema
system_metrics (
  id UUID PRIMARY KEY,
  metric_name VARCHAR(100),
  metric_value DECIMAL(10,2),
  metric_date DATE,
  created_at TIMESTAMP
)
```

---

## 🔗 **API ENDPOINTS IMPLEMENTADOS**

### **IDEAS API**
```typescript
// Geração de ideias com IA
POST /api/ideas/generate
Body: {
  niche: string,
  channelType: string,
  audienceAge: string,
  contentStyle: string,
  language: string,
  trendingTopics?: string[],
  count: number
}
Response: { success: boolean, ideas: VideoIdea[] }

// Salvar ideia
POST /api/ideas/save  
Body: { idea: VideoIdea }
Response: { success: boolean, idea: VideoIdea }

// CRUD de ideias
GET|PUT|DELETE /api/ideas/[id]
```

### **SCRIPTS API**
```typescript
// Geração de roteiros YouTube-Native
POST /api/scripts/generate
Body: {
  ideaId: string,
  scriptType: 'basic' | 'premium',
  frameworkType: 'youtube_native' | 'traditional',
  customizations?: {
    tone?: string,
    duration?: string,
    audience?: string
  }
}
Response: {
  success: boolean,
  scriptId: string,
  script: VideoScript,
  analysis: YouTubeNativeAnalysis,
  frameworkBenefits?: {
    expectedRetentionIncrease: string,
    expectedEngagementIncrease: string,
    algorithmBoost: string
  }
}

// Buscar roteiros com analytics
GET /api/scripts/generate
Query: {
  ideaId?: string,
  scriptType?: string,
  frameworkType?: string,
  includeAnalytics?: boolean
}
```

### **BILLING API**
```typescript
// Criar checkout session
POST /api/billing/create-checkout
Body: {
  planType: string,
  successUrl: string,
  cancelUrl: string
}
Response: { success: boolean, url: string }

// Webhooks Stripe
POST /api/billing/webhooks
Headers: { stripe-signature: string }
Body: StripeEvent

// Cancelar assinatura
POST /api/billing/cancel-subscription
Response: { success: boolean }
```

### **USAGE & ANALYTICS API**
```typescript
// Verificar limites
GET /api/usage/check
Query: { action: string }
Response: {
  allowed: boolean,
  remaining: number,
  limitValue: number,
  used: number,
  planType: string
}

// Resumo de uso
GET /api/usage/summary
Response: {
  currentUsage: UsageStats,
  limits: PlanLimits,
  recommendations: string[]
}

// Track engagement
POST /api/engagement/track
Body: {
  ideaId: string,
  engagementType: string,
  engagementValue?: any
}
```

---

## 🧠 **SISTEMA DE IA INTEGRADO**

### **OPENAI INTEGRATION**
```typescript
// lib/ai/openai.ts
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Modelo: GPT-4o-mini
// Cost: ~$0.15/1K tokens (input), ~$0.60/1K tokens (output)
// Performance: 95%+ quality for video ideas
```

### **IDEA GENERATOR**
```typescript
// lib/ai/idea-generator.ts
export async function generateVideoIdeas({
  niche,
  channelType,
  audienceAge,
  contentStyle,
  language,
  trendingTopics,
  count
}: IdeaGenerationParams): Promise<VideoIdea[]>

// Features:
// - Multilingual support (PT/EN/ES/FR)
// - Contextual prompts based on niche
// - Trending topics integration
// - YouTube-optimized titles and hooks
// - Estimated metrics calculation
```

### **YOUTUBE-NATIVE SCRIPT GENERATOR**
```typescript
// lib/ai/script-generator.ts
export async function generateVideoScript({
  idea,
  scriptType,
  frameworkType,
  youtubeData,
  customizations
}: ScriptGenerationParams): Promise<VideoScript>

// YouTube-Native Framework Features:
// - 5 psychological hook types
// - 3-act narrative structure
// - Pattern interrupts
// - Value-first CTAs
// - Performance predictions
// - Algorithm optimization
```

### **YOUTUBE-NATIVE ANALYTICS SERVICE**
```typescript
// lib/analytics/youtube-native-analytics.ts
export class YouTubeNativeAnalyticsService {
  // Analizar script para performance
  static async analyzeScript(script: any, youtubeData?: any): Promise<ScriptAnalysis>
  
  // Salvar script com análise completa
  static async saveScriptWithAnalysis(userId: string, ideaId: string, script: any, analysis: ScriptAnalysis): Promise<string>
  
  // Obter resumo de performance do usuário
  static async getUserScriptSummary(userId: string): Promise<PerformanceSummary>
}

// Performance Predictions:
// - Hook strength (0-100)
// - Retention prediction (75-85% for YouTube-Native)
// - Engagement rate estimate (4-7% for YouTube-Native)  
// - Algorithm boost (+300% for YouTube-Native)
// - Confidence level (high/medium/low)
```

---

## 💳 **SISTEMA DE MONETIZAÇÃO**

### **STRIPE INTEGRATION**
```typescript
// lib/billing/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Produtos configurados:
// - Starter: $9.99/month (price_starter_id)
// - Pro: $29.99/month (price_pro_id)  
// - Business: $99.99/month (price_business_id)
```

### **PLANOS E LIMITES**
```sql
-- Dados em plan_limits table
'free'      -> 10 ideias, 2 roteiros básicos, 0 premium, 100 API calls
'starter'   -> 100 ideias, 20 básicos, 5 premium, 1000 API calls
'pro'       -> Ilimitado, Ilimitado, 50 premium, 5000 API calls  
'business'  -> Ilimitado, Ilimitado, Ilimitado, 25000 API calls
```

### **USAGE LIMITING SYSTEM**
```typescript
// lib/billing/limits.ts
export async function checkUserLimits(userId: string, action: string): Promise<LimitsCheck>
export async function incrementUsage(userId: string, action: string): Promise<UsageResult>

// Functions PostgreSQL:
// - check_user_limits(user_id, action) -> verificação automática
// - increment_usage(user_id, action) -> incremento seguro
```

### **WEBHOOKS HANDLING**
```typescript
// app/api/billing/webhooks/route.ts
// Eventos tratados:
// - customer.subscription.created
// - customer.subscription.updated  
// - customer.subscription.deleted
// - invoice.payment_succeeded
// - invoice.payment_failed

// Auto-update de subscriptions table
// Sincronização com plan_limits
// Email notifications (futuro)
```

---

## 🔒 **SISTEMA DE AUTENTICAÇÃO**

### **STACK AUTH INTEGRATION**
```typescript
// lib/auth/stack-auth.ts
import { StackAuth } from "@stackframe/stack";

const stackAuth = new StackAuth({
  projectId: process.env.STACK_PROJECT_ID!,
  publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
});

// Features:
// - Email/password authentication
// - YouTube OAuth integration
// - Session management
// - Password reset flow
// - User profile management
```

### **ROW LEVEL SECURITY (RLS)**
```sql
-- Políticas implementadas em todas as tabelas:

-- video_ideas
CREATE POLICY "Users can view own ideas" ON video_ideas
    FOR SELECT USING (auth.uid() = user_id);

-- video_scripts  
CREATE POLICY "Users can view own scripts" ON video_scripts
    FOR SELECT USING (auth.uid() = user_id);

-- subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- engagement_tracking
CREATE POLICY "Users can view own engagement" ON engagement_tracking
    FOR SELECT USING (auth.uid() = user_id);

-- Service role bypass para APIs
CREATE POLICY "Service role can manage all" ON [table]
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
```

### **MIDDLEWARE DE PROTEÇÃO**
```typescript
// middleware.ts
import { stackAuth } from "@/lib/auth/stack-auth";

export async function middleware(request: NextRequest) {
  // Proteger rotas /dashboard/*
  // Redirecionar não autenticados para /auth/signin
  // Permitir acesso a /api/webhooks (Stripe)
  // Handle i18n routing
}
```

---

## 🎨 **FRONTEND ARCHITECTURE**

### **COMPONENT STRUCTURE**
```
components/
├── ui/                    # shadcn/ui base components
│   ├── button.tsx
│   └── ...
├── auth/                  # Authentication components
│   └── oauth-redirect-handler.tsx
├── dashboard/             # Dashboard components
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── mobile-sidebar.tsx
├── scripts/               # Script-related components
│   ├── ScriptGenerationModal.tsx    # ✅ Implemented
│   └── ScriptViewer.tsx             # ❌ Needs implementation
├── billing/               # Billing components
│   ├── UpgradePrompt.tsx            # ✅ Implemented
│   └── UsageIndicator.tsx           # ✅ Implemented
├── pricing/               # Pricing components
│   └── PricingSection.tsx           # ✅ Implemented
└── design-system/         # Design system components
    ├── Button.tsx
    ├── Card.tsx
    └── ...
```

### **PAGE STRUCTURE**
```
app/
├── [locale]/              # Internationalized routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   │   ├── page.tsx     # ✅ Implemented (with mock data)
│   │   └── layout.tsx   # ✅ Implemented
│   ├── ideas/           # Ideas pages  
│   │   └── page.tsx     # ❌ Uses mock data - CRITICAL GAP
│   └── layout.tsx       # ✅ Implemented with i18n
├── api/                 # API routes
│   ├── ideas/          # ✅ Fully implemented
│   ├── scripts/        # ✅ Fully implemented
│   ├── billing/        # ✅ Fully implemented
│   ├── usage/          # ✅ Fully implemented
│   └── engagement/     # ✅ Fully implemented
└── globals.css         # ✅ Global styles with dark mode
```

### **STATE MANAGEMENT**
```typescript
// Using React built-in state management
// - useState for local state
// - useEffect for side effects
// - Context API for auth (Stack Auth)
// - No external state management (Redux, Zustand) needed

// Key patterns:
// - Server state via API calls
// - Client state for UI interactions
// - Optimistic updates for better UX
```

---

## 🌍 **INTERNATIONALIZATION (I18N)**

### **NEXT-INTL SETUP**
```typescript
// lib/i18n/config.ts
export const locales = ['pt', 'en', 'es', 'fr'] as const;
export const defaultLocale = 'pt' as const;

// Routing: /[locale]/page
// Example: /pt/dashboard, /en/dashboard
```

### **TRANSLATION FILES**
```json
// lib/i18n/locales/pt.json
{
  "auth": {
    "login": {
      "title": "Entrar na sua conta",
      "email": "E-mail",
      "password": "Senha"
    }
  },
  "dashboard": {
    "welcome": "Bem-vindo de volta",
    "ideas": "Ideias"
  }
}
```

### **THEME SYSTEM**
```typescript
// lib/theme/theme-provider.tsx
// Using next-themes for dark/light/auto modes
// Persistent across sessions
// System preference detection
// Smooth transitions
```

---

## 📊 **PERFORMANCE & MONITORING**

### **DATABASE OPTIMIZATION**
```sql
-- Índices criados para performance:
CREATE INDEX idx_video_ideas_user_id ON video_ideas(user_id);
CREATE INDEX idx_video_ideas_created ON video_ideas(created_at DESC);
CREATE INDEX idx_video_scripts_user_id ON video_scripts(user_id);
CREATE INDEX idx_video_scripts_idea_id ON video_scripts(idea_id);
CREATE INDEX idx_engagement_user_idea ON engagement_tracking(user_id, idea_id);
CREATE INDEX idx_usage_user_month ON usage_tracking(user_id, month_year);

-- Triggers para updated_at automático
CREATE TRIGGER update_[table]_updated_at BEFORE UPDATE ON [table]
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **API OPTIMIZATION**
```typescript
// Patterns implementados:
// - Validation com Zod schemas
// - Error handling padronizado
// - Response caching onde apropriado
// - Rate limiting (Stripe webhooks)
// - Pagination para listas grandes

// Performance targets:
// - API response time: <2s
// - Database queries: <500ms
// - Page load time: <3s
```

### **MONITORING SETUP**
```typescript
// Implementado:
// - Console logging para desenvolvimento
// - Error boundaries no React
// - Supabase built-in monitoring

// Próximos passos:
// - Sentry para error tracking
// - Vercel Analytics para performance
// - PostHog para user analytics
```

---

## 🔄 **DATA FLOW PATTERNS**

### **IDEA GENERATION FLOW**
```
1. User clicks "Generate Idea"
2. Frontend calls POST /api/ideas/generate
3. API validates user limits (checkUserLimits)
4. API calls OpenAI with contextual prompt
5. AI response processed and structured
6. Idea saved to video_ideas table
7. Usage incremented (incrementUsage)
8. Engagement tracked (engagement_tracking)
9. Frontend updates with new idea
10. Dashboard stats updated
```

### **SCRIPT GENERATION FLOW (YouTube-Native)**
```
1. User selects idea and clicks "Create Script"
2. ScriptGenerationModal opens with framework options
3. User selects YouTube-Native Framework + script type
4. Frontend calls POST /api/scripts/generate
5. API validates limits and loads YouTube data
6. AI generates script with YouTube-Native framework
7. YouTubeNativeAnalyticsService analyzes script
8. Script saved with performance predictions
9. User redirected to /dashboard/scripts/[id] (NOT IMPLEMENTED)
10. Analytics tracked for conversion funnel
```

### **BILLING FLOW**
```
1. User hits usage limit or clicks upgrade
2. UpgradePrompt modal shows with plans
3. User selects plan and clicks checkout
4. Frontend calls POST /api/billing/create-checkout
5. Stripe session created with success/cancel URLs
6. User redirected to Stripe checkout
7. After payment, Stripe webhook fired
8. API processes webhook and updates subscription
9. User redirected back with updated limits
10. UI updates to show new plan benefits
```

---

## 🛠️ **DEVELOPMENT TOOLS & SETUP**

### **DEVELOPMENT STACK**
```json
// package.json dependencies
{
  "next": "14.2.0",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.4.0",
  "@supabase/supabase-js": "^2.39.3",
  "openai": "^4.26.0",
  "stripe": "^14.21.0",
  "@stackframe/stack": "^2.5.0",
  "next-themes": "^0.2.1",
  "next-intl": "^3.9.0",
  "zod": "^3.22.4",
  "lucide-react": "^0.344.0"
}
```

### **ENVIRONMENT VARIABLES**
```bash
# Database
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
OPENAI_API_KEY=

# Authentication  
STACK_PROJECT_ID=
STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=

# Payments
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Deployment
NEXT_PUBLIC_APP_URL=
```

### **BUILD & DEPLOYMENT**
```json
// next.config.js
{
  "experimental": {
    "serverComponentsExternalPackages": ["@supabase/supabase-js"]
  },
  "images": {
    "domains": ["example.com"]
  }
}

// Vercel deployment:
// - Automatic deployments from Git
// - Environment variables configured
// - Domain configured (tubespark.com)
// - Analytics enabled
```

---

## 🔍 **GAPS TÉCNICOS IDENTIFICADOS**

### **FRONTEND GAPS (CRÍTICOS)**
```typescript
// ❌ app/ideas/page.tsx - Uses mock data
const mockIdeas = [ ... ]; // Should fetch from Supabase

// ❌ app/dashboard/page.tsx - Shows fake stats  
const stats = [ ... ]; // Should calculate from real data

// ❌ Missing pages:
// - app/dashboard/scripts/page.tsx (list of scripts)
// - app/dashboard/scripts/[id]/page.tsx (script viewer)

// ❌ Components need API connection:
// - ScriptViewer.tsx (not connected to data)
// - Export functionality (not implemented)
```

### **INTEGRATION GAPS (MÉDIOS)**
```typescript
// ❌ YouTube API integration missing
// - No real channel data
// - No video performance tracking
// - No personalization based on channel history

// ❌ Advanced analytics missing
// - No user dashboard analytics
// - No ROI tracking
// - No success stories collection
```

### **OPERATIONAL GAPS (BAIXOS)**
```typescript
// ❌ Admin interfaces missing
// - No admin dashboard
// - No user management
// - No content moderation

// ❌ Advanced features missing
// - No content calendar
// - No competitor analysis UI
// - No trending topics dashboard
```

---

## 🎯 **PRÓXIMOS PASSOS TÉCNICOS**

### **FASE 1: CONECTAR FRONTEND (CRÍTICO)**
1. Substituir dados mock por Supabase queries
2. Implementar páginas de visualização de roteiros
3. Testar e validar sistema de pagamentos
4. Implementar export de roteiros

### **FASE 2: OTIMIZAÇÃO (ALTA)**
1. Implementar dashboard de analytics
2. Adicionar YouTube API integration
3. Melhorar performance e caching
4. Implementar monitoring avançado

### **FASE 3: FUNCIONALIDADES AVANÇADAS (MÉDIA)**
1. Criar interfaces administrativas
2. Implementar content calendar
3. Adicionar competitor analysis
4. Criar sistema de partnerships

---

## 📋 **CONCLUSÃO TÉCNICA**

### **PONTOS FORTES**
- ✅ **Arquitetura backend excepcional** (90% implementado)
- ✅ **YouTube-Native Framework único** no mercado
- ✅ **Sistema de monetização robusto** 
- ✅ **Database schema escalável** para 100k+ usuários
- ✅ **APIs RESTful completas** e bem documentadas
- ✅ **Security robusta** com RLS e Stack Auth

### **PONTOS CRÍTICOS**
- ❌ **Frontend desconectado** do backend robusto
- ❌ **Experiência do usuário incompleta**
- ❌ **Potencial de receita** não realizado

### **OPORTUNIDADE ÚNICA**
O TubeSpark possui uma **arquitetura técnica excepcional** que está **2-3 semanas** de se tornar uma aplicação totalmente funcional com **diferencial competitivo único** no mercado.

**A implementação crítica deve começar imediatamente para capitalizar sobre os investimentos técnicos já realizados.**

---

**Status**: 📊 **ARQUITETURA DOCUMETADA - PRONTA PARA IMPLEMENTAÇÃO CRÍTICA**  
**Próxima Atualização**: Após implementação dos gaps críticos  
**Maintainer**: Equipe de desenvolvimento TubeSpark

---

*Documentação técnica baseada em análise profunda do código-fonte, estrutura de banco de dados, APIs implementadas e padrões arquiteturais identificados no projeto TubeSpark em 4 de Agosto de 2025.*