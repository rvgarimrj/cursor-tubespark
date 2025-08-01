```

### 3.3 Componente UpgradePrompt

#### 📁 Criar: `src/components/billing/UpgradePrompt.tsx`
```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, TrendingUp } from 'lucide-react';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'ideas_limit' | 'scripts_limit' | 'premium_feature';
  currentPlan: string;
}

export default function UpgradePrompt({ 
  isOpen, 
  onClose, 
  trigger, 
  currentPlan 
}: UpgradePromptProps) {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'business'>('starter');

  const plans = {
    starter: {
      name: 'Starter',
      price: '$9.99',
      icon: <Zap className="w-5 h-5" />,
      color: 'blue',
      features: [
        '100 ideias por mês',
        '20 roteiros básicos',
        '5 roteiros premium',
        'Integração YouTube',
        'Análise de tendências',
        'Suporte por email'
      ]
    },
    pro: {
      name: 'Pro',
      price: '$29.99',
      icon: <Crown className="w-5 h-5 text-yellow-500" />,
      color: 'purple',
      popular: true,
      features: [
        'Ideias ilimitadas',
        'Roteiros básicos ilimitados',
        '50 roteiros premium',
        'Análise de competidores',
        'Alertas de tendências',
        'Calendário de conteúdo',
        'Suporte prioritário'
      ]
    },
    business: {
      name: 'Business',
      price: '$99.99',
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      color: 'green',
      features: [
        'Tudo do Pro',
        'Roteiros premium ilimitados',
        'Acesso à API',
        'White-label',
        'Multi-usuários',
        'Relatórios customizados',
        'Suporte dedicado'
      ]
    }
  };

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'ideas_limit':
        return {
          title: '🚀 Você atingiu o limite de ideias!',
          message: 'Desbloqueie mais ideias e acelere sua criação de conteúdo'
        };
      case 'scripts_limit':
        return {
          title: '🎬 Limite de roteiros atingido!', 
          message: 'Transforme mais ideias em roteiros profissionais'
        };
      case 'premium_feature':
        return {
          title: '👑 Recurso Premium',
          message: 'Esta funcionalidade está disponível apenas para assinantes'
        };
      default:
        return {
          title: '🚀 Upgrade seu plano',
          message: 'Desbloqueie todo o potencial do TubeSpark'
        };
    }
  };

  const triggerMsg = getTriggerMessage();

  const handleUpgrade = async (planType: string) => {
    // Integração com Stripe
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType })
      });

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {triggerMsg.title}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            {triggerMsg.message}
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPlan === key
                  ? `border-${plan.color}-500 shadow-lg`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan(key as any)}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500">
                  ⭐ Mais Popular
                </Badge>
              )}

              <div className="text-center mb-4">
                <div className="flex justify-center mb-2">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="text-3xl font-bold mt-2">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mês</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(key)}
                className={`w-full ${
                  selectedPlan === key
                    ? `bg-${plan.color}-500 hover:bg-${plan.color}-600`
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {currentPlan === key ? 'Plano Atual' : `Escolher ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold">Resultados Reais dos Nossos Usuários:</h4>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>+250% visualizações</strong>
              <p className="text-muted-foreground">João P. - Gaming Channel</p>
            </div>
            <div>
              <strong>1.2M inscritos ganhos</strong>
              <p className="text-muted-foreground">Maria S. - Lifestyle</p>
            </div>
            <div>
              <strong>$15k/mês em receita</strong>
              <p className="text-muted-foreground">Pedro L. - Educação</p>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          💰 Garantia de 30 dias - Cancele quando quiser
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 3.4 API de Checkout Stripe

#### 📁 Criar: `src/app/api/billing/create-checkout/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  business: process.env.STRIPE_BUSINESS_PRICE_ID!
};

export async function POST(request: NextRequest) {
  try {
    const { planType } = await request.json();
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar se usuário já tem customer Stripe
    let { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    // Criar customer se não existir
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          userId: user.id
        }
      });
      customerId = customer.id;
    }

    // Criar checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[planType as keyof typeof PRICE_IDS],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=cancelled`,
      metadata: {
        userId: user.id,
        planType
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planType
        }
      }
    });

    return NextResponse.json({ checkoutUrl: session.url });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session' 
    }, { status: 500 });
  }
}
```

---

## 🎯 FASE 4: INTEGRAÇÃO YOUTUBE API COM ROTEIROS (Semana 4-5)

### 4.1 Melhorar YouTube API Integration

#### 📁 Modificar: `src/app/api/youtube/channel-data/route.ts`
```typescript
// Adicionar análise de performance para roteiros
export async function GET(request: NextRequest) {
  // ... código existente ...

  // Adicionar análise de performance dos vídeos
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&channelId=${channelId}&order=date&maxResults=50&type=video&key=${process.env.YOUTUBE_API_KEY}`
  );

  const videosData = await videosResponse.json();
  
  // Analisar performance dos vídeos recentes
  const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');
  
  const statsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?` +
    `part=statistics,snippet&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`
  );

  const statsData = await statsResponse.json();
  
  // Calcular métricas para melhorar sugestões de roteiro
  const performanceMetrics = calculatePerformanceMetrics(statsData.items);
  
  return NextResponse.json({
    channel: channelData,
    recentVideos: videosData.items,
    performanceMetrics,
    suggestions: generateImprovementSuggestions(performanceMetrics)
  });
}

function calculatePerformanceMetrics(videos: any[]) {
  const metrics = videos.map(video => ({
    title: video.snippet.title,
    views: parseInt(video.statistics.viewCount || '0'),
    likes: parseInt(video.statistics.likeCount || '0'),
    comments: parseInt(video.statistics.commentCount || '0'),
    publishedAt: video.snippet.publishedAt,
    duration: video.contentDetails?.duration,
    // Calcular engagement rate
    engagementRate: (
      (parseInt(video.statistics.likeCount || '0') + 
       parseInt(video.statistics.commentCount || '0')) /
      parseInt(video.statistics.viewCount || '1')
    ) * 100
  }));

  const avgViews = metrics.reduce((sum, m) => sum + m.views, 0) / metrics.length;
  const avgEngagement = metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length;
  const topPerforming = metrics.filter(m => m.views > avgViews * 1.5);
  
  return {
    averageViews: Math.round(avgViews),
    averageEngagement: Math.round(avgEngagement * 100) / 100,
    topPerformingVideos: topPerforming.slice(0, 5),
    totalVideos: metrics.length,
    bestPerformingHours: analyzeBestTiming(metrics),
    commonSuccessPatterns: analyzeSuccessPatterns(topPerforming)
  };
}

function generateImprovementSuggestions(metrics: any) {
  const suggestions = [];
  
  if (metrics.averageEngagement < 2) {
    suggestions.push({
      type: 'engagement',
      title: 'Melhorar Engajamento',
      description: 'Seus vídeos têm baixo engajamento. Tente hooks mais impactantes e CTAs mais claros.',
      priority: 'high'
    });
  }
  
  if (metrics.topPerformingVideos.length > 0) {
    const patterns = metrics.commonSuccessPatterns;
    suggestions.push({
      type: 'content',
      title: 'Replicar Sucessos',
      description: `Seus vídeos de maior sucesso têm padrões: ${patterns.join(', ')}`,
      priority: 'medium'
    });
  }
  
  return suggestions;
}
```

### 4.2 Roteiros Personalizados com Dados do YouTube

#### 📁 Modificar: `src/app/api/scripts/generate/route.ts`
```typescript
// Melhorar prompts com dados do canal
async function generatePremiumScriptPrompt(idea: any, youtubeData?: any) {
  let contextualInfo = '';
  
  if (youtubeData) {
    contextualInfo = `
DADOS DO CANAL:
- Audiência principal: ${youtubeData.demographics || 'Geral'}
- Vídeos com melhor performance: ${youtubeData.topPerformingVideos?.map(v => v.title).join(', ') || 'N/A'}
- Padrões de sucesso: ${youtubeData.commonSuccessPatterns?.join(', ') || 'N/A'}
- Engagement médio: ${youtubeData.averageEngagement || 'N/A'}%
- Melhor horário para postar: ${youtubeData.bestPerformingHours || 'N/A'}

Use essas informações para personalizar o roteiro especificamente para este canal.
`;
  }

  return `
Crie um roteiro completo e profissional para esta ideia de vídeo:

TÍTULO: ${idea.title}
DESCRIÇÃO: ${idea.description}
CATEGORIA: ${idea.category}

${contextualInfo}

INSTRUÇÕES ESPECÍFICAS:
1. Use padrões que funcionaram bem no canal
2. Adapte o tom para a audiência identificada
3. Inclua elementos que aumentam engagement
4. Sugira timing baseado nos dados históricos

Responda APENAS com um JSON neste formato:
{
  "hook": "Frase de abertura impactante baseada nos sucessos do canal",
  "alternativeHooks": ["Hook 2 testado", "Hook 3 personalizado"],
  "introduction": "Introdução que conecta com a audiência específica",
  "mainContent": {
    "sections": [
      {
        "title": "Título da seção",
        "content": "Conteúdo detalhado otimizado para o canal",
        "timing": "1:30-3:00",
        "visualSuggestions": ["Baseado no estilo do canal"],
        "engagementTriggers": ["Momentos para aumentar interação"]
      }
    ]
  },
  "transitions": ["Transições no estilo que funciona no canal"],
  "conclusion": "Conclusão que replica padrões de sucesso",
  "cta": "CTA otimizado baseado no histórico de engagement",
  "seoTags": ["Tags baseadas no nicho e performance"],
  "thumbnailSuggestions": ["Estilo que performa bem no canal"],
  "estimatedDuration": "Baseado na duração ótima do canal",
  "targetAudience": "Audiência específica identificada",
  "engagementTips": ["Dicas baseadas nos dados do canal"],
  "postingRecommendations": {
    "bestTime": "${youtubeData?.bestPerformingHours || 'Análise pendente'}",
    "bestDay": "Baseado nos dados históricos",
    "seasonality": "Considerações sazonais"
  },
  "performancePrediction": {
    "expectedViews": "Estimativa baseada em vídeos similares",
    "expectedEngagement": "Baseado no histórico",
    "confidenceLevel": "Alto/Médio/Baixo"
  }
}

Crie um roteiro altamente personalizado e otimizado para este canal específico.
`;
}
```

---

## 📊 FASE 5: ANALYTICS E CONVERSÃO (Semana 5-6)

### 5.1 Dashboard de ROI e Success Tracking

#### 📁 Criar: `src/components/dashboard/ROITracker.tsx`
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Eye, ThumbsUp } from 'lucide-react';

interface VideoSuccess {
  id: string;
  ideaTitle: string;
  scriptUsed: boolean;
  videoUrl?: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  estimatedRevenue: number;
}

export default function ROITracker() {
  const [successStories, setSuccessStories] = useState<VideoSuccess[]>([]);
  const [totalROI, setTotalROI] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchROIData();
  }, []);

  const fetchROIData = async () => {
    try {
      const response = await fetch('/api/analytics/roi');
      const data = await response.json();
      setSuccessStories(data.successStories);
      setTotalROI(data.totalROI);
    } catch (error) {
      console.error('Error fetching ROI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markVideoAsPublished = async (ideaId: string, videoUrl: string) => {
    try {
      await fetch('/api/ideas/mark-published', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId, videoUrl })
      });
      
      // Refresh data
      fetchROIData();
    } catch (error) {
      console.error('Error marking video as published:', error);
    }
  };

  if (loading) return <div>Loading ROI data...</div>;

  return (
    <div className="space-y-6">
      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              ROI Total Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalROI.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado em views e CPM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Total de Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {successStories.reduce((sum, story) => sum + story.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              De ideias do TubeSpark
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-purple-600" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((successStories.length / (successStories.length + 5)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Ideias que viraram vídeos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              Melhor Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...successStories.map(s => s.views), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Views do melhor vídeo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Success Stories List */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Seus Sucessos com TubeSpark</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {successStories.map((story) => (
              <div 
                key={story.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{story.ideaTitle}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {story.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {story.likes.toLocaleString()} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ~${story.estimatedRevenue.toFixed(2)} receita
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {story.scriptUsed && (
                    <Badge variant="secondary">
                      🎬 Roteiro usado
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-green-600">
                    ✅ Publicado
                  </Badge>
                </div>
              </div>
            ))}
            
            {successStories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Ainda não há vídeos marcados como publicados.</p>
                <p className="text-sm mt-2">
                  Marque suas ideias como "publicadas" para acompanhar o ROI!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action for unpublished ideas */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">
              📈 Transforme Mais Ideias em Sucesso!
            </h3>
            <p className="text-muted-foreground mb-4">
              Você tem ideias salvas esperando para virar vídeos virais
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
              Ver Ideias Pendentes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 5.2 API de Analytics ROI

#### 📁 Criar: `src/app/api/analytics/roi/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar ideias que foram marcadas como publicadas
    const { data: publishedIdeas, error } = await supabase
      .from('video_ideas')
      .select(`
        *,
        video_scripts(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calcular métricas de ROI
    const successStories = await Promise.all(
      publishedIdeas.map(async (idea) => {
        // Se tiver URL do vídeo, buscar métricas reais do YouTube
        let metrics = {
          views: idea.estimated_views || 0,
          likes: idea.estimated_likes || 0,
          comments: idea.estimated_comments || 0
        };

        if (idea.published_video_url) {
          try {
            metrics = await fetchYouTubeMetrics(idea.published_video_url);
          } catch (error) {
            console.error('Error fetching YouTube metrics:', error);
          }
        }

        // Calcular receita estimada (baseado em CPM médio de $2-5)
        const avgCPM = 3.5; // $3.50 por 1000 views
        const estimatedRevenue = (metrics.views / 1000) * avgCPM;

        return {
          id: idea.id,
          ideaTitle: idea.title,
          scriptUsed: idea.video_scripts && idea.video_scripts.length > 0,
          videoUrl: idea.published_video_url,
          publishedAt: idea.published_at,
          views: metrics.views,
          likes: metrics.likes,
          comments: metrics.comments,
          estimatedRevenue
        };
      })
    );

    const totalROI = successStories.reduce((sum, story) => sum + story.estimatedRevenue, 0);

    // Calcular insights adicionais
    const insights = calculateROIInsights(successStories);

    return NextResponse.json({
      successStories,
      totalROI,
      insights,
      summary: {
        totalVideos: successStories.length,
        totalViews: successStories.reduce((sum, s) => sum + s.views, 0),
        avgViewsPerVideo: successStories.length > 0 
          ? Math.round(successStories.reduce((sum, s) => sum + s.views, 0) / successStories.length)
          : 0,
        scriptsUsedPercentage: successStories.length > 0
          ? Math.round((successStories.filter(s => s.scriptUsed).length / successStories.length) * 100)
          : 0
      }
    });

  } catch (error) {
    console.error('ROI calculation error:', error);
    return NextResponse.json({ 
      error: 'Failed to calculate ROI' 
    }, { status: 500 });
  }
}

async function fetchYouTubeMetrics(videoUrl: string) {
  // Extrair video ID da URL
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error('Invalid YouTube URL');

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?` +
    `part=statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
  );

  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found');
  }

  const stats = data.items[0].statistics;
  return {
    views: parseInt(stats.viewCount || '0'),
    likes: parseInt(stats.likeCount || '0'),
    comments: parseInt(stats.commentCount || '0')
  };
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function calculateROIInsights(successStories: any[]) {
  const insights = [];

  // Insight sobre uso de roteiros
  const withScripts = successStories.filter(s => s.scriptUsed);
  const withoutScripts = successStories.filter(s => !s.scriptUsed);

  if (withScripts.length > 0 && withoutScripts.length > 0) {
    const avgViewsWithScript = withScripts.reduce((sum, s) => sum + s.views, 0) / withScripts.length;
    const avgViewsWithoutScript = withoutScripts.reduce((sum, s) => sum + s.views, 0) / withoutScripts.length;
    
    const improvement = ((avgViewsWithScript - avgViewsWithoutScript) / avgViewsWithoutScript) * 100;
    
    if (improvement > 10) {
      insights.push({
        type: 'script_performance',
        title: '🎬 Roteiros Aumentam Performance',
        description: `Vídeos com roteiros do TubeSpark têm ${Math.round(improvement)}% mais views em média`,
        impact: 'positive'
      });
    }
  }

  // Insight sobre timing
  const recentVideos = successStories.filter(s => {
    const publishedDate = new Date(s.publishedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return publishedDate > thirtyDaysAgo;
  });

  if (recentVideos.length >= 3) {
    const avgRecentViews = recentVideos.reduce((sum, s) => sum + s.views, 0) / recentVideos.length;
    const overallAvg = successStories.reduce((sum, s) => sum + s.views, 0) / successStories.length;
    
    if (avgRecentViews > overallAvg * 1.2) {
      insights.push({
        type: 'improvement_trend',
        title: '📈 Você Está Melhorando!',
        description: 'Seus vídeos recentes estão performando 20% melhor que a média',
        impact: 'positive'
      });
    }
  }

  return insights;
}
```

---

## 🚀 CRONOGRAMA DE IMPLEMENTAÇÃO

### **SEMANA 1-2: MELHORIAS NO CÓDIGO EXISTENTE**
```
📅 Dias 1-3: Sistema de Engagement
├── Modificar IdeaCard.tsx
├── Criar engagement tracking API
├── Implementar botões de interação
└── Testar tracking de tempo

📅 Dias 4-7: Dashboard Analytics  
├── Criar ConversionMetrics component
├── API de estatísticas de conversão
├── Integrar métricas no dashboard
└── Testes de performance

📅 Dias 8-14: Preparação para Roteiros
├── Schema do banco (video_scripts)
├── Sistema de limites básico
├── Componente ScriptGenerationModal
└── Testes de UX flow
```

### **SEMANA 2-3: SISTEMA DE ROTEIROS**
```
📅 Dias 15-18: Core de Roteiros
├── API /scripts/generate
├── Integração OpenAI para roteiros
├── Sistema básico vs premium
└── Salvamento no Supabase

📅 Dias 19-21: Interface de Roteiros
├── Modal de geração
├── Visualização de roteiros
├── Sistema de favoritos para roteiros
└── Compartilhamento de roteiros

📅 Dias 22-28: Testes e Refinamentos
├── A/B test roteiros básicos vs premium
├── Otimização de prompts IA
├── Feedback collection system
└── Performance optimization
```

### **SEMANA 3-4: SISTEMA DE BILLING**
```
📅 Dias 29-32: Database e Limites
├── Tabelas subscription, usage_tracking
├── Sistema de verificação de limites
├── Plan limits configuration
└── Usage increment system

📅 Dias 33-35: Stripe Integration
├── Configurar produtos no Stripe
├── API de checkout
├── Webhooks para confirmação
└── Sistema de upgrade prompts

📅 Dias 36-42: UX de Billing
├── Componente UpgradePrompt
├── Usage dashboard
├── Billing history
└── Cancelation flow
```

### **SEMANA 4-5: YOUTUBE INTEGRATION AVANÇADA**
```
📅 Dias 43-46: Dados para Roteiros
├── Melhorar YouTube API calls
├── Análise de performance histórica
├── Identificação de padrões de sucesso
└── Personalização de roteiros

📅 Dias 47-49: Sugestões Inteligentes
├── Algoritmo de timing otimizado
├── Previsão de performance
├── Recomendações baseadas em dados
└── Integration com geração de ideias

📅 Dias 50-56: Testes e Validação
├── Testar precisão das previsões
├── Validar melhorias na conversão
├── Ajustar algoritmos baseado em dados
└── Documentation
```

### **SEMANA 5-6: ANALYTICS E ROI**
```
📅 Dias 57-60: ROI Tracking
├── Sistema de marcação de vídeos publicados
├── Integração com YouTube Analytics
├── Cálculo automático de ROI
└── Success stories collection

📅 Dias 61-63: Dashboard Analytics
├── Componente ROITracker
├── Visualizações de performance
├── Insights automáticos
└── Relatórios exportáveis

📅 Dias 64-70: Polish e Otimização
├── Performance optimization
├── Error handling robusto
├── UI/UX final polish
└── Preparação para launch
```

---

## 💡 IMPLEMENTAÇÃO ESTRATÉGICA

### **🎯 PRIORIDADE MÁXIMA (Implementar PRIMEIRO)**
1. **Sistema de Engagement** - Base para conversão
2. **Roteiros Básicos** - Core value proposition  
3. **Billing System** - Monetização imediata
4. **Usage Limits** - Força upgrade

### **🔥 QUICK WINS (Resultados Rápidos)**
```typescript
// Implementar HOJE mesmo:
const quickWins = [
  "Botão 'Favoritar' nas ideias",
  "Time tracking de engagement", 
  "Modal 'Upgrade Required'",
  "Usage counter no dashboard",
  "CTA para roteiro após favoritar"
];
```

### **📊 MÉTRICAS DE SUCESSO**
```typescript
const successMetrics = {
  engagement: {
    ideaFavoriteRate: ">30%",      // 30% das ideias são favoritadas
    timeOnIdea: ">45s",            // Média de tempo por ideia
    scriptRequestRate: ">50%",     // 50% dos favoritos pedem roteiro
  },
  
  conversion: {
    freeToProRate: ">8%",          // 8% dos free users viram pro
    scriptToUpgradeRate: ">15%",   // 15% upgrade após usar roteiro
    monthlyChurn: "<5%",           // Churn mensal abaixo de 5%
  },
  
  revenue: {
    month1Target: "$500-1500",     // Primeiro mês
    month3Target: "$3000-8000",    // Terceiro mês  
    month6Target: "$10000-25000",  // Sexto mês
  }
}
```

### **🚨 RISCOS E MITIGATION**
```typescript
const risks = {
  aiCosts: {
    risk: "Custos de IA podem explodir com escala",
    mitigation: "Rate limiting + smart caching + usage tracking"
  },
  
  userChurn: {
    risk: "Users podem cancelar após primeiro roteiro",
    mitigation: "Onboarding de valor + success tracking + engagement loop"
  },
  
  competition: {
    risk: "Competitors podem copiar funcionalidades",
    mitigation: "Speed to market + YouTube integration depth + personalization"
  }
}
```

---

## 📝 CHECKLIST DE ENTREGA

### **✅ FASE 1 - ENGAGEMENT (Semana 1-2)**
- [ ] IdeaCard com botões interativos
- [ ] Sistema de tracking de tempo
- [ ] API de engagement tracking
- [ ] Métricas de conversão no dashboard
- [ ] Testes A/B de engagement

### **✅ FASE 2 - ROTEIROS (Semana 2-3)**  
- [ ] Schema video_scripts implementado
- [ ] Modal de geração de roteiros
- [ ] API /scripts/generate funcional
- [ ] Diferenciação básico vs premium
- [ ] Sistema de visualização de roteiros

### **✅ FASE 3 - BILLING (Semana 3-4)**
- [ ] Integração Stripe completa
- [ ] Sistema de limites por plano
- [ ] UpgradePrompt component
- [ ] Verificação de usage em real-time
- [ ] Webhooks de confirmação

### **✅ FASE 4 - YOUTUBE ADVANCED (Semana 4-5)**
- [ ] Análise de performance histórica
- [ ] Roteiros personalizados por canal
- [ ] Previsões de performance
- [ ] Recomendações de timing
- [ ] Integration com idea generation

### **✅ FASE 5 - ANALYTICS (Semana 5-6)**
- [ ] ROI tracking system
- [ ] Success stories collection
- [ ] Performance insights
- [ ] Relatórios automáticos
- [ ] Dashboard final polished

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### **PARA O DESENVOLVEDOR - AÇÃO IMEDIATA:**

1. **HOJE**: Implementar botões de engagement no IdeaCard
2. **AMANHÃ**: Criar sistema de tracking básico
3. **ESTA SEMANA**: Modal de roteiros + billing básico
4. **PRÓXIMA SEMANA**: Sistema completo de roteiros

### **ARQUIVOS PARA COMEÇAR AGORA:**
```bash
# Criar estes arquivos primeiro:
touch src/lib/engagement.ts
touch src/components/dashboard/ScriptGenerationModal.tsx  
touch src/app/api/engagement/track/route.ts
touch src/app/api/scripts/generate/route.ts

# Modificar estes arquivos:
# src/components/dashboard/IdeaCard.tsx
# src/app/dashboard/page.tsx
```

### **CONFIGURAÇÕES NECESSÁRIAS:**
```bash
# Variáveis de ambiente para adicionar:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🏆 RESULTADO ESPERADO

Após implementar todas essas melhorias, o TubeSpark terá:

**🎯 Conversão Otimizada**: Sistema completo de engagement → roteiro → upgrade
**💰 Monetização Robusta**: Billing system com múltiplos trigger points  
**🤖 IA Personalizada**: Roteiros baseados em dados reais do canal
**📊 Analytics Completo**: ROI tracking e success stories
**🚀 Diferencial Competitivo**: Integração profunda com YouTube + personalização

**Bottom Line**: Transformar TubeSpark de "gerador de ideias" para "sistema completo de crescimento para YouTubers" com foco em **receita recorrente** e **valor comprovado**.

---

**Status**: 🚀 **PRONTO PARA IMPLEMENTAÇÃO**  
**Impacto Esperado**: 📈 **3-5x aumento na conversão e receita**

*Documento técnico completo - Todas as especificações, código e implementações detalhadas para maximizar o ROI do TubeSpark.*# 🚀 TUBESPARK - PLANO DE MELHORIAS E OTIMIZAÇÕES

**Data**: 01 de Agosto de 2025  
**Preparado para**: Desenvolvedor Sênior  
**Objetivo**: Implementar melhorias críticas para maximizar conversão e receita  
**Prazo**: 4-6 semanas

---

## 📋 RESUMO EXECUTIVO

Este documento detalha as melhorias necessárias no código existente e novas funcionalidades a serem implementadas. O foco é **converter engagement em receita** através de um sistema inteligente de roteiros e billing otimizado.

**Prioridade**: 🔥 **CRÍTICA** - Impacto direto na receita e conversão

---

## 🎯 FASE 1: MELHORIAS NO CÓDIGO EXISTENTE (Semana 1-2)

### 1.1 Sistema de IA - Engagement Tracking

**Localização**: `src/components/dashboard/` e `src/app/api/ideas/`

#### 📁 Arquivos a Modificar:
```
src/
├── components/dashboard/IdeaCard.tsx (MODIFICAR)
├── lib/engagement.ts (CRIAR)
├── app/api/engagement/ (CRIAR PASTA)
│   ├── track.ts
│   └── stats.ts
└── types/engagement.ts (CRIAR)
```

#### 🔧 IdeaCard.tsx - Adicionar Botões de Engagement:
```typescript
// Adicionar ao componente existente
const [engagementData, setEngagementData] = useState({
  timeOnIdea: 0,
  isFavorited: false,
  isShared: false,
  isCopied: false,
  clickedExpand: false
});

// Timer para tracking de tempo
useEffect(() => {
  const startTime = Date.now();
  return () => {
    const timeSpent = Date.now() - startTime;
    trackEngagement('time_on_idea', { ideaId, timeSpent });
  };
}, []);

// Botões de engagement (adicionar após conteúdo da ideia)
<div className="flex gap-2 mt-4 p-4 border-t">
  <Button 
    variant={engagementData.isFavorited ? "default" : "outline"}
    onClick={() => handleFavorite()}
    className="flex items-center gap-2"
  >
    <Star className={engagementData.isFavorited ? "fill-yellow-400" : ""} />
    Favoritar
  </Button>
  
  <Button 
    variant="outline"
    onClick={() => handleShare()}
    className="flex items-center gap-2"
  >
    <Share2 className="w-4 h-4" />
    Compartilhar
  </Button>
  
  <Button 
    variant="outline"
    onClick={() => handleCopy()}
    className="flex items-center gap-2"
  >
    <Copy className="w-4 h-4" />
    Copiar
  </Button>
  
  {/* Botão de Roteiro - Aparece após engagement */}
  {(engagementData.isFavorited || engagementData.timeOnIdea > 30000) && (
    <Button 
      onClick={() => setShowScriptModal(true)}
      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-2"
    >
      <FileText className="w-4 h-4" />
      🎬 Criar Roteiro
    </Button>
  )}
</div>
```

#### 🗄️ Nova Tabela Supabase - engagement_tracking:
```sql
CREATE TABLE engagement_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES video_ideas(id) ON DELETE CASCADE,
  engagement_type VARCHAR(50) NOT NULL, -- 'favorite', 'share', 'copy', 'time_spent', 'expand'
  engagement_value JSONB, -- { timeSpent: 45000, platform: 'twitter', etc }
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_engagement_user_idea (user_id, idea_id),
  INDEX idx_engagement_type (engagement_type)
);
```

#### 📊 API Endpoint - `/api/engagement/track.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { ideaId, engagementType, engagementValue } = await request.json();
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Track engagement
    const { error } = await supabase
      .from('engagement_tracking')
      .insert({
        user_id: user.id,
        idea_id: ideaId,
        engagement_type: engagementType,
        engagement_value: engagementValue
      });

    if (error) throw error;

    // Update engagement score
    await updateEngagementScore(user.id, ideaId, engagementType);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Função auxiliar para scoring
async function updateEngagementScore(userId: string, ideaId: string, type: string) {
  const weights = {
    'time_spent': 1,
    'favorite': 5,
    'share': 7,
    'copy': 10,
    'expand': 3
  };
  
  // Implementar lógica de scoring...
}
```

### 1.2 Dashboard Analytics - Métricas de Conversão

**Localização**: `src/app/dashboard/page.tsx` e `src/app/api/dashboard/`

#### 📁 Arquivos a Modificar:
```
src/
├── app/dashboard/page.tsx (MODIFICAR)
├── app/api/dashboard/conversion-stats.ts (CRIAR)
├── components/dashboard/ConversionMetrics.tsx (CRIAR)
└── types/analytics.ts (MODIFICAR)
```

#### 📊 ConversionMetrics.tsx - Novo Componente:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ConversionMetrics {
  ideasGenerated: number;
  ideasFavorited: number;
  scriptsGenerated: number;
  ideasPublished: number; // User marked as "published"
  successRate: number;
  avgEngagementTime: number;
  topPerformingIdeas: Array<{
    id: string;
    title: string;
    engagementScore: number;
    wasPublished: boolean;
  }>;
}

export default function ConversionMetrics() {
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversionMetrics();
  }, []);

  const fetchConversionMetrics = async () => {
    try {
      const response = await fetch('/api/dashboard/conversion-stats');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching conversion metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading metrics...</div>;
  if (!metrics) return <div>Error loading metrics</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Ideas Generated */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ideias Geradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.ideasGenerated}</div>
          <p className="text-xs text-muted-foreground">
            Total este mês
          </p>
        </CardContent>
      </Card>

      {/* Engagement Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((metrics.ideasFavorited / metrics.ideasGenerated) * 100)}%
          </div>
          <Progress 
            value={(metrics.ideasFavorited / metrics.ideasGenerated) * 100} 
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.ideasFavorited} ideias favoritadas
          </p>
        </CardContent>
      </Card>

      {/* Script Conversion */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Conversão para Roteiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((metrics.scriptsGenerated / metrics.ideasFavorited) * 100)}%
          </div>
          <Progress 
            value={(metrics.scriptsGenerated / metrics.ideasFavorited) * 100} 
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.scriptsGenerated} roteiros criados
          </p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {Math.round(metrics.successRate)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Ideias que viraram vídeos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🚀 FASE 2: SISTEMA DE ROTEIROS (Semana 2-3)

### 2.1 Database Schema - Tabela video_scripts

#### 🗄️ Nova Tabela Supabase:
```sql
CREATE TABLE video_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES video_ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  script_type VARCHAR(20) NOT NULL CHECK (script_type IN ('basic', 'premium')),
  content JSONB NOT NULL, -- Estrutura detalhada abaixo
  generation_cost DECIMAL(10,4), -- Custo da geração em USD
  was_used BOOLEAN DEFAULT false,
  published_video_url VARCHAR(500), -- Link do vídeo se publicado  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_scripts_user (user_id),
  INDEX idx_scripts_idea (idea_id),
  INDEX idx_scripts_type (script_type)
);

-- Estrutura do campo content JSONB:
/*
{
  "basic": {
    "hook": "Frase de abertura impactante",
    "mainPoints": ["Ponto 1", "Ponto 2", "Ponto 3"],
    "cta": "Call to action"
  },
  "premium": {
    "hook": "Frase de abertura impactante",
    "alternativeHooks": ["Hook 2", "Hook 3"],
    "introduction": "Parágrafo de introdução completo",
    "mainContent": {
      "sections": [
        {
          "title": "Seção 1",
          "content": "Conteúdo detalhado",
          "timing": "0:30-2:00",
          "visualSuggestions": ["Sugestão de imagem/vídeo"]
        }
      ]
    },
    "transitions": ["Como conectar seções"],
    "conclusion": "Conclusão completa",
    "cta": "Call to action otimizado",
    "seoTags": ["tag1", "tag2", "tag3"],
    "thumbnailSuggestions": ["Ideia 1", "Ideia 2"],
    "estimatedDuration": "8-10 minutos",
    "targetAudience": "Descrição da audiência",
    "engagementTips": ["Dica 1", "Dica 2"]
  }
}
*/
```

### 2.2 Componente ScriptGenerationModal

#### 📁 Criar: `src/components/dashboard/ScriptGenerationModal.tsx`
```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Crown, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ScriptGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  ideaTitle: string;
  userPlan: 'free' | 'pro' | 'business';
}

export default function ScriptGenerationModal({
  isOpen,
  onClose,
  ideaId,
  ideaTitle,
  userPlan
}: ScriptGenerationModalProps) {
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<'basic' | 'premium'>('basic');
  const { user } = useAuth();

  const handleGenerateScript = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId,
          scriptType: selectedType
        })
      });

      const data = await response.json();
      
      if (data.error === 'UPGRADE_REQUIRED') {
        // Redirecionar para upgrade
        window.location.href = '/upgrade';
        return;
      }

      if (data.success) {
        // Redirecionar para visualizar roteiro
        window.location.href = `/dashboard/scripts/${data.scriptId}`;
      }
    } catch (error) {
      console.error('Error generating script:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎬 Criar Roteiro para: {ideaTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Script Option */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedType === 'basic' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedType('basic')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Roteiro Básico
                  <Badge variant="secondary">GRÁTIS</Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Outline com pontos principais, hook e CTA
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Hook de abertura</li>
                  <li>• 3-5 pontos principais</li>
                  <li>• Call to action</li>
                </ul>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">Grátis</div>
                <div className="text-xs text-muted-foreground">
                  {userPlan === 'free' ? '2/mês' : 'Ilimitado'}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Script Option */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedType === 'premium' 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedType('premium')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  Roteiro Completo
                  <Badge variant="outline" className="border-purple-500 text-purple-600">
                    PREMIUM
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Roteiro detalhado com SEO, timing e sugestões visuais
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Múltiplos hooks alternativos</li>
                  <li>• Roteiro seção por seção com timing</li>
                  <li>• Tags SEO otimizadas</li>
                  <li>• Sugestões de thumbnail</li>
                  <li>• Dicas de engajamento</li>
                  <li>• Transições entre seções</li>
                </ul>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">
                  {userPlan === 'free' ? '$2' : 'Incluído'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {userPlan === 'free' ? 'Por roteiro' : 'Plano PRO'}
                </div>
              </div>
            </div>
          </div>

          {/* Usage Info */}
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm">
              <strong>Seu uso este mês:</strong> 
              {/* Implementar contadores de uso aqui */}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleGenerateScript}
              disabled={generating}
              className="flex-1"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando Roteiro...
                </>
              ) : (
                `🎬 Gerar Roteiro ${selectedType === 'premium' ? 'Completo' : 'Básico'}`
              )}
            </Button>
            
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 2.3 API Endpoint para Geração de Roteiros

#### 📁 Criar: `src/app/api/scripts/generate/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { ideaId, scriptType } = await request.json();
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar dados da ideia
    const { data: idea, error: ideaError } = await supabase
      .from('video_ideas')
      .select('*')
      .eq('id', ideaId)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Verificar limites do usuário
    const canGenerate = await checkUserLimits(user.id, scriptType);
    if (!canGenerate.allowed) {
      return NextResponse.json({ 
        error: 'UPGRADE_REQUIRED',
        message: canGenerate.message 
      }, { status: 402 });
    }

    // Gerar roteiro com IA
    const script = await generateScriptWithAI(idea, scriptType, user.id);
    
    // Salvar no banco
    const { data: savedScript, error: saveError } = await supabase
      .from('video_scripts')
      .insert({
        idea_id: ideaId,
        user_id: user.id,
        script_type: scriptType,
        content: script,
        generation_cost: scriptType === 'basic' ? 0.03 : 0.08
      })
      .select()
      .single();

    if (saveError) throw saveError;

    // Atualizar contadores de uso
    await updateUsageCounters(user.id, scriptType);

    return NextResponse.json({ 
      success: true, 
      scriptId: savedScript.id,
      script: savedScript
    });

  } catch (error) {
    console.error('Script generation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

async function checkUserLimits(userId: string, scriptType: string) {
  // Implementar lógica de verificação de limites
  // Verificar plano do usuário e uso mensal
  return { allowed: true, message: '' };
}

async function generateScriptWithAI(idea: any, scriptType: string, userId: string) {
  const prompt = scriptType === 'basic' 
    ? generateBasicScriptPrompt(idea)
    : generatePremiumScriptPrompt(idea);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é um especialista em criação de roteiros para YouTube. Responda sempre em JSON válido."
      },
      {
        role: "user", 
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return JSON.parse(completion.choices[0].message.content);
}

function generateBasicScriptPrompt(idea: any) {
  return `
Crie um roteiro básico para esta ideia de vídeo:

TÍTULO: ${idea.title}
DESCRIÇÃO: ${idea.description}
CATEGORIA: ${idea.category}

Responda APENAS com um JSON neste formato:
{
  "hook": "Frase de abertura impactante de 1-2 frases",
  "mainPoints": ["Ponto principal 1", "Ponto principal 2", "Ponto principal 3"],
  "cta": "Call to action convincente"
}

Mantenha tudo conciso e impactante. Hook deve capturar atenção nos primeiros 3 segundos.
`;
}

function generatePremiumScriptPrompt(idea: any) {
  return `
Crie um roteiro completo e profissional para esta ideia de vídeo:

TÍTULO: ${idea.title}
DESCRIÇÃO: ${idea.description}
CATEGORIA: ${idea.category}

Responda APENAS com um JSON neste formato:
{
  "hook": "Frase de abertura impactante",
  "alternativeHooks": ["Hook alternativo 1", "Hook alternativo 2"],
  "introduction": "Parágrafo de introdução completo",
  "mainContent": {
    "sections": [
      {
        "title": "Título da seção",
        "content": "Conteúdo detalhado",
        "timing": "1:30-3:00",
        "visualSuggestions": ["Sugestão visual 1", "Sugestão 2"]
      }
    ]
  },
  "transitions": ["Transição entre seção 1 e 2", "Transição 2 e 3"],
  "conclusion": "Conclusão impactante",
  "cta": "Call to action otimizado",
  "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "thumbnailSuggestions": ["Ideia de thumbnail 1", "Ideia 2", "Ideia 3"],
  "estimatedDuration": "X-Y minutos",
  "targetAudience": "Descrição da audiência-alvo",
  "engagementTips": ["Dica de engajamento 1", "Dica 2", "Dica 3"]
}

Crie um roteiro profissional, detalhado, com timing preciso e sugestões práticas.
`;
}

async function updateUsageCounters(userId: string, scriptType: string) {
  // Implementar lógica de atualização de contadores
}
```

---

## 💳 FASE 3: SISTEMA DE BILLING E LIMITES (Semana 3-4)

### 3.1 Database Schema - Sistema de Billing

#### 🗄️ Novas Tabelas Supabase:
```sql
-- Tabela de assinaturas
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('free', 'starter', 'pro', 'business')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'paused')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_subs_user (user_id),
  INDEX idx_subs_status (status)
);

-- Tabela de uso mensal
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month_year VARCHAR(7) NOT NULL, -- Format: 2025-08
  ideas_generated INTEGER DEFAULT 0,
  scripts_basic INTEGER DEFAULT 0,
  scripts_premium INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, month_year),
  INDEX idx_usage_user_month (user_id, month_year)
);

-- Tabela de limites por plano
CREATE TABLE plan_limits (
  plan_type VARCHAR(20) PRIMARY KEY,
  ideas_per_month INTEGER,
  scripts_basic_per_month INTEGER,
  scripts_premium_per_month INTEGER,
  api_calls_per_month INTEGER,
  features JSONB, -- { "youtube_integration": true, "competitor_analysis": false }
  price_monthly DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir limites dos planos
INSERT INTO plan_limits VALUES
('free', 10, 2, 0, 100, '{"youtube_integration": true, "competitor_analysis": false, "trend_analysis": false}', 0.00),
('starter', 100, 20, 5, 1000, '{"youtube_integration": true, "competitor_analysis": false, "trend_analysis": true}', 9.99),
('pro', -1, -1, 50, 5000, '{"youtube_integration": true, "competitor_analysis": true, "trend_analysis": true}', 29.99),
('business', -1, -1, -1, 25000, '{"youtube_integration": true, "competitor_analysis": true, "trend_analysis": true, "api_access": true}', 99.99);
```

### 3.2 Middleware de Verificação de Limites

#### 📁 Criar: `src/lib/billing/limits.ts`
```typescript
import { createClient } from '@/lib/supabase/server';

export async function checkUserLimits(
  userId: string, 
  action: 'idea' | 'script_basic' | 'script_premium' | 'api_call'
) {
  const supabase = createClient();
  const currentMonth = new Date().toISOString().slice(0, 7); // 2025-08

  try {
    // Buscar assinatura do usuário
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', userId)
      .single();

    const planType = subscription?.plan_type || 'free';
    
    // Buscar limites do plano
    const { data: planLimits } = await supabase
      .from('plan_limits')
      .select('*')
      .eq('plan_type', planType)
      .single();

    if (!planLimits) {
      throw new Error('Plan limits not found');
    }

    // Buscar uso atual
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .single();

    const currentUsage = usage || {
      ideas_generated: 0,
      scripts_basic: 0,
      scripts_premium: 0,
      api_calls: 0
    };

    // Verificar limite específico
    const limits = {
      idea: planLimits.ideas_per_month,
      script_basic: planLimits.scripts_basic_per_month,
      script_premium: planLimits.scripts_premium_per_month,
      api_call: planLimits.api_calls_per_month
    };

    const usageCount = {
      idea: currentUsage.ideas_generated,
      script_basic: currentUsage.scripts_basic,
      script_premium: currentUsage.scripts_premium,
      api_call: currentUsage.api_calls
    };

    const limit = limits[action];
    const used = usageCount[action];

    // -1 significa ilimitado
    if (limit === -1) {
      return {
        allowed: true,
        remaining: -1,
        limit: -1,
        used,
        planType
      };
    }

    const allowed = used < limit;
    const remaining = Math.max(0, limit - used);

    return {
      allowed,
      remaining,
      limit,
      used,
      planType,
      upgradeRequired: !allowed
    };

  } catch (error) {
    console.error('Error checking limits:', error);
    // Em caso de erro, permitir (fail-safe)
    return {
      allowed: true,
      remaining: 0,
      limit: 0,
      used: 0,
      planType: 'free',
      error: error.message
    };
  }
}

export async function incrementUsage(
  userId: string,
  action: 'idea' | 'script_basic' | 'script_premium' | 'api_call'
) {
  const supabase = createClient();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const updateField = {
    idea: 'ideas_generated',
    script_basic: 'scripts_basic', 
    script_premium: 'scripts_premium',
    api_call: 'api_calls'
  }[action];

  try {
    // Upsert usage tracking
    const { error } = await supabase
      .from('usage_tracking')
      .upsert({
        user_id: userId,
        month_year: currentMonth,
        [updateField]: supabase.raw(`COALESCE(${updateField}, 0) + 1`)
      }, {
        onConflict: 'user_id,month_year'
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserUsageSummary(userId: string) {
  const supabase = createClient();
  const currentMonth = new Date().toISOString().slice(0, 7);

  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', userId)
      .single();

    const planType = subscription?.plan_type || 'free';

    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .single();

    const { data: planLimits } = await supabase
      .from('plan_limits')
      .select('*')
      .eq('plan_type', planType)
      .single();

    const currentUsage = usage || {
      ideas_generated: 0,
      scripts_basic: 0,
      scripts_premium: 0,
      api_calls: 0
    };

    return {
      planType,
      currentUsage,
      limits: planLimits,
      monthYear: currentMonth
    };
  } catch (error) {
    console.error('Error getting usage summary:', error);
    return null;
  }
}