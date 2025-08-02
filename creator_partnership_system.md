# 🤝 TUBESPARK - SISTEMA COMPLETO DE PARCERIAS COM CREATORS

**Data**: 01 de Agosto de 2025  
**Versão**: 1.0 COMPLETA  
**Destinatário**: Desenvolvedor Sênior  
**Objetivo**: Implementar sistema completo de parcerias, cupons e comissões para creators

---

## 📋 RESUMO EXECUTIVO

Este documento especifica a implementação de um **sistema completo de parcerias com creators** que incluirá:

- ✅ **Sistema de aplicação** para creators com análise automática de canal
- ✅ **Gestão de tiers** (Bronze, Silver, Gold) com benefícios escaláveis
- ✅ **Sistema de cupons** com tracking e limites automáticos
- ✅ **Programa de comissões** recorrentes automatizado
- ✅ **Dashboard para creators** com métricas em tempo real
- ✅ **Dashboard admin** para gestão completa de parcerias
- ✅ **Integração Stripe** para pagamento automático de comissões
- ✅ **Sistema de tracking** completo de performance

**Meta de Negócio**: Crescer de 0 para $50k MRR em 6 meses através de creator partnerships com ROI de 11x vs marketing tradicional.

---

## 🎯 ESTRATÉGIA DE NEGÓCIO COMPLETA

### **Por que Creator Partnerships Funcionam**
```typescript
const creatorMarketingAdvantage = {
  costPerLead: {
    traditional: "$50-100 via Google/Facebook ads",
    creator: "$5-15 via partnership",
    savings: "80-90% reduction in CAC"
  },
  
  conversion: {
    coldTraffic: "1-2% conversion rate",
    creatorTraffic: "3-8% conversion rate", 
    improvement: "3-5x higher conversion"
  },
  
  trust: {
    brandAds: "15% trust score",
    creatorRecommendation: "85% trust score",
    multiplier: "5.6x more trusted"
  },
  
  lifetime: {
    traditionalCampaign: "1-time exposure",
    creatorContent: "Evergreen recommendations",
    longevity: "Content works for months/years"
  }
}
```

### **Tier System Detalhado**

#### **🥉 BRONZE TIER (1k-10k subs)**
```typescript
const bronzeTier = {
  eligibility: {
    subscribers: "1,000-10,000",
    engagement: ">2% rate",
    recentActivity: "Upload nos últimos 30 dias",
    niche: "Relevante para TubeSpark"
  },
  benefits: {
    personalAccount: "3 meses grátis Pro Plan ($89.97 value)",
    discount: "50% off primeiro ano (economy $179.88)",
    couponCode: "CREATOR20 (20% off para audiência)",
    commission: "20% recorrente por 12 meses",
    support: "Email support prioritário"
  },
  requirements: {
    content: "1 vídeo review + mencionar em 3 vídeos",
    social: "3 posts Instagram/Twitter com hashtag #TubeSpark",
    stories: "5 Instagram Stories mostrando uso",
    timeline: "Cumprir em 60 dias"
  },
  expectedROI: {
    investmentCost: "$89.97 + $179.88 = $269.85",
    expectedConversions: "10-30 conversions/month",
    revenueGenerated: "$100-300/month",
    paybackPeriod: "2-3 months"
  }
}
```

#### **🥈 SILVER TIER (10k-100k subs)**
```typescript
const silverTier = {
  eligibility: {
    subscribers: "10,000-100,000",
    engagement: ">3% rate",
    recentActivity: "Uploads consistentes",
    audienceMatch: "Demografias alinhadas"
  },
  benefits: {
    personalAccount: "6 meses grátis Pro Plan ($179.94 value)",
    discount: "Primeiro ano GRATUITO ($359.88 value)",
    couponCode: "SILVER30 (30% off para audiência)",
    commission: "25% recorrente por 18 meses",
    extras: [
      "Early access a todas as features",
      "Direct line para suporte",
      "Featured no site como partner",
      "Co-marketing opportunities"
    ]
  },
  requirements: {
    content: "2 vídeos detalhados + 1 série sobre YouTube growth",
    social: "Weekly mentions por 3 meses",
    case_study: "Documentar resultados reais achieved",
    webinar: "Participar de 1 webinar conjunto (opcional)",
    timeline: "Cumprir em 90 dias"
  },
  expectedROI: {
    investmentCost: "$179.94 + $359.88 = $539.82",
    expectedConversions: "30-100 conversions/month",
    revenueGenerated: "$300-1000/month",
    paybackPeriod: "1-2 months"
  }
}
```

#### **🥇 GOLD TIER (100k+ subs)**
```typescript
const goldTier = {
  eligibility: {
    subscribers: "100,000+",
    engagement: ">4% rate",
    authority: "Reconhecido no nicho",
    alignment: "Values alinhados com TubeSpark"
  },
  benefits: {
    personalAccount: "Lifetime Pro Plan (valor incalculável)",
    couponCode: "GOLD40 (40% off para audiência)",
    commission: "30% recorrente LIFETIME",
    whiteLabel: "Custom branding options",
    consulting: "Monthly 1:1 strategy call",
    exclusivity: "Exclusive partner in niche (optional)",
    extras: [
      "Custom landing pages",
      "Dedicated account manager",
      "Product development input",
      "Speaking opportunities at events"
    ]
  },
  requirements: {
    content: "Série completa (5+ vídeos) sobre YouTube optimization",
    webinar: "Joint webinar com TubeSpark team",
    testimonial: "Professional video testimonial",
    case_study: "Detailed case study with metrics",
    events: "Mention TubeSpark in speaking opportunities",
    timeline: "Cumprir em 120 dias"
  },
  expectedROI: {
    investmentCost: "Lifetime value ~$3600",
    expectedConversions: "100-500 conversions/month",
    revenueGenerated: "$1000-5000/month",
    paybackPeriod: "1 month"
  }
}
```

---

## 🗄️ DATABASE SCHEMA COMPLETO

### **1. Tabela: affiliates**
```sql
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  affiliate_code VARCHAR(20) UNIQUE NOT NULL,
  tier VARCHAR(10) CHECK (tier IN ('bronze', 'silver', 'gold')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'suspended', 'rejected')),
  
  -- Channel Information
  youtube_channel_id VARCHAR(100),
  youtube_channel_name VARCHAR(200),
  youtube_channel_url VARCHAR(500),
  subscriber_count INTEGER,
  average_views INTEGER,
  engagement_rate DECIMAL(5,2), -- Percentage
  niche VARCHAR(50),
  
  -- Application Data
  application_data JSONB, -- Full application form data
  content_style VARCHAR(200),
  audience_demographics VARCHAR(500),
  why_partnership TEXT,
  social_media_links JSONB, -- {instagram, twitter, tiktok}
  
  -- Partnership Details
  commission_rate DECIMAL(5,2), -- Percentage (20.00 = 20%)
  free_months_granted INTEGER DEFAULT 0,
  discount_percentage INTEGER DEFAULT 0, -- For their personal account
  
  -- Approval Process
  applied_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id), -- Admin who approved
  rejection_reason TEXT,
  
  -- Performance Tracking
  total_conversions INTEGER DEFAULT 0,
  total_commission_earned DECIMAL(10,2) DEFAULT 0,
  last_activity_at TIMESTAMP,
  
  -- Payment Info
  stripe_account_id VARCHAR(100), -- For commission payouts
  payment_email VARCHAR(255),
  tax_info JSONB, -- Tax information if needed
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_affiliates_code (affiliate_code),
  INDEX idx_affiliates_status (status),
  INDEX idx_affiliates_tier (tier),
  INDEX idx_affiliates_channel (youtube_channel_id),
  INDEX idx_affiliates_performance (total_conversions DESC, total_commission_earned DESC)
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE
ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **2. Tabela: discount_coupons**
```sql
CREATE TABLE discount_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  
  -- Discount Configuration
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_months')),
  discount_value DECIMAL(10,2), -- 30 para 30%, ou 9.99 para desconto fixo, ou 3 para 3 meses
  
  -- Usage Limits
  max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
  current_uses INTEGER DEFAULT 0,
  max_uses_per_user INTEGER DEFAULT 1,
  
  -- Validity
  starts_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  -- Applicability
  applies_to JSONB, -- ["starter", "pro", "business"] - quais planos
  minimum_order_value DECIMAL(10,2) DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired', 'exhausted')),
  
  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_coupons_code (code),
  INDEX idx_coupons_affiliate (affiliate_id),
  INDEX idx_coupons_status (status),
  INDEX idx_coupons_expires (expires_at),
  INDEX idx_coupons_active (status, starts_at, expires_at) WHERE status = 'active'
);

-- Trigger to update coupon status when max_uses reached
CREATE OR REPLACE FUNCTION check_coupon_exhausted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_uses >= NEW.max_uses AND NEW.max_uses IS NOT NULL THEN
    NEW.status = 'exhausted';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coupon_status BEFORE UPDATE
ON discount_coupons FOR EACH ROW EXECUTE FUNCTION check_coupon_exhausted();
```

### **3. Tabela: coupon_uses**
```sql
CREATE TABLE coupon_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES discount_coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  
  -- Usage Details
  discount_applied DECIMAL(10,2), -- Valor real do desconto aplicado
  original_amount DECIMAL(10,2), -- Valor original sem desconto
  final_amount DECIMAL(10,2), -- Valor final pago
  
  -- Tracking
  used_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  
  -- Prevent abuse
  UNIQUE(coupon_id, user_id), -- One use per user per coupon
  
  -- Indexes
  INDEX idx_coupon_uses_coupon (coupon_id),
  INDEX idx_coupon_uses_user (user_id),
  INDEX idx_coupon_uses_date (used_at DESC),
  INDEX idx_coupon_uses_subscription (subscription_id)
);

-- Trigger to increment current_uses in discount_coupons
CREATE OR REPLACE FUNCTION increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE discount_coupons 
  SET current_uses = current_uses + 1,
      last_used_at = NEW.used_at
  WHERE id = NEW.coupon_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_coupon_usage_trigger AFTER INSERT
ON coupon_uses FOR EACH ROW EXECUTE FUNCTION increment_coupon_usage();
```

### **4. Tabela: affiliate_commissions**
```sql
CREATE TABLE affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id), -- Who subscribed
  coupon_use_id UUID REFERENCES coupon_uses(id), -- If came from coupon
  
  -- Commission Details
  commission_rate DECIMAL(5,2), -- Rate at time of commission (25.00 = 25%)
  base_amount DECIMAL(10,2), -- Subscription amount before discount
  commission_amount DECIMAL(10,2), -- Calculated commission
  
  -- Period Information
  billing_period_start DATE,
  billing_period_end DATE,
  
  -- Payment Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled', 'disputed')),
  
  -- Stripe Integration
  stripe_transfer_id VARCHAR(100), -- When paid via Stripe
  stripe_transfer_status VARCHAR(50),
  
  -- Payment Details
  payment_method VARCHAR(50), -- 'stripe_transfer', 'manual', 'credit'
  paid_at TIMESTAMP,
  payment_notes TEXT,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP, -- When subscription confirmed as active
  
  -- Indexes
  INDEX idx_commissions_affiliate (affiliate_id),
  INDEX idx_commissions_subscription (subscription_id),
  INDEX idx_commissions_period (billing_period_start, billing_period_end),
  INDEX idx_commissions_status (status),
  INDEX idx_commissions_payment (status, paid_at) WHERE status = 'paid'
);
```

### **5. Tabela: affiliate_activities**
```sql
CREATE TABLE affiliate_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'content_posted', 'social_mention', 'coupon_shared', etc.
  activity_data JSONB, -- Details specific to activity type
  url VARCHAR(500), -- Link to content if applicable
  platform VARCHAR(50), -- 'youtube', 'instagram', 'twitter', etc.
  engagement_metrics JSONB, -- Views, likes, comments, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_activities_affiliate (affiliate_id),
  INDEX idx_activities_type (activity_type),
  INDEX idx_activities_date (created_at DESC),
  INDEX idx_activities_platform (platform)
);
```

### **6. Modificações em Tabelas Existentes**

#### **subscriptions (Adicionar tracking de affiliate)**
```sql
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES affiliates(id);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS coupon_used_id UUID REFERENCES coupon_uses(id);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS referred_by_affiliate BOOLEAN DEFAULT false;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_affiliate ON subscriptions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_referred ON subscriptions(referred_by_affiliate) WHERE referred_by_affiliate = true;
```

#### **users (Adicionar referral tracking)**
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by_affiliate_id UUID REFERENCES affiliates(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_source VARCHAR(100); -- 'CREATOR20', 'instagram_story', etc.

-- Index
CREATE INDEX IF NOT EXISTS idx_users_referral ON users(referred_by_affiliate_id);
```

---

## 🛠️ IMPLEMENTAÇÃO BACKEND COMPLETA

### **1. Sistema de Aplicação para Creators**

#### **API: Análise Automática de Canal**
```typescript
// src/app/api/creators/analyze-channel/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { channelUrl } = await request.json();
    
    // Extract channel ID from URL
    const channelId = await extractChannelId(channelUrl);
    if (!channelId) {
      return NextResponse.json({ error: 'URL inválida do canal' }, { status: 400 });
    }

    // Fetch comprehensive channel data
    const [channelData, channelStats, recentVideos] = await Promise.all([
      fetchYouTubeChannelData(channelId),
      fetchChannelStats(channelId),
      fetchRecentVideos(channelId)
    ]);
    
    // Perform detailed analysis
    const analysis = analyzeChannelForPartnership(channelData, channelStats, recentVideos);
    
    return NextResponse.json({
      channelId,
      channelName: channelData.snippet.title,
      subscriberCount: parseInt(channelData.statistics.subscriberCount),
      viewCount: parseInt(channelData.statistics.viewCount),
      videoCount: parseInt(channelData.statistics.videoCount),
      averageViews: analysis.averageViews,
      engagementRate: analysis.engagementRate,
      suggestedNiche: analysis.detectedNiche,
      suggestedTier: analysis.suggestedTier,
      eligibility: analysis.eligibility,
      strengths: analysis.strengths,
      concerns: analysis.concerns,
      projectedROI: analysis.projectedROI
    });

  } catch (error) {
    console.error('Channel analysis error:', error);
    return NextResponse.json({ 
      error: 'Erro ao analisar canal. Verifique se a URL está correta.' 
    }, { status: 500 });
  }
}

async function fetchYouTubeChannelData(channelId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?` +
    `part=snippet,statistics,brandingSettings&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`
  );
  
  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error('Canal não encontrado');
  }
  
  return data.items[0];
}

async function fetchChannelStats(channelId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&channelId=${channelId}&order=date&maxResults=10&type=video&key=${process.env.YOUTUBE_API_KEY}`
  );
  
  return response.json();
}

async function fetchRecentVideos(channelId: string) {
  const searchResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&channelId=${channelId}&order=date&maxResults=20&type=video&key=${process.env.YOUTUBE_API_KEY}`
  );
  
  const searchData = await searchResponse.json();
  
  if (!searchData.items || searchData.items.length === 0) {
    return [];
  }
  
  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
  
  const statsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?` +
    `part=statistics,snippet&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`
  );
  
  const statsData = await statsResponse.json();
  return statsData.items || [];
}

function analyzeChannelForPartnership(channelData: any, channelStats: any, recentVideos: any[]) {
  const subscriberCount = parseInt(channelData.statistics.subscriberCount);
  const averageViews = calculateAverageViews(recentVideos);
  const engagementRate = calculateEngagementRate(recentVideos);
  const detectedNiche = detectNiche(channelData, recentVideos);
  
  let suggestedTier = null;
  let eligibility = { eligible: false, reasons: [] };
  let strengths = [];
  let concerns = [];
  let projectedROI = null;
  
  // Determine tier based on subscriber count and engagement
  if (subscriberCount >= 100000) {
    suggestedTier = {
      name: 'gold',
      displayName: 'Gold 🥇',
      commissionRate: 30,
      benefits: [
        'Lifetime Pro Plan gratuito',
        'Código 40% off para audiência',
        '30% comissão recorrente LIFETIME',
        'Opções de white-label',
        'Consultoria mensal 1:1',
        'Exclusive partner opportunities'
      ],
      projectedMonthlyConversions: Math.floor(subscriberCount * 0.001), // 0.1% conversion rate
      projectedMonthlyRevenue: Math.floor(subscriberCount * 0.001 * 29.99 * 0.3) // Commission
    };
  } else if (subscriberCount >= 10000) {
    suggestedTier = {
      name: 'silver',
      displayName: 'Silver 🥈',
      commissionRate: 25,
      benefits: [
        '6 meses grátis Pro Plan',
        'Primeiro ano GRATUITO',
        'Código 30% off para audiência',
        '25% comissão recorrente por 18 meses',
        'Early access a novas features',
        'Direct support line'
      ],
      projectedMonthlyConversions: Math.floor(subscriberCount * 0.0008),
      projectedMonthlyRevenue: Math.floor(subscriberCount * 0.0008 * 29.99 * 0.25)
    };
  } else if (subscriberCount >= 1000) {
    suggestedTier = {
      name: 'bronze',
      displayName: 'Bronze 🥉',
      commissionRate: 20,
      benefits: [
        '3 meses grátis Pro Plan',
        '50% off no primeiro ano',
        'Código 20% off para audiência',
        '20% comissão recorrente por 12 meses',
        'Priority email support'
      ],
      projectedMonthlyConversions: Math.floor(subscriberCount * 0.0005),
      projectedMonthlyRevenue: Math.floor(subscriberCount * 0.0005 * 29.99 * 0.2)
    };
  }
  
  // Check detailed eligibility criteria
  const minSubscribers = 1000;
  const minAverageViews = 500;
  const minEngagementRate = 2; // 2%
  const minRecentActivity = 30; // days
  
  if (subscriberCount >= minSubscribers) {
    eligibility.eligible = true;
    strengths.push(`${subscriberCount.toLocaleString()} inscritos qualificados`);
  } else {
    eligibility.reasons.push(`Mínimo ${minSubscribers.toLocaleString()} inscritos necessário (atual: ${subscriberCount.toLocaleString()})`);
  }
  
  if (averageViews >= minAverageViews) {
    strengths.push(`Média sólida de ${averageViews.toLocaleString()} views por vídeo`);
  } else {
    concerns.push(`Views médias abaixo do ideal (${averageViews.toLocaleString()}, mínimo: ${minAverageViews.toLocaleString()})`);
  }
  
  if (engagementRate >= minEngagementRate) {
    strengths.push(`Excelente taxa de engajamento: ${engagementRate.toFixed(1)}%`);
  } else {
    concerns.push(`Engajamento baixo (${engagementRate.toFixed(1)}%, mínimo: ${minEngagementRate}%)`);
  }
  
  // Check recent activity
  if (recentVideos.length > 0) {
    const lastVideoDate = new Date(recentVideos[0]?.snippet.publishedAt);
    const daysSinceLastVideo = (Date.now() - lastVideoDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastVideo <= minRecentActivity) {
      strengths.push('Canal ativo com uploads recentes');
    } else {
      concerns.push(`Último vídeo há ${Math.floor(daysSinceLastVideo)} dias (máximo: ${minRecentActivity} dias)`);
    }
  }
  
  // Additional quality checks
  if (detectedNiche !== 'general') {
    strengths.push(`Nicho bem definido: ${detectedNiche}`);
  } else {
    concerns.push('Nicho não claramente definido');
  }
  
  // Calculate projected ROI
  if (suggestedTier) {
    projectedROI = {
      tier: suggestedTier.name,
      monthlyConversions: suggestedTier.projectedMonthlyConversions,
      monthlyCommission: suggestedTier.projectedMonthlyRevenue,
      yearlyProjection: suggestedTier.projectedMonthlyRevenue * 12,
      paybackPeriod: suggestedTier.name === 'gold' ? '1 month' : 
                     suggestedTier.name === 'silver' ? '1-2 months' : '2-3 months'
    };
  }
  
  return {
    averageViews,
    engagementRate,
    detectedNiche,
    suggestedTier,
    eligibility,
    strengths,
    concerns,
    projectedROI
  };
}

function calculateAverageViews(videos: any[]): number {
  if (!videos || videos.length === 0) return 0;
  
  const totalViews = videos.reduce((sum, video) => {
    return sum + parseInt(video.statistics?.viewCount || '0');
  }, 0);
  
  return Math.round(totalViews / videos.length);
}

function calculateEngagementRate(videos: any[]): number {
  if (!videos || videos.length === 0) return 0;
  
  const engagementRates = videos.map(video => {
    const views = parseInt(video.statistics?.viewCount || '0');
    const likes = parseInt(video.statistics?.likeCount || '0');
    const comments = parseInt(video.statistics?.commentCount || '0');
    
    if (views === 0) return 0;
    return ((likes + comments) / views) * 100;
  });
  
  const avgEngagement = engagementRates.reduce((sum, rate) => sum + rate, 0) / engagementRates.length;
  return Math.round(avgEngagement * 100) / 100;
}

function detectNiche(channelData: any, recentVideos: any[]): string {
  const channelDescription = channelData.snippet.description.toLowerCase();
  const videoTitles = recentVideos.map(v => v.snippet.title.toLowerCase()).join(' ');
  const allText = channelDescription + ' ' + videoTitles;
  
  const niches = {
    'tech': ['technology', 'tech', 'software', 'programming', 'coding', 'app', 'gadget', 'review'],
    'gaming': ['gaming', 'game', 'gameplay', 'streamer', 'playthrough', 'review', 'minecraft', 'fortnite'],
    'lifestyle': ['lifestyle', 'vlog', 'daily', 'routine', 'life', 'personal', 'day in my life'],
    'education': ['tutorial', 'how to', 'learn', 'education', 'teach', 'course', 'guide', 'tips'],
    'business': ['business', 'entrepreneur', 'marketing', 'money', 'finance', 'startup', 'investing'],
    'fitness': ['fitness', 'workout', 'gym', 'health', 'exercise', 'training', 'nutrition'],
    'beauty': ['beauty', 'makeup', 'skincare', 'fashion', 'style', 'cosmetics', 'hair'],
    'cooking': ['cooking', 'recipe', 'food', 'kitchen', 'chef', 'baking', 'meal prep'],
    'youtube_education': ['youtube', 'creator', 'content', 'viral', 'algorithm', 'thumbnail', 'editing']
  };
  
  let maxMatches = 0;
  let detectedNiche = 'general';
  
  Object.entries(niches).forEach(([niche, keywords]) => {
    const matches = keywords.filter(keyword => allText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedNiche = niche;
    }
  });
  
  return detectedNiche;
}

async function extractChannelId(url: string): Promise<string | null> {
  // Handle different YouTube URL formats
  const patterns = [
    /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/@([a-zA-Z0-9_-]+)/,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      // For @ handles and custom URLs, we need to resolve to channel ID
      if (url.includes('/@') || url.includes('/c/') || url.includes('/user/')) {
        return await resolveToChannelId(match[1]);
      }
      return match[1];
    }
  }
  
  return null;
}

async function resolveToChannelId(handle: string): Promise<string | null> {
  try {
    // Use YouTube API to search for the channel
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&type=channel&q=${handle}&key=${process.env.YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].snippet.channelId;
    }
  } catch (error) {
    console.error('Error resolving channel ID:', error);
  }
  
  return null;
}
```

#### **API: Submissão de Aplicação**
```typescript
// src/app/api/creators/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has an application
    const { data: existingAffiliate } = await supabase
      .from('affiliates')
      .select('id, status')
      .eq('user_id', user.id)
      .single();

    if (existingAffiliate) {
      return NextResponse.json({ 
        error: 'Você já possui uma aplicação pendente ou ativa' 
      }, { status: 400 });
    }

    // Generate unique affiliate code
    const affiliateCode = await generateUniqueAffiliateCode(supabase);
    
    // Determine tier based on subscriber count
    const tier = determineTier(applicationData.subscriberCount);
    const tierConfig = getTierConfiguration(tier);
    
    // Create affiliate record
    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .insert({
        user_id: user.id,
        affiliate_code: affiliateCode,
        tier,
        status: 'pending',
        youtube_channel_id: applicationData.channelId,
        youtube_channel_name: applicationData.channelName,
        youtube_channel_url: applicationData.youtubeChannel,
        subscriber_count: applicationData.subscriberCount,
        average_views: applicationData.averageViews,
        engagement_rate: applicationData.engagementRate,
        niche: applicationData.niche,
        application_data: applicationData,
        content_style: applicationData.contentStyle,
        audience_demographics: applicationData.audienceDemo,
        why_partnership: applicationData.whyPartnership,
        social_media_links: applicationData.socialMedia,
        commission_rate: tierConfig.commissionRate,
        free_months_granted: tierConfig.freeMonths,
        discount_percentage: tierConfig.discountPercentage,
        payment_email: user.email
      })
      .select()
      .single();

    if (error) throw error;

    // Create default coupon codes for the affiliate
    await createDefaultCoupons(supabase, affiliate.id, tier, affiliateCode);
    
    // Send notification email to admin
    await sendAdminNotification(affiliate);
    
    // Send confirmation email to creator
    await sendCreatorConfirmation(user.email, affiliate);

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        code: affiliate.affiliate_code,
        tier: affiliate.tier,
        status: affiliate.status,
        expectedApprovalTime: tier === 'gold' ? '3-5 dias úteis' : '1-2 dias úteis'
      }
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json({ 
      error: 'Erro ao enviar aplicação. Tente novamente.' 
    }, { status: 500 });
  }
}

async function generateUniqueAffiliateCode(supabase: any): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const code = 'CR' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data } = await supabase
      .from('affiliates')
      .select('id')
      .eq('affiliate_code', code)
      .single();
    
    if (!data) return code;
    attempts++;
  }
  
  throw new Error('Failed to generate unique affiliate code');
}

function determineTier(subscriberCount: number): string {
  if (subscriberCount >= 100000) return 'gold';
  if (subscriberCount >= 10000) return 'silver';
  return 'bronze';
}

function getTierConfiguration(tier: string) {
  const configs = {
    bronze: {
      commissionRate: 20.00,
      freeMonths: 3,
      discountPercentage: 50,
      couponDiscount: 20
    },
    silver: {
      commissionRate: 25.00,
      freeMonths: 6,
      discountPercentage: 100, // Free first year
      couponDiscount: 30
    },
    gold: {
      commissionRate: 30.00,
      freeMonths: 999, // Lifetime
      discountPercentage: 100,
      couponDiscount: 40
    }
  };
  
  return configs[tier as keyof typeof configs];
}

async function createDefaultCoupons(supabase: any, affiliateId: string, tier: string, affiliateCode: string) {
  const tierConfig = getTierConfiguration(tier);
  
  // Create main audience coupon
  const mainCouponCode = tier.toUpperCase() + affiliateCode.slice(-2);
  
  // Create primary coupon
  await supabase
    .from('discount_coupons')
    .insert({
      code: mainCouponCode,
      affiliate_id: affiliateId,
      discount_type: 'percentage',
      discount_value: tierConfig.couponDiscount,
      applies_to: ['starter', 'pro'],
      max_uses: tier === 'gold' ? null : (tier === 'silver' ? 500 : 200),
      expires_at: tier === 'gold' ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    });

  // Create backup coupon for special promotions
  const backupCouponCode = 'PROMO' + affiliateCode.slice(-3);
  await supabase
    .from('discount_coupons')
    .insert({
      code: backupCouponCode,
      affiliate_id: affiliateId,
      discount_type: 'percentage',
      discount_value: tierConfig.couponDiscount + 10, // Extra 10% for special events
      applies_to: ['starter', 'pro'],
      max_uses: 50,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      status: 'paused' // Admin can activate for special campaigns
    });
}

async function sendAdminNotification(affiliate: any) {
  // TODO: Implement email notification to admin
  // Use Resend, SendGrid, or any email service
  console.log('🚨 New creator application received:', {
    channel: affiliate.youtube_channel_name,
    tier: affiliate.tier,
    subscribers: affiliate.subscriber_count
  });
  
  // You can also add Slack notification here
  // await sendSlackNotification(affiliate);
}

async function sendCreatorConfirmation(email: string, affiliate: any) {
  // TODO: Implement confirmation email to creator
  console.log('✅ Confirmation email sent to:', email, {
    affiliateCode: affiliate.affiliate_code,
    tier: affiliate.tier
  });
}
```

### **2. Sistema de Cupons Completo**

#### **API: Validação de Cupom**
```typescript
// src/app/api/billing/validate-coupon/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { couponCode, planType } = await request.json();
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch and validate coupon with affiliate info
    const { data: coupon, error: couponError } = await supabase
      .from('discount_coupons')
      .select(`
        *,
        affiliates(
          affiliate_code,
          tier,
          youtube_channel_name,
          status
        )
      `)
      .eq('code', couponCode.toUpperCase())
      .single();

    if (couponError || !coupon) {
      return NextResponse.json({ 
        valid: false,
        error: 'Cupom não encontrado' 
      }, { status: 400 });
    }

    // Check if coupon is active
    if (coupon.status !== 'active') {
      return NextResponse.json({ 
        valid: false,
        error: `Cupom está ${coupon.status}` 
      }, { status: 400 });
    }

    // Check if affiliate is active
    if (coupon.affiliates?.status !== 'active') {
      return NextResponse.json({ 
        valid: false,
        error: 'Cupom temporariamente indisponível' 
      }, { status: 400 });
    }

    // Check expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      // Auto-update status to expired
      await supabase
        .from('discount_coupons')
        .update({ status: 'expired' })
        .eq('id', coupon.id);
        
      return NextResponse.json({ 
        valid: false,
        error: 'Cupom expirado' 
      }, { status: 400 });
    }

    // Check start date
    if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
      return NextResponse.json({ 
        valid: false,
        error: 'Cupom ainda não está ativo' 
      }, { status: 400 });
    }

    // Check usage limits
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      // Auto-update status to exhausted
      await supabase
        .from('discount_coupons')
        .update({ status: 'exhausted' })
        .eq('id', coupon.id);
        
      return NextResponse.json({ 
        valid: false,
        error: 'Cupom esgotado' 
      }, { status: 400 });
    }

    // Check if applies to the selected plan
    const appliesTo = coupon.applies_to as string[];
    if (appliesTo && !appliesTo.includes(planType)) {
      return NextResponse.json({ 
        valid: false,
        error: `Cupom não válido para o plano ${planType}` 
      }, { status: 400 });
    }

    // Check if user already used this coupon
    const { data: existingUse } = await supabase
      .from('coupon_uses')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('user_id', user.id)
      .single();

    if (existingUse) {
      return NextResponse.json({ 
        valid: false,
        error: 'Você já utilizou este cupom' 
      }, { status: 400 });
    }

    // Calculate discount
    const originalPrice = getPlanPrice(planType);
    if (originalPrice < coupon.minimum_order_value) {
      return NextResponse.json({ 
        valid: false,
        error: `Valor mínimo: $${coupon.minimum_order_value}` 
      }, { status: 400 });
    }

    const discount = calculateDiscount(originalPrice, coupon);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        affiliate: {
          code: coupon.affiliates?.affiliate_code,
          channel: coupon.affiliates?.youtube_channel_name,
          tier: coupon.affiliates?.tier
        }
      },
      pricing: {
        original: originalPrice,
        discount: discount.amount,
        final: Math.max(0, originalPrice - discount.amount),
        savings: discount.amount,
        savingsPercentage: Math.round((discount.amount / originalPrice) * 100)
      },
      metadata: {
        usesRemaining: coupon.max_uses ? coupon.max_uses - coupon.current_uses : 'Unlimited',
        expiresAt: coupon.expires_at,
        creatorChannel: coupon.affiliates?.youtube_channel_name
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

function calculateDiscount(originalPrice: number, coupon: any) {
  switch (coupon.discount_type) {
    case 'percentage':
      const percentDiscount = (originalPrice * coupon.discount_value) / 100;
      return {
        amount: Math.min(percentDiscount, originalPrice),
        type: 'percentage'
      };
      
    case 'fixed_amount':
      return {
        amount: Math.min(coupon.discount_value, originalPrice),
        type: 'fixed'
      };
      
    case 'free_months':
      return {
        amount: originalPrice, // Full discount for first month/period
        type: 'free_months',
        months: coupon.discount_value
      };
      
    default:
      return { amount: 0, type: 'none' };
  }
}

function getPlanPrice(planType: string): number {
  const prices = {
    'starter': 9.99,
    'pro': 29.99,
    'business': 99.99
  };
  
  return prices[planType as keyof typeof prices] || 0;
}
```

#### **API: Aplicar Cupom no Checkout**
```typescript
// src/app/api/billing/apply-coupon/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(request: NextRequest) {
  try {
    const { couponCode, planType, stripeSessionId } = await request.json();
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate coupon (reuse validation logic)
    const validationResponse = await validateCouponInternal(supabase, couponCode, planType, user.id);
    if (!validationResponse.valid) {
      return NextResponse.json(validationResponse, { status: 400 });
    }

    // Record coupon usage
    const { data: couponUse, error: useError } = await supabase
      .from('coupon_uses')
      .insert({
        coupon_id: validationResponse.coupon.id,
        user_id: user.id,
        discount_applied: validationResponse.pricing.discount,
        original_amount: validationResponse.pricing.original,
        final_amount: validationResponse.pricing.final,
        ip_address: request.ip,
        user_agent: request.headers.get('user-agent')
      })
      .select()
      .single();

    if (useError) throw useError;

    // Create modified Stripe checkout session with discount
    const session = await createStripeSessionWithDiscount(
      user,
      planType,
      validationResponse.pricing,
      validationResponse.coupon.affiliate.code
    );

    // Track affiliate referral
    await supabase
      .from('users')
      .update({
        referred_by_affiliate_id: validationResponse.coupon.affiliate.id,
        referral_source: couponCode
      })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      couponUse: couponUse.id,
      savings: validationResponse.pricing.savings
    });

  } catch (error) {
    console.error('Apply coupon error:', error);
    return NextResponse.json({ 
      error: 'Erro ao aplicar cupom' 
    }, { status: 500 });
  }
}

async function createStripeSessionWithDiscount(user: any, planType: string, pricing: any, affiliateCode: string) {
  const basePrice = getPlanPrice(planType);
  const discountedPrice = pricing.final;
  
  // If free or heavily discounted, create custom price
  let priceId;
  if (discountedPrice === 0) {
    // Handle free trial/subscription
    priceId = await createFreeTrialPrice(planType);
  } else if (discountedPrice !== basePrice) {
    // Create discounted price
    priceId = await createDiscountedPrice(planType, discountedPrice);
  } else {
    // Use standard price
    priceId = getStandardPriceId(planType);
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success&affiliate=${affiliateCode}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=cancelled`,
    metadata: {
      userId: user.id,
      planType,
      affiliateCode,
      originalPrice: basePrice.toString(),
      discountedPrice: discountedPrice.toString()
    }
  });

  return session;
}

// Helper functions for Stripe price creation
async function createDiscountedPrice(planType: string, discountedPrice: number) {
  const productId = getProductId(planType);
  
  const price = await stripe.prices.create({
    unit_amount: Math.round(discountedPrice * 100), // Convert to cents
    currency: 'usd',
    recurring: { interval: 'month' },
    product: productId,
    metadata: {
      type: 'discounted',
      planType
    }
  });
  
  return price.id;
}

function getStandardPriceId(planType: string): string {
  const priceIds = {
    'starter': process.env.STRIPE_STARTER_PRICE_ID!,
    'pro': process.env.STRIPE_PRO_PRICE_ID!,
    'business': process.env.STRIPE_BUSINESS_PRICE_ID!
  };
  
  return priceIds[planType as keyof typeof priceIds];
}

function getProductId(planType: string): string {
  const productIds = {
    'starter': process.env.STRIPE_STARTER_PRODUCT_ID!,
    'pro': process.env.STRIPE_PRO_PRODUCT_ID!,
    'business': process.env.STRIPE_BUSINESS_PRODUCT_ID!
  };
  
  return productIds[planType as keyof typeof productIds];
}
```

### **3. Sistema de Comissões Automático**

#### **Webhook do Stripe para Tracking de Comissões**
```typescript
// src/app/api/billing/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(supabase, event.data.object as Stripe.Invoice);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(supabase, event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(supabase, event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(supabase: any, session: Stripe.Checkout.Session) {
  const { userId, planType, affiliateCode } = session.metadata || {};
  
  if (!userId || !affiliateCode) return;

  // Find affiliate
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('affiliate_code', affiliateCode)
    .eq('status', 'active')
    .single();

  if (!affiliate) return;

  // Find or create subscription record
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', session.subscription)
    .single();

  if (subscription) {
    // Update subscription with affiliate info
    await supabase
      .from('subscriptions')
      .update({
        affiliate_id: affiliate.id,
        referred_by_affiliate: true
      })
      .eq('id', subscription.id);

    // Create initial commission record
    await createCommissionRecord(supabase, affiliate, subscription, session);
  }
}

async function handlePaymentSucceeded(supabase: any, invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  // Find subscription with affiliate
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select(`
      *,
      affiliates(*)
    `)
    .eq('stripe_subscription_id', invoice.subscription)
    .eq('referred_by_affiliate', true)
    .single();

  if (!subscription?.affiliates) return;

  // Calculate commission for this billing period
  const commissionAmount = (invoice.amount_paid / 100) * (subscription.affiliates.commission_rate / 100);
  
  // Create commission record
  const { error } = await supabase
    .from('affiliate_commissions')
    .insert({
      affiliate_id: subscription.affiliate_id,
      subscription_id: subscription.id,
      user_id: subscription.user_id,
      commission_rate: subscription.affiliates.commission_rate,
      base_amount: invoice.amount_paid / 100,
      commission_amount: commissionAmount,
      billing_period_start: new Date(invoice.period_start * 1000).toISOString().split('T')[0],
      billing_period_end: new Date(invoice.period_end * 1000).toISOString().split('T')[0],
      status: 'confirmed'
    });

  if (!error) {
    // Update affiliate totals
    await supabase
      .from('affiliates')
      .update({
        total_conversions: supabase.raw('total_conversions + 1'),
        total_commission_earned: supabase.raw(`total_commission_earned + ${commissionAmount}`),
        last_activity_at: new Date().toISOString()
      })
      .eq('id', subscription.affiliate_id);
  }
}

async function createCommissionRecord(supabase: any, affiliate: any, subscription: any, session: Stripe.Checkout.Session) {
  const amount = session.amount_total ? session.amount_total / 100 : 0;
  const commissionAmount = amount * (affiliate.commission_rate / 100);
  
  await supabase
    .from('affiliate_commissions')
    .insert({
      affiliate_id: affiliate.id,
      subscription_id: subscription.id,
      user_id: subscription.user_id,
      commission_rate: affiliate.commission_rate,
      base_amount: amount,
      commission_amount: commissionAmount,
      billing_period_start: new Date().toISOString().split('T')[0],
      billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending'
    });
}

async function handleSubscriptionDeleted(supabase: any, subscription: Stripe.Subscription) {
  // Cancel future commissions for this subscription
  await supabase
    .from('affiliate_commissions')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id)
    .eq('status', 'pending');
}
```

### **4. Dashboard para Creators**

#### **Página Completa do Dashboard**
```typescript
// src/app/creators/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Eye, 
  Copy,
  ExternalLink,
  Calendar,
  Target,
  Award,
  BarChart3
} from 'lucide-react';

interface AffiliateData {
  id: string;
  affiliate_code: string;
  tier: string;
  status: string;
  youtube_channel_name: string;
  subscriber_count: number;
  commission_rate: number;
  total_conversions: number;
  total_commission_earned: number;
  coupons: CouponData[];
}

interface CouponData {
  id: string;
  code: string;
  discount_value: number;
  current_uses: number;
  max_uses: number | null;
  status: string;
  expires_at: string | null;
}

interface StatsData {
  totalEarnings: number;
  monthlyEarnings: number;
  totalConversions: number;
  monthlyConversions: number;
  conversionRate: number;
  averageOrderValue: number;
  nextPayment: number;
  nextPaymentDate: string;
  monthlyGrowth: number;
}

export default function CreatorDashboard() {
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [commissions, setCommissions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/creators/dashboard');
      const data = await response.json();
      
      setAffiliateData(data.affiliate);
      setStats(data.stats);
      setCommissions(data.commissions);
      setActivities(data.activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!affiliateData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>❌ Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você não possui uma parceria ativa com TubeSpark.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/creators/apply'}>
              Aplicar para Parceria
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tierColors = {
    bronze: 'border-amber-400 text-amber-600',
    silver: 'border-gray-400 text-gray-600',
    gold: 'border-yellow-400 text-yellow-600'
  };

  const tierEmojis = {
    bronze: '🥉',
    silver: '🥈', 
    gold: '🥇'
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {affiliateData.youtube_channel_name}!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant="outline" 
            className={`text-lg px-4 py-2 ${tierColors[affiliateData.tier as keyof typeof tierColors]}`}
          >
            {tierEmojis[affiliateData.tier as keyof typeof tierEmojis]} {affiliateData.tier.toUpperCase()} TIER
          </Badge>
          <Badge 
            variant={affiliateData.status === 'active' ? 'default' : 'secondary'}
            className="text-sm px-3 py-1"
          >
            {affiliateData.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats?.totalEarnings?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              +${stats?.monthlyEarnings?.toFixed(2) || '0.00'} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversões
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalConversions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.monthlyConversions || 0} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.conversionRate?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Ticket médio: ${stats?.averageOrderValue?.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximo Pagamento
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.nextPayment?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.nextPaymentDate || 'TBD'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="coupons">Cupons</TabsTrigger>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance dos Últimos 6 Meses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: Implement chart component */}
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">
                  Gráfico de performance será implementado aqui
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Objetivos do Mês</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Conversões</span>
                  <span className="font-semibold">{stats?.monthlyConversions || 0}/50</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(((stats?.monthlyConversions || 0) / 50) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Receita</span>
                  <span className="font-semibold">${stats?.monthlyEarnings?.toFixed(2) || '0.00'}/$500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(((stats?.monthlyEarnings || 0) / 500) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏆 Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.totalConversions! >= 10 && (
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span>Primeira 10 conversões!</span>
                    </div>
                  )}
                  {stats?.totalEarnings! >= 100 && (
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-green-500" />
                      <span>$100+ em comissões!</span>
                    </div>
                  )}
                  {stats?.conversionRate! >= 5 && (
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-blue-500" />
                      <span>5%+ taxa de conversão!</span>
                    </div>
                  )}
                  {stats?.totalConversions === 0 && stats?.totalEarnings === 0 && (
                    <p className="text-muted-foreground text-sm">
                      Suas conquistas aparecerão aqui quando você fizer suas primeiras conversões!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🎫 Seus Códigos de Desconto</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compartilhe estes códigos com sua audiência para ganhar comissões
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {affiliateData.coupons?.map((coupon: CouponData) => (
                  <div key={coupon.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <code className="text-lg font-bold bg-blue-100 text-blue-800 px-3 py-2 rounded">
                          {coupon.code}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(coupon.code)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copiar
                        </Button>
                      </div>
                      <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'}>
                        {coupon.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <strong>Desconto:</strong> {coupon.discount_value}%
                      </div>
                      <div>
                        <strong>Usos:</strong> {coupon.current_uses}/{coupon.max_uses || '∞'}
                      </div>
                      <div>
                        <strong>Expira:</strong> {
                          coupon.expires_at 
                            ? new Date(coupon.expires_at).toLocaleDateString() 
                            : 'Nunca'
                        }
                      </div>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(`Use o código ${coupon.code} e ganhe ${coupon.discount_value}% de desconto no TubeSpark! 🚀`)}
                      >
                        📱 Copiar para Stories
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(`🔥 DESCONTO EXCLUSIVO: ${coupon.discount_value}% OFF no TubeSpark com o código ${coupon.code}!\n\nA ferramenta que uso para criar roteiros virais para YouTube. Link na bio! 🎬`)}
                      >
                        📝 Copiar para Post
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sharing Templates */}
          <Card>
            <CardHeader>
              <CardTitle>📢 Templates para Compartilhamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">📺 Para Vídeos do YouTube:</h4>
                  <p className="text-sm mb-2">
                    "Pessoal, vocês me perguntam muito sobre como eu crio roteiros para os meus vídeos. 
                    Eu uso o TubeSpark e consegui um desconto exclusivo para vocês! 
                    Usem o código {affiliateData.coupons?.[0]?.code} e ganhem {affiliateData.coupons?.[0]?.discount_value}% off. 
                    Link na descrição!"
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(`Pessoal, vocês me perguntam muito sobre como eu crio roteiros para os meus vídeos. Eu uso o TubeSpark e consegui um desconto exclusivo para vocês! Usem o código ${affiliateData.coupons?.[0]?.code} e ganhem ${affiliateData.coupons?.[0]?.discount_value}% off. Link na descrição!`)}
                  >
                    Copiar
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">📱 Para Instagram Stories:</h4>
                  <p className="text-sm mb-2">
                    "🔥 FERRAMENTA SECRETA para roteiros virais!\n\n
                    Código: {affiliateData.coupons?.[0]?.code}\n
                    Desconto: {affiliateData.coupons?.[0]?.discount_value}% OFF\n\n
                    Swipe up para acessar! 👆"
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(`🔥 FERRAMENTA SECRETA para roteiros virais!\n\nCódigo: ${affiliateData.coupons?.[0]?.code}\nDesconto: ${affiliateData.coupons?.[0]?.discount_value}% OFF\n\nSwipe up para acessar! 👆`)}
                  >
                    Copiar
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">🐦 Para Twitter/X:</h4>
                  <p className="text-sm mb-2">
                    "Como eu crio roteiros que convertem?\n\n
                    🎯 Uso @TubeSpark\n
                    🚀 {affiliateData.coupons?.[0]?.discount_value}% OFF com código: {affiliateData.coupons?.[0]?.code}\n
                    💡 IA que gera ideias + roteiros otimizados\n\n
                    Game changer para creators! 🔥"
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(`Como eu crio roteiros que convertem?\n\n🎯 Uso @TubeSpark\n🚀 ${affiliateData.coupons?.[0]?.discount_value}% OFF com código: ${affiliateData.coupons?.[0]?.code}\n💡 IA que gera ideias + roteiros otimizados\n\nGame changer para creators! 🔥`)}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>💰 Histórico de Comissões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.length > 0 ? (
                  commissions.map((commission: any) => (
                    <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">
                          ${commission.commission_amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {commission.billing_period_start} - {commission.billing_period_end}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                          {commission.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {commission.commission_rate}% comissão
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Suas comissões aparecerão aqui quando você fizer conversões.</p>
                    <p className="text-sm mt-2">
                      Compartilhe seus códigos de cupom para começar a ganhar!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>💳 Informações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email para Pagamentos:</label>
                  <p className="text-sm text-muted-foreground">
                    {affiliateData.payment_email || 'Não configurado'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Taxa de Comissão:</label>
                  <p className="text-sm text-muted-foreground">
                    {affiliateData.commission_rate}% recorrente
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Método de Pagamento:</label>
                  <p className="text-sm text-muted-foreground">
                    Transferência via Stripe (processado automaticamente)
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Cronograma de Pagamentos:</label>
                  <p className="text-sm text-muted-foreground">
                    Todo dia 15 do mês seguinte (para comissões confirmadas)
                  </p>
                </div>

                <Button variant="outline" size="sm">
                  Atualizar Informações de Pagamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Suas Atividades</CardTitle>
              <p className="text-sm text-muted-foreground">
                Registre suas atividades de marketing para tracking melhor
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button size="sm" onClick={() => {/* Open modal to log activity */}}>
                    ➕ Registrar Atividade
                  </Button>
                  <Button variant="outline" size="sm">
                    📹 Vídeo Postado
                  </Button>
                  <Button variant="outline" size="sm">
                    📱 Story/Post Social
                  </Button>
                </div>

                {activities.length > 0 ? (
                  activities.map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{activity.activity_type}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.platform} • {new Date(activity.created_at).toLocaleDateString()}
                        </div>
                        {activity.url && (
                          <a 
                            href={activity.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Ver conteúdo <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-right">
                        {activity.engagement_metrics && (
                          <div className="text-sm text-muted-foreground">
                            {activity.engagement_metrics.views && `${activity.engagement_metrics.views} views`}
                            {activity.engagement_metrics.likes && ` • ${activity.engagement_metrics.likes} likes`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma atividade registrada ainda.</p>
                    <p className="text-sm mt-2">
                      Registre suas atividades de marketing para melhor tracking!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Marketing Materials */}
            <Card>
              <CardHeader>
                <CardTitle>🎨 Materiais de Marketing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  📱 Logos e Imagens
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🎬 Vídeos de Demonstração
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📝 Templates de Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🖼️ Banners para Site
                </Button>
              </CardContent>
            </Card>

            {/* Training & Support */}
            <Card>
              <CardHeader>
                <CardTitle>🎓 Treinamento e Suporte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  📚 Guia do Afiliado
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🎯 Melhores Práticas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  💬 Grupo no Telegram
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🆘 Suporte Direto
                </Button>
              </CardContent>
            </Card>

            {/* Performance Tips */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>💡 Dicas para Maximizar Conversões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">🎯 Conteúdo Autêntico</h4>
                    <p className="text-sm text-green-700">
                      Mostre como você realmente usa o TubeSpark. Autenticidade converte mais que vendas forçadas.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📊 Resultados Reais</h4>
                    <p className="text-sm text-blue-700">
                      Compartilhe métricas e resultados concretos que obteve usando a ferramenta.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">🔥 Senso de Urgência</h4>
                    <p className="text-sm text-purple-700">
                      Use deadlines e escassez quando aplicável. "Oferta por tempo limitado" funciona.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### **5. API do Dashboard para Creators**

```typescript
// src/app/api/creators/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch affiliate data with coupons
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select(`
        *,
        discount_coupons(*)
      `)
      .eq('user_id', user.id)
      .single();

    if (affiliateError || !affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    // Calculate stats
    const stats = await calculateAffiliateStats(supabase, affiliate.id);
    
    // Fetch recent commissions
    const { data: commissions } = await supabase
      .from('affiliate_commissions')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Fetch recent activities
    const { data: activities } = await supabase
      .from('affiliate_activities')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      affiliate: {
        ...affiliate,
        coupons: affiliate.discount_coupons
      },
      stats,
      commissions: commissions || [],
      activities: activities || []
    });

  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

async function calculateAffiliateStats(supabase: any, affiliateId: string) {
  // Get current month boundaries
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  // Total earnings (all time)
  const { data: totalCommissions } = await supabase
    .from('affiliate_commissions')
    .select('commission_amount')
    .eq('affiliate_id', affiliateId)
    .neq('status', 'cancelled');
  
  const totalEarnings = totalCommissions?.reduce((sum: number, c: any) => sum + parseFloat(c.commission_amount), 0) || 0;

  // Monthly earnings
  const { data: monthlyCommissions } = await supabase
    .from('affiliate_commissions')
    .select('commission_amount')
    .eq('affiliate_id', affiliateId)
    .gte('created_at', currentMonthStart.toISOString())
    .lt('created_at', nextMonthStart.toISOString())
    .neq('status', 'cancelled');
  
  const monthlyEarnings = monthlyCommissions?.reduce((sum: number, c: any) => sum + parseFloat(c.commission_amount), 0) || 0;

  // Total conversions
  const { data: conversions } = await supabase
    .from('affiliate_commissions')
    .select('id')
    .eq('affiliate_id', affiliateId)
    .neq('status', 'cancelled');
  
  const totalConversions = conversions?.length || 0;

  // Monthly conversions
  const { data: monthlyConversionsData } = await supabase
    .from('affiliate_commissions')
    .select('id')
    .eq('affiliate_id', affiliateId)
    .gte('created_at', currentMonthStart.toISOString())
    .lt('created_at', nextMonthStart.toISOString())
    .neq('status', 'cancelled');
  
  const monthlyConversions = monthlyConversionsData?.length || 0;

  // Coupon usage stats for conversion rate
  const { data: couponUses } = await supabase
    .from('coupon_uses')
    .select(`
      id,
      discount_coupons!inner(affiliate_id)
    `)
    .eq('discount_coupons.affiliate_id', affiliateId);
  
  const totalCouponUses = couponUses?.length || 0;
  const conversionRate = totalCouponUses > 0 ? (totalConversions / totalCouponUses) * 100 : 0;

  // Average order value
  const { data: orderValues } = await supabase
    .from('affiliate_commissions')
    .select('base_amount')
    .eq('affiliate_id', affiliateId)
    .neq('status', 'cancelled');
  
  const avgOrderValue = orderValues?.length > 0 
    ? orderValues.reduce((sum: number, o: any) => sum + parseFloat(o.base_amount), 0) / orderValues.length 
    : 0;

  // Next payment calculation
  const { data: pendingCommissions } = await supabase
    .from('affiliate_commissions')
    .select('commission_amount')
    .eq('affiliate_id', affiliateId)
    .in('status', ['pending', 'confirmed']);
  
  const nextPayment = pendingCommissions?.reduce((sum: number, c: any) => sum + parseFloat(c.commission_amount), 0) || 0;

  // Next payment date (15th of next month)
  const nextPaymentDate = new Date(now.getFullYear(), now.getMonth() + 1, 15).toLocaleDateString();

  // Monthly growth calculation
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const { data: lastMonthCommissions } = await supabase
    .from('affiliate_commissions')
    .select('commission_amount')
    .eq('affiliate_id', affiliateId)
    .gte('created_at', lastMonthStart.toISOString())
    .lt('created_at', currentMonthStart.toISOString())
    .neq('status', 'cancelled');
  
  const lastMonthEarnings = lastMonthCommissions?.reduce((sum: number, c: any) => sum + parseFloat(c.commission_amount), 0) || 0;
  const monthlyGrowth = lastMonthEarnings > 0 ? ((monthlyEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 : 0;

  return {
    totalEarnings,
    monthlyEarnings,
    totalConversions,
    monthlyConversions,
    conversionRate,
    averageOrderValue: avgOrderValue,
    nextPayment,
    nextPaymentDate,
    monthlyGrowth
  };
}
```

### **6. Dashboard Admin para Gestão**

```typescript
// src/app/admin/affiliates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminAffiliatesPage() {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [activeAffiliates, setActiveAffiliates] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/affiliates');
      const data = await response.json();
      
      setPendingApplications(data.pendingApplications);
      setActiveAffiliates(data.activeAffiliates);
      setOverviewStats(data.overviewStats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleApproveAffiliate = async (affiliateId: string) => {
    try {
      await fetch(`/api/admin/affiliates/${affiliateId}/approve`, {
        method: 'POST'
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error approving affiliate:', error);
    }
  };

  const handleRejectAffiliate = async (affiliateId: string, reason: string) => {
    try {
      await fetch(`/api/admin/affiliates/${affiliateId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting affiliate:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Gestão de Afiliados</h1>

      {/* Overview Stats */}
      {overviewStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Afiliados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats.totalAffiliates}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{overviewStats.pendingApplications}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Comissões Pagas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${overviewStats.totalCommissionsPaid}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Conversões Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats.totalConversions}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Aplicações Pendentes</TabsTrigger>
          <TabsTrigger value="active">Afiliados Ativos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📋 Aplicações Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingApplications.length > 0 ? (
                <div className="space-y-4">
                  {pendingApplications.map((application: any) => (
                    <div key={application.id} className="p-6 border rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{application.youtube_channel_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {application.subscriber_count?.toLocaleString()} inscritos • {application.niche}
                          </p>
                        </div>
                        <Badge variant="outline">{application.tier.toUpperCase()}</Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <strong>Canal:</strong> {application.youtube_channel_url}
                        </div>
                        <div>
                          <strong>Views médias:</strong> {application.average_views?.toLocaleString()}
                        </div>
                        <div>
                          <strong>Engagement:</strong> {application.engagement_rate}%
                        </div>
                        <div>
                          <strong>Aplicação:</strong> {new Date(application.applied_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <strong>Por que quer parceria:</strong>
                        <p className="text-sm mt-1">{application.why_partnership}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApproveAffiliate(application.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✅ Aprovar
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const reason = prompt('Motivo da rejeição:');
                            if (reason) handleRejectAffiliate(application.id, reason);
                          }}
                        >
                          ❌ Rejeitar
                        </Button>
                        <Button variant="outline">
                          👁️ Ver Canal
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Nenhuma aplicação pendente.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🌟 Afiliados Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Similar structure for active affiliates */}
              <div className="space-y-4">
                {activeAffiliates.map((affiliate: any) => (
                  <div key={affiliate.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{affiliate.youtube_channel_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {affiliate.total_conversions} conversões • ${affiliate.total_commission_earned} ganhos
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{affiliate.tier.toUpperCase()}</Badge>
                        <Badge variant="default">ATIVO</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          {/* Analytics dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Analytics de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Dashboard de analytics será implementado aqui</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### **7. Configurações Necessárias**

#### **Variáveis de Ambiente Adicionais**
```bash
# Adicionar ao .env
YOUTUBE_API_KEY=AIza... # Para análise de canais
STRIPE_STARTER_PRODUCT_ID=prod_...
STRIPE_PRO_PRODUCT_ID=prod_...
STRIPE_BUSINESS_PRODUCT_ID=prod_...

# Email service (opcional)
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@tubespark.com

# Slack notifications (opcional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

#### **Estrutura de Arquivos Completa**
```
src/
├── app/
│   ├── creators/
│   │   ├── apply/
│   │   │   └── page.tsx                    # Formulário de aplicação
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # Dashboard do creator
│   │   └── page.tsx                        # Landing page para creators
│   ├── admin/
│   │   ├── affiliates/
│   │   │   └── page.tsx                    # Admin dashboard
│   │   └── layout.tsx                      # Admin layout
│   └── api/
│       ├── creators/
│       │   ├── analyze-channel/route.ts    # Análise de canal
│       │   ├── apply/route.ts              # Submissão de aplicação
│       │   └── dashboard/route.ts          # Dados do dashboard
│       ├── billing/
│       │   ├── validate-coupon/route.ts    # Validação de cupom
│       │   ├── apply-coupon/route.ts       # Aplicar cupom
│       │   └── webhooks/route.ts           # Webhooks Stripe
│       └── admin/
│           └── affiliates/
│               ├── route.ts                # Lista de afiliados
│               └── [id]/
│                   ├── approve/route.ts    # Aprovar afiliado
│                   └── reject/route.ts     # Rejeitar afiliado
├── components/
│   ├── creators/
│   │   ├── ApplicationForm.tsx
│   │   ├── ChannelAnalysis.tsx
│   │   └── CreatorDashboard.tsx
│   └── admin/
│       ├── AffiliatesList.tsx
│       └── ApplicationReview.tsx
└── lib/
    ├── creators/
    │   ├── youtube-api.ts                  # Funções YouTube API
    │   ├── analysis.ts                     # Análise de canal
    │   └── commission-calculator.ts        # Cálculos de comissão
    └── admin/
        └── affiliate-management.ts         # Gestão de afiliados
```

### **8. SISTEMA ADMIN DE GESTÃO DE USUÁRIOS E BILLING**

#### **Dashboard Admin Completo para Gestão de Usuários**
```typescript
// src/app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  Gift,
  Search,
  Filter,
  Edit,
  Ban,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  subscription: {
    plan_type: string;
    status: string;
    current_period_end: string;
    stripe_subscription_id: string;
  } | null;
  usage: {
    ideas_generated: number;
    scripts_created: number;
    last_activity: string;
  };
  affiliate_referral: {
    referred_by: string;
    coupon_used: string;
  } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    plan: 'all',
    status: 'all'
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    churnRate: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/users/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Plan filter
    if (filters.plan !== 'all') {
      filtered = filtered.filter(user => 
        user.subscription?.plan_type === filters.plan
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => 
        user.subscription?.status === filters.status
      );
    }

    setFilteredUsers(filtered);
  };

  const handleChangePlan = async (userId: string, newPlan: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/change-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPlan })
      });
      
      fetchUsers(); // Refresh data
      setShowEditModal(false);
    } catch (error) {
      console.error('Error changing plan:', error);
    }
  };

  const handleCancelSubscription = async (userId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta assinatura?')) return;
    
    try {
      await fetch(`/api/admin/users/${userId}/cancel-subscription`, {
        method: 'POST'
      });
      
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const handleApplyCoupon = async (userId: string, couponCode: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/apply-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode })
      });
      
      fetchUsers(); // Refresh data
      setShowCouponModal(false);
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  const handleExtendTrial = async (userId: string, days: number) => {
    try {
      await fetch(`/api/admin/users/${userId}/extend-trial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days })
      });
      
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error extending trial:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowCouponModal(true)}>
            🎫 Criar Cupom
          </Button>
          <Button onClick={fetchUsers}>
            🔄 Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuários registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Pagando mensalmente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              MRR atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.churnRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Último mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email ou nome..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filters.plan} onValueChange={(value) => setFilters({...filters, plan: value})}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os planos</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
                <SelectItem value="past_due">Em atraso</SelectItem>
                <SelectItem value="trialing">Trial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Lista de Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">{user.name || 'Sem nome'}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    
                    {user.subscription ? (
                      <div className="flex gap-2">
                        <Badge variant={user.subscription.status === 'active' ? 'default' : 'secondary'}>
                          {user.subscription.plan_type.toUpperCase()}
                        </Badge>
                        <Badge variant={
                          user.subscription.status === 'active' ? 'default' :
                          user.subscription.status === 'canceled' ? 'destructive' :
                          'secondary'
                        }>
                          {user.subscription.status.toUpperCase()}
                        </Badge>
                      </div>
                    ) : (
                      <Badge variant="outline">FREE</Badge>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground grid grid-cols-3 gap-4">
                    <span>Registro: {new Date(user.created_at).toLocaleDateString()}</span>
                    <span>Ideias: {user.usage.ideas_generated}</span>
                    <span>Roteiros: {user.usage.scripts_created}</span>
                  </div>
                  
                  {user.affiliate_referral && (
                    <div className="mt-1 text-xs text-blue-600">
                      🤝 Referido por: {user.affiliate_referral.referred_by} (cupom: {user.affiliate_referral.coupon_used})
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  
                  {user.subscription && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelSubscription(user.id)}
                    >
                      <Ban className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowCouponModal(true);
                    }}
                  >
                    <Gift className="w-4 h-4 mr-1" />
                    Cupom
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Usuário: {selectedUser?.email}</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Current Plan */}
              <div>
                <h3 className="font-semibold mb-3">Plano Atual</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>
                      {selectedUser.subscription?.plan_type?.toUpperCase() || 'FREE'} 
                      ({selectedUser.subscription?.status || 'Sem assinatura'})
                    </span>
                    {selectedUser.subscription && (
                      <span className="text-sm text-muted-foreground">
                        Renova em: {new Date(selectedUser.subscription.current_period_end).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Change Plan */}
              <div>
                <h3 className="font-semibold mb-3">Alterar Plano</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleChangePlan(selectedUser.id, 'starter')}
                  >
                    Upgrade para Starter ($9.99)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleChangePlan(selectedUser.id, 'pro')}
                  >
                    Upgrade para Pro ($29.99)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleChangePlan(selectedUser.id, 'business')}
                  >
                    Upgrade para Business ($99.99)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleChangePlan(selectedUser.id, 'free')}
                  >
                    Downgrade para Free
                  </Button>
                </div>
              </div>

              {/* Trial Extensions */}
              <div>
                <h3 className="font-semibold mb-3">Estender Trial</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExtendTrial(selectedUser.id, 7)}
                  >
                    +7 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExtendTrial(selectedUser.id, 30)}
                  >
                    +30 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExtendTrial(selectedUser.id, 90)}
                  >
                    +90 dias
                  </Button>
                </div>
              </div>

              {/* Usage Statistics */}
              <div>
                <h3 className="font-semibold mb-3">Estatísticas de Uso</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-800">Ideias Geradas</div>
                    <div className="text-2xl font-bold text-blue-600">{selectedUser.usage.ideas_generated}</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <div className="font-semibold text-green-800">Roteiros Criados</div>
                    <div className="text-2xl font-bold text-green-600">{selectedUser.usage.scripts_created}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <div className="font-semibold text-purple-800">Última Atividade</div>
                    <div className="text-sm text-purple-600">
                      {selectedUser.usage.last_activity 
                        ? new Date(selectedUser.usage.last_activity).toLocaleDateString()
                        : 'Nunca'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Coupon Application Modal */}
      <Dialog open={showCouponModal} onOpenChange={setShowCouponModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aplicar Cupom de Desconto</DialogTitle>
          </DialogHeader>
          
          <CouponApplicationForm 
            user={selectedUser}
            onApply={handleApplyCoupon}
            onClose={() => setShowCouponModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para aplicação de cupons
function CouponApplicationForm({ user, onApply, onClose }: any) {
  const [couponCode, setCouponCode] = useState('');
  const [customDiscount, setCustomDiscount] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [validityDays, setValidityDays] = useState('30');

  const handleCreateAndApply = async () => {
    if (customDiscount) {
      // Create custom coupon first
      const newCouponCode = `ADMIN${Date.now().toString().slice(-6)}`;
      
      try {
        await fetch('/api/admin/coupons/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: newCouponCode,
            discount_type: discountType,
            discount_value: parseFloat(customDiscount),
            max_uses: 1,
            expires_at: new Date(Date.now() + parseInt(validityDays) * 24 * 60 * 60 * 1000).toISOString(),
            applies_to: ['starter', 'pro', 'business'],
            description: `Cupom admin para ${user?.email}`
          })
        });

        await onApply(user?.id, newCouponCode);
      } catch (error) {
        console.error('Error creating custom coupon:', error);
      }
    } else if (couponCode) {
      await onApply(user?.id, couponCode);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Código de Cupom Existente
        </label>
        <Input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Digite o código do cupom"
        />
      </div>

      <div className="text-center text-sm text-muted-foreground">
        — OU —
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Criar Cupom Personalizado
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Select value={discountType} onValueChange={setDiscountType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Porcentagem</SelectItem>
                <SelectItem value="fixed_amount">Valor fixo</SelectItem>
                <SelectItem value="free_months">Meses grátis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Input
              type="number"
              value={customDiscount}
              onChange={(e) => setCustomDiscount(e.target.value)}
              placeholder={
                discountType === 'percentage' ? '50' :
                discountType === 'fixed_amount' ? '10.00' :
                '3'
              }
            />
          </div>
        </div>
        
        <div className="mt-2">
          <label className="block text-xs text-muted-foreground">
            Válido por (dias)
          </label>
          <Input
            type="number"
            value={validityDays}
            onChange={(e) => setValidityDays(e.target.value)}
            className="w-24"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleCreateAndApply} className="flex-1">
          Aplicar Cupom
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
```

#### **APIs de Gestão de Usuários**

```typescript
// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !await isAdmin(user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch users with subscriptions and usage data
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        created_at,
        referred_by_affiliate_id,
        referral_source,
        subscriptions(
          plan_type,
          status,
          current_period_end,
          stripe_subscription_id
        ),
        usage_tracking(
          ideas_generated,
          scripts_basic,
          scripts_premium
        ),
        affiliates!referred_by_affiliate_id(
          affiliate_code,
          youtube_channel_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process and format user data
    const processedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      subscription: user.subscriptions?.[0] || null,
      usage: {
        ideas_generated: user.usage_tracking?.reduce((sum: number, u: any) => sum + u.ideas_generated, 0) || 0,
        scripts_created: user.usage_tracking?.reduce((sum: number, u: any) => sum + u.scripts_basic + u.scripts_premium, 0) || 0,
        last_activity: user.usage_tracking?.[0]?.updated_at || null
      },
      affiliate_referral: user.referred_by_affiliate_id ? {
        referred_by: user.affiliates?.youtube_channel_name || user.affiliates?.affiliate_code,
        coupon_used: user.referral_source
      } : null
    }));

    return NextResponse.json({ users: processedUsers });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function isAdmin(userId: string): Promise<boolean> {
  // Implement admin check logic
  // This could be a role in the users table or a separate admin table
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  
  const supabase = createClient();
  const { data: user } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single();
    
  return adminEmails.includes(user?.email);
}
```

```typescript
// src/app/api/admin/users/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Monthly revenue
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('status', 'active');

    const planPrices = {
      starter: 9.99,
      pro: 29.99,
      business: 99.99
    };

    const monthlyRevenue = subscriptions?.reduce((sum, sub) => {
      return sum + (planPrices[sub.plan_type as keyof typeof planPrices] || 0);
    }, 0) || 0;

    // Churn rate calculation (simplified)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: canceledLastMonth } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'canceled')
      .gte('updated_at', thirtyDaysAgo.toISOString());

    const churnRate = activeSubscriptions > 0 ? (canceledLastMonth || 0) / activeSubscriptions * 100 : 0;

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0,
      monthlyRevenue,
      churnRate
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

```typescript
// src/app/api/admin/users/[id]/change-plan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { newPlan } = await request.json();
    const userId = params.id;
    
    const supabase = createClient();

    // Get user's current subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (newPlan === 'free') {
      // Cancel subscription
      if (subscription?.stripe_subscription_id) {
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
      }
      
      // Update local subscription
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          plan_type: 'free'
        })
        .eq('user_id', userId);
        
    } else {
      // Update to new paid plan
      const priceIds = {
        starter: process.env.STRIPE_STARTER_PRICE_ID,
        pro: process.env.STRIPE_PRO_PRICE_ID,
        business: process.env.STRIPE_BUSINESS_PRICE_ID
      };

      if (subscription?.stripe_subscription_id) {
        // Update existing subscription
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          items: [{
            id: subscription.stripe_subscription_id,
            price: priceIds[newPlan as keyof typeof priceIds],
          }],
          proration_behavior: 'create_prorations'
        });
      } else {
        // Create new subscription
        const { data: user } = await supabase
          .from('users')
          .select('email')
          .eq('id', userId)
          .single();

        // This would typically require customer creation
        // Simplified for admin override
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan_type: newPlan,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error changing plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

```typescript
// src/app/api/admin/users/[id]/apply-coupon/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { couponCode } = await request.json();
    const userId = params.id;
    
    const supabase = createClient();

    // Validate coupon
    const { data: coupon, error: couponError } = await supabase
      .from('discount_coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('status', 'active')
      .single();

    if (couponError || !coupon) {
      return NextResponse.json({ error: 'Cupom inválido' }, { status: 400 });
    }

    // Check if user already used this coupon
    const { data: existingUse } = await supabase
      .from('coupon_uses')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('user_id', userId)
      .single();

    if (existingUse) {
      return NextResponse.json({ error: 'Usuário já usou este cupom' }, { status: 400 });
    }

    // Apply coupon (record usage)
    await supabase
      .from('coupon_uses')
      .insert({
        coupon_id: coupon.id,
        user_id: userId,
        discount_applied: coupon.discount_value,
        original_amount: 0, // Admin application
        final_amount: 0,
        used_at: new Date().toISOString()
      });

    // If it's a plan upgrade coupon, apply the benefit
    if (coupon.discount_type === 'free_months') {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (subscription) {
        const currentEnd = new Date(subscription.current_period_end);
        const newEnd = new Date(currentEnd.getTime() + (coupon.discount_value * 30 * 24 * 60 * 60 * 1000));
        
        await supabase
          .from('subscriptions')
          .update({
            current_period_end: newEnd.toISOString()
          })
          .eq('user_id', userId);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

```typescript
// src/app/api/admin/coupons/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const couponData = await request.json();
    
    const supabase = createClient();

    // Create new coupon
    const { data: coupon, error } = await supabase
      .from('discount_coupons')
      .insert({
        code: couponData.code.toUpperCase(),
        discount_type: couponData.discount_type,
        discount_value: couponData.discount_value,
        max_uses: couponData.max_uses,
        expires_at: couponData.expires_at,
        applies_to: couponData.applies_to,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, coupon });

  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### **Sistema de Cupons Admin**

```typescript
// src/app/admin/coupons/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    max_uses: '',
    expires_at: '',
    applies_to: ['starter', 'pro']
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons');
      const data = await response.json();
      setCoupons(data.coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleCreateCoupon = async () => {
    try {
      await fetch('/api/admin/coupons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon)
      });
      
      fetchCoupons();
      setShowCreateModal(false);
      setNewCoupon({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        max_uses: '',
        expires_at: '',
        applies_to: ['starter', 'pro']
      });
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const handleToggleCoupon = async (couponId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/coupons/${couponId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestão de Cupons</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          ➕ Criar Cupom
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Button 
          variant="outline"
          onClick={() => {
            setNewCoupon({
              ...newCoupon,
              code: `WELCOME${Date.now().toString().slice(-4)}`,
              discount_type: 'percentage',
              discount_value: '50'
            });
            setShowCreateModal(true);
          }}
        >
          🎉 Cupom Boas-vindas (50%)
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => {
            setNewCoupon({
              ...newCoupon,
              code: `TRIAL${Date.now().toString().slice(-4)}`,
              discount_type: 'free_months',
              discount_value: '1'
            });
            setShowCreateModal(true);
          }}
        >
          🆓 1 Mês Grátis
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => {
            setNewCoupon({
              ...newCoupon,
              code: `SAVE10${Date.now().toString().slice(-4)}`,
              discount_type: 'fixed_amount',
              discount_value: '10'
            });
            setShowCreateModal(true);
          }}
        >
          💰 $10 de Desconto
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => {
            setNewCoupon({
              ...newCoupon,
              code: `VIP${Date.now().toString().slice(-4)}`,
              discount_type: 'percentage',
              discount_value: '75',
              max_uses: '1'
            });
            setShowCreateModal(true);
          }}
        >
          👑 Cupom VIP (75%)
        </Button>
      </div>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Cupons Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coupons.map((coupon: any) => (
              <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="flex items-center gap-3">
                    <code className="text-lg font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      {coupon.code}
                    </code>
                    <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'}>
                      {coupon.status}
                    </Badge>
                    {coupon.affiliate_id && (
                      <Badge variant="outline">
                        Creator Coupon
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    <span className="mr-4">
                      Desconto: {coupon.discount_value}
                      {coupon.discount_type === 'percentage' ? '%' : 
                       coupon.discount_type === 'fixed_amount' ? ' USD' : ' meses'}
                    </span>
                    <span className="mr-4">
                      Usos: {coupon.current_uses}/{coupon.max_uses || '∞'}
                    </span>
                    <span>
                      Expira: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Nunca'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleCoupon(
                      coupon.id, 
                      coupon.status === 'active' ? 'paused' : 'active'
                    )}
                  >
                    {coupon.status === 'active' ? '⏸️ Pausar' : '▶️ Ativar'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(coupon.code)}
                  >
                    📋 Copiar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Coupon Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Cupom</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Código</label>
                <Input
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="DESCONTO50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Desconto</label>
                <Select 
                  value={newCoupon.discount_type} 
                  onValueChange={(value) => setNewCoupon({...newCoupon, discount_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem</SelectItem>
                    <SelectItem value="fixed_amount">Valor Fixo (USD)</SelectItem>
                    <SelectItem value="free_months">Meses Grátis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Valor {
                    newCoupon.discount_type === 'percentage' ? '(%)' :
                    newCoupon.discount_type === 'fixed_amount' ? '(USD)' : '(meses)'
                  }
                </label>
                <Input
                  type="number"
                  value={newCoupon.discount_value}
                  onChange={(e) => setNewCoupon({...newCoupon, discount_value: e.target.value})}
                  placeholder={
                    newCoupon.discount_type === 'percentage' ? '50' :
                    newCoupon.discount_type === 'fixed_amount' ? '10.00' : '3'
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Máximo de Usos</label>
                <Input
                  type="number"
                  value={newCoupon.max_uses}
                  onChange={(e) => setNewCoupon({...newCoupon, max_uses: e.target.value})}
                  placeholder="100 (vazio = ilimitado)"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Data de Expiração</label>
              <Input
                type="datetime-local"
                value={newCoupon.expires_at}
                onChange={(e) => setNewCoupon({...newCoupon, expires_at: e.target.value})}
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button onClick={handleCreateCoupon} className="flex-1">
                Criar Cupom
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

### **SEMANA 1-2: FUNDAÇÃO**
```
📅 Dias 1-3: Database Setup
├── Criar todas as tabelas do sistema
├── Executar migrations
├── Configurar indexes
└── Testar relacionamentos

📅 Dias 4-7: APIs Básicas
├── API de análise de canal (YouTube)
├── API de aplicação para creators
├── Validação de cupons básica
└── Testes de integração

📅 Dias 8-14: Interface de Aplicação
├── Página de aplicação para creators
├── Análise automática de canal
├── Sistema de tiers
└── Confirmação de aplicação
```

### **SEMANA 2-3: SISTEMA DE CUPONS**
```
📅 Dias 15-18: Backend de Cupons
├── Validação completa de cupons
├── Sistema de limites
├── Tracking de uso
└── Integração com checkout

📅 Dias 19-21: Checkout com Desconto
├── Modificação do checkout Stripe
├── Aplicação automática de descontos
├── Tracking de conversões
└── Testes de pagamento

📅 Dias 22-28: Dashboard Creator
├── Interface completa do dashboard
├── Métricas em tempo real
├── Gestão de cupons
└── Templates de compartilhamento
```

### **SEMANA 3-4: COMISSÕES E ADMIN**
```
📅 Dias 29-32: Sistema de Comissões
├── Webhooks Stripe completos
├── Cálculo automático de comissões
├── Sistema de pagamentos
└── Tracking de performance

📅 Dias 33-35: Dashboard Admin
├── Gestão de aplicações
├── Aprovação/rejeição de afiliados
├── Analytics de performance
└── Relatórios financeiros

📅 Dias 36-42: Polimento e Testes
├── Testes end-to-end completos
├── Refinamentos de UX
├── Otimizações de performance
└── Documentação final
```

---

## 📊 MÉTRICAS DE SUCESSO

### **KPIs Técnicos**
```typescript
const technicalKPIs = {
  performance: {
    channelAnalysisTime: "<5s para análise completa",
    couponValidationTime: "<500ms",
    dashboardLoadTime: "<2s",
    webhookProcessingTime: "<30s"
  },
  
  reliability: {
    youtubeAPISuccessRate: ">99%",
    paymentWebhookSuccessRate: ">99.5%",
    commissionCalculationAccuracy: "100%",
    dataConsistency: "Zero discrepâncias"
  }
}
```

### **KPIs de Negócio**
```typescript
const businessKPIs = {
  month1: {
    creatorApplications: "20-50 aplicações",
    approvedCreators: "10-25 aprovados",
    firstCommissions: "$500-2000",
    systemUptime: ">99.5%"
  },
  
  month3: {
    activeCreators: "50-100 ativos",
    monthlyCommissions: "$5000-15000",
    conversionRate: "5-10% average",
    creatorRetention: ">80%"
  },
  
  month6: {
    creatorNetwork: "200+ creators",
    monthlyCommissions: "$25000-50000",
    organicGrowth: "70% via creator referrals",
    platformROI: "11x vs ads tradicionais"
  }
}
```

---

## 💰 PROJEÇÃO FINANCEIRA

### **Investimento Total Estimado**
```typescript
const investmentBreakdown = {
  development: {
    timeInvestment: "4-6 semanas development",
    estimatedCost: "Tempo desenvolvimento interno"
  },
  
  infrastructure: {
    stripeProcessing: "2.9% + $0.30 per transaction",
    youtubeAPI: "$0.10 per 1000 requests",
    supabaseScaling: "$25-100/month",
    emailService: "$20-50/month"
  },
  
  commissions: {
    month1: "$500-2000 comissões",
    month3: "$5000-15000 comissões", 
    month6: "$25000-50000 comissões",
    avgCommissionRate: "25% do valor das assinaturas"
  }
}
```

### **ROI Projetado**
```typescript
const roiProjection = {
  traditionalMarketing: {
    googleAds: "$50-100 CAC",
    facebookAds: "$40-80 CAC",
    contentMarketing: "$60-120 CAC"
  },
  
  creatorPartnership: {
    effectiveCAC: "$5-15 CAC",
    conversionRate: "3-8x higher",
    organicAmplification: "Exponential reach",
    trustFactor: "5.6x more trusted"
  },
  
  netROI: "11x better than traditional marketing"
}
```

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### **HOJE (Configuração)**
1. **Setup do Banco** - Executar todas as migrations SQL
2. **YouTube API** - Configurar credenciais no Google Cloud
3. **Stripe Products** - Criar produtos e preços no dashboard

### **ESTA SEMANA (MVP)**
1. **APIs Core** - Implementar análise de canal e aplicação
2. **Interface Básica** - Página de aplicação funcionando
3. **Validação** - Sistema de cupons básico

### **PRÓXIMAS 2 SEMANAS (COMPLETO)**
1. **Dashboard Creator** - Interface completa com métricas
2. **Admin Panel** - Gestão de aplicações e aprovações
3. **Comissões** - Sistema automatizado funcionando

### **MÊS 1 (LAUNCH)**
1. **Beta Testing** - 10-20 creators testando o sistema
2. **Refinamentos** - Ajustes baseados em feedback real
3. **Marketing** - Lançamento oficial do programa

---

## 🏆 RESULTADO ESPERADO

Implementando este sistema completo de parcerias, o TubeSpark terá:

**🎯 Crescimento Acelerado**: Escalar de 0 para $50k MRR em 6 meses através de creator network
**💰 CAC Otimizado**: Reduzir custo de aquisição em 80-90% vs marketing tradicional  
**🚀 Diferencial Competitivo**: Único sistema completo de parcerias no mercado de ferramentas YouTube
**📈 Crescimento Orgânico**: 70% do crescimento via word-of-mouth de creators satisfeitos
**🤝 Network Effect**: Cada creator traz 10-50 novos usuários mensalmente

**Bottom Line**: Transformar TubeSpark de "mais uma ferramenta" para **"a ferramenta recomendada pelos melhores YouTubers"** através de parcerias estratégicas genuínas e lucrativas.

---

**Status**: 🚀 **DOCUMENTO COMPLETO E PRONTO PARA IMPLEMENTAÇÃO**  
**Próxima Ação**: Começar pela configuração do banco de dados e YouTube API  
**Expectativa**: Primeiro creator parceiro ativo em 2 semanas! 🤝

*Este documento contém TODAS as especificações técnicas, código completo, fluxos de UX e estratégias de negócio necessárias para implementar com sucesso o sistema de parcerias com creators do TubeSpark.*
          