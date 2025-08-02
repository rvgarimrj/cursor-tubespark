import { openai } from './openai';
import { VideoIdea } from '@/types/ideas';

// YouTube-Native Framework Types
export interface ScriptGenerationInput {
  idea: VideoIdea;
  scriptType: 'basic' | 'premium';
  frameworkType: 'youtube_native' | 'traditional';
  youtubeData?: {
    channelTitle?: string;
    niche: string;
    topPerformingVideos?: Array<{
      title: string;
      views: number;
      engagement: number;
      successPatterns?: string[];
    }>;
    averageViews?: number;
    averageEngagement?: number;
    successPatterns?: string[];
    bestPerformingHours?: string;
    demographics?: string;
    audienceStyle?: string;
  };
  customizations?: {
    tone?: 'professional' | 'casual' | 'energetic';
    duration?: 'short' | 'medium' | 'long';
    audience?: string;
  };
}

// YouTube-Native Basic Script Structure
export interface YouTubeNativeBasicScript {
  type: 'youtube_native_basic';
  hook: {
    primary: string;
    type: 'curiosity_gap' | 'contradictory' | 'personal_story' | 'benefit_focused' | 'story_hook';
    estimated_retention: string;
    psychology_used: string;
  };
  narrative_flow: {
    identification: {
      content: string;
      timing: string;
      engagement_elements: string[];
      psychological_triggers: string[];
    };
    solution: {
      content: string;
      timing: string;
      engagement_elements: string[];
      value_delivery: string[];
    };
    implementation: {
      content: string;
      timing: string;
      engagement_elements: string[];
      next_steps: string[];
    };
  };
  cta_strategy: {
    primary: string;
    approach: string;
    timing: string;
  };
  retention_optimization: {
    pattern_interrupts: string[];
    value_payoffs: string[];
    open_loops: string[];
  };
  framework_type: 'youtube_native';
  generatedAt: string;
  promptVersion: string;
}

// YouTube-Native Premium Script Structure
export interface YouTubeNativePremiumScript {
  type: 'youtube_native_premium';
  hook_system: {
    primary: string;
    alternatives: string[];
    psychology_type: string;
    retention_prediction: string;
    niche_optimization: string;
  };
  narrative_structure: {
    act1_identification: {
      content: string;
      timing: string;
      psychological_triggers: string[];
      engagement_mechanics: string[];
      visual_suggestions: string[];
    };
    act2_solution_reveal: {
      content: string;
      timing: string;
      value_delivery: {
        framework_introduction: string;
        step_by_step_breakdown: string;
        real_examples: string;
        social_proof_integration: string;
      };
      engagement_mechanics: string[];
      visual_suggestions: string[];
    };
    act3_implementation: {
      content: string;
      timing: string;
      implementation_guide: {
        immediate_action: string;
        tools_and_resources: string;
        success_metrics: string;
        common_pitfalls: string;
      };
      engagement_mechanics: string[];
      visual_suggestions: string[];
    };
  };
  conversion_strategy: {
    soft_ctas: string[];
    value_ratio: string;
    natural_integration: string;
    community_building: string;
  };
  optimization_data: {
    retention_curve_prediction: string;
    engagement_hotspots: string[];
    algorithm_factors: string[];
    viral_probability_score: number;
  };
  personalization: {
    channel_adaptation: {
      audience_insights: string;
      content_style: string;
      brand_voice: string;
      niche_patterns: string;
    };
    trend_integration: {
      current_trends: string;
      seasonal_factors: string;
      platform_updates: string;
    };
  };
  performance_prediction: {
    estimated_metrics: {
      retention_rate: string;
      engagement_rate: string;
      click_through_rate: string;
      subscriber_conversion: string;
    };
    confidence_level: string;
    success_factors: string[];
  };
  post_production_guidance: {
    editing_suggestions: string[];
    thumbnail_optimization: string;
    title_variations: string;
    description_template: string;
  };
  framework_type: 'youtube_native';
  generatedAt: string;
  promptVersion: string;
}

// Traditional Script Types (Legacy)
export interface TraditionalBasicScript {
  type: 'traditional_basic';
  hook: string;
  mainPoints: string[];
  cta: string;
  estimatedDuration: string;
  framework_type: 'traditional';
  generatedAt: string;
  promptVersion: string;
}

export interface TraditionalPremiumScript {
  type: 'traditional_premium';
  hook: string;
  alternativeHooks: string[];
  introduction: string;
  mainContent: {
    sections: Array<{
      title: string;
      content: string;
      timing: string;
      visualSuggestions: string[];
      engagementTriggers: string[];
    }>;
  };
  transitions: string[];
  conclusion: string;
  cta: string;
  seoTags: string[];
  thumbnailSuggestions: string[];
  estimatedDuration: string;
  targetAudience: string;
  engagementTips: string[];
  postingRecommendations: {
    bestTime: string;
    bestDay: string;
    seasonality: string;
  };
  performancePrediction: {
    expectedViews: string;
    expectedEngagement: string;
    confidenceLevel: string;
    factors: string[];
  };
  framework_type: 'traditional';
  generatedAt: string;
  promptVersion: string;
  channelPersonalization?: {
    basedOnTopVideos: string[];
    audienceInsights: string;
    successPatterns: string[];
  };
}

export type VideoScript = 
  | YouTubeNativeBasicScript 
  | YouTubeNativePremiumScript 
  | TraditionalBasicScript 
  | TraditionalPremiumScript;

// YouTube-Native Analytics Class
export class YouTubeNativeAnalytics {
  
  static analyzeHookStrength(hook: string, niche: string): number {
    const strengthFactors = {
      curiosityGap: /o que.*não.*sabe|segredo|nunca.*contou|descobri|revelação|verdade/gi,
      contradiction: /todo mundo.*mas|todos.*pensam.*porém|contrário|oposto|diferente/gi,
      personalStory: /ontem|semana passada|anos atrás|aconteceu comigo|minha experiência|descobri/gi,
      benefit: /minutos para|aprenda.*em|como.*sem|método|estratégia|sistema/gi,
      urgency: /agora|hoje|ainda|antes que|última chance|apenas|só/gi,
      emotional: /chocante|surpreendente|incrível|impressionante|devastador|transformador/gi
    };

    let score = 50; // Base score
    
    // Analyze hook patterns
    Object.entries(strengthFactors).forEach(([pattern, regex]) => {
      const matches = hook.match(regex);
      if (matches) {
        score += Math.min(15, matches.length * 10); // Max 15 points per pattern
      }
    });
    
    // Length optimization (6-15 words ideal for YouTube)
    const wordCount = hook.split(' ').length;
    if (wordCount >= 6 && wordCount <= 15) {
      score += 10;
    } else if (wordCount > 20) {
      score -= 15;
    } else if (wordCount < 5) {
      score -= 10;
    }
    
    // Numbers boost (YouTube loves specific numbers)
    const numberMatches = hook.match(/\d+/g);
    if (numberMatches) {
      score += Math.min(10, numberMatches.length * 5);
    }
    
    // Question format bonus (psychological engagement)
    if (hook.includes('?')) {
      score += 8;
    }
    
    // Niche-specific optimization
    const nicheBonus = this.getNicheSpecificBonus(hook, niche);
    score += nicheBonus;
    
    return Math.min(100, Math.max(0, score));
  }
  
  static calculateRetentionPrediction(script: any): number {
    let baseRetention = 55; // Base YouTube retention
    
    // Hook strength impact (40% of prediction)
    const hookScore = script.hook_system?.retention_prediction || script.hook?.estimated_retention || 50;
    const hookImpact = (parseInt(hookScore) - 50) * 0.4;
    
    // Content structure impact (35% of prediction)
    let structureScore = 0;
    if (script.narrative_structure || script.narrative_flow) {
      structureScore = 75; // YouTube-Native structure bonus
    } else if (script.mainContent) {
      structureScore = 60; // Traditional structure
    }
    const structureImpact = (structureScore - 50) * 0.35;
    
    // Engagement elements impact (25% of prediction)
    let engagementScore = 0;
    if (script.retention_optimization || script.optimization_data) {
      engagementScore = 80; // Advanced optimization
    } else if (script.engagementTips) {
      engagementScore = 65; // Basic optimization
    }
    const engagementImpact = (engagementScore - 50) * 0.25;
    
    const predictedRetention = baseRetention + hookImpact + structureImpact + engagementImpact;
    return Math.min(95, Math.max(35, Math.round(predictedRetention)));
  }
  
  static calculateEngagementPrediction(script: any, channelData?: any): any {
    const baseEngagement = channelData?.averageEngagement || 3.5;
    
    // Factors that increase engagement
    let multiplier = 1.0;
    
    // Framework type bonus
    if (script.framework_type === 'youtube_native') {
      multiplier += 0.3; // +30% for YouTube-Native
    }
    
    // Value density analysis
    const hasValueElements = !!(
      script.narrative_flow?.solution ||
      script.narrative_structure?.act2_solution_reveal ||
      script.mainContent
    );
    if (hasValueElements) multiplier += 0.2;
    
    // CTA optimization
    const hasOptimizedCTA = !!(
      script.cta_strategy ||
      script.conversion_strategy
    );
    if (hasOptimizedCTA) multiplier += 0.15;
    
    // Personalization bonus
    if (script.personalization || script.channelPersonalization) {
      multiplier += 0.1;
    }
    
    return {
      expectedLikeRate: Math.round((baseEngagement * multiplier) * 100) / 100,
      expectedCommentRate: Math.round((baseEngagement * 0.25 * multiplier) * 100) / 100,
      expectedShareRate: Math.round((baseEngagement * 0.08 * multiplier) * 100) / 100,
      multiplier: Math.round(multiplier * 100) / 100
    };
  }
  
  static identifyViralElements(script: any): string[] {
    const viralFactors = [];
    const content = JSON.stringify(script).toLowerCase();
    
    // Pattern recognition for viral elements
    if (/segredo|hack|truque|descobri|revelação|nunca.*contou/.test(content)) {
      viralFactors.push("Elemento de exclusividade");
    }
    
    if (/contrário|oposto|diferente|ninguém|todo mundo.*mas/.test(content)) {
      viralFactors.push("Ângulo contrário");
    }
    
    if (/resultado|antes.*depois|transformação|mudança/.test(content)) {
      viralFactors.push("História de transformação");
    }
    
    if (/número|\d+|estatística|%|vezes|dias/.test(content)) {
      viralFactors.push("Conteúdo baseado em dados");
    }
    
    if (/história|aconteceu|experiência|pessoal/.test(content)) {
      viralFactors.push("Narrativa pessoal");
    }
    
    if (/chocante|surpreendente|incrível|devastador/.test(content)) {
      viralFactors.push("Gatilho emocional forte");
    }
    
    if (/sistema|método|estratégia|framework/.test(content)) {
      viralFactors.push("Metodologia única");
    }
    
    return viralFactors;
  }
  
  private static getNicheSpecificBonus(hook: string, niche: string): number {
    const nicheKeywords = {
      'gaming': ['jogar', 'jogo', 'gaming', 'gamer', 'build', 'setup', 'gameplay', 'boss', 'level'],
      'tech': ['tecnologia', 'app', 'software', 'device', 'review', 'specs', 'performance', 'update'],
      'lifestyle': ['vida', 'rotina', 'dicas', 'style', 'day in life', 'morning', 'evening', 'habits'],
      'education': ['aprender', 'curso', 'tutorial', 'ensinar', 'explicar', 'passo', 'método', 'estudo'],
      'business': ['negócio', 'empreender', 'vender', 'marketing', 'lucro', 'dinheiro', 'receita', 'cliente'],
      'fitness': ['treino', 'academia', 'exercício', 'músculo', 'dieta', 'peso', 'forma', 'saúde'],
      'cooking': ['receita', 'cozinhar', 'ingrediente', 'sabor', 'prato', 'culinária', 'chef'],
      'travel': ['viagem', 'destino', 'país', 'cidade', 'cultura', 'aventura', 'mochilão']
    };
    
    const keywords = (nicheKeywords as any)[niche.toLowerCase()] || [];
    const matches = keywords.filter((keyword: string) => 
      hook.toLowerCase().includes(keyword)
    ).length;
    
    return matches * 5; // +5 points per niche keyword
  }
}

// Main Script Generation Function
export async function generateVideoScript(input: ScriptGenerationInput): Promise<VideoScript> {
  const { idea, scriptType, frameworkType, youtubeData, customizations } = input;
  
  try {
    const prompt = generatePromptByFramework(input);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: frameworkType === 'youtube_native' 
            ? "Você é um especialista em roteiros para YouTube que maximizam retenção e engagement usando metodologia científica. Responda sempre em JSON válido seguindo o framework YouTube-Native."
            : "Você é um especialista em criação de roteiros para YouTube. Responda sempre em JSON válido e bem estruturado."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: scriptType === 'basic' ? 1500 : 3500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    return parseVideoScript(content, scriptType, frameworkType, input);
  } catch (error) {
    console.error('Error generating video script:', error);
    throw new Error('Failed to generate video script. Please try again.');
  }
}

// Framework-specific prompt generation
function generatePromptByFramework(input: ScriptGenerationInput): string {
  const { frameworkType, scriptType } = input;
  
  if (frameworkType === 'youtube_native') {
    return scriptType === 'basic' 
      ? generateYouTubeNativeBasicPrompt(input)
      : generateYouTubeNativePremiumPrompt(input);
  } else {
    return scriptType === 'basic'
      ? generateTraditionalBasicPrompt(input)
      : generateTraditionalPremiumPrompt(input);
  }
}

// YouTube-Native Basic Prompt (Scientific Approach)
function generateYouTubeNativeBasicPrompt(input: ScriptGenerationInput): string {
  const { idea, youtubeData, customizations } = input;
  const tone = customizations?.tone || 'casual';
  const duration = customizations?.duration || 'medium';
  
  const channelContext = youtubeData ? `
DADOS COMPLETOS DO CANAL:
- Canal: ${youtubeData.channelTitle || 'N/A'}
- Nicho: ${youtubeData.niche}
- Audiência: ${youtubeData.demographics || 'Geral'}
- Vídeos top performers: ${youtubeData.topPerformingVideos?.map(v => `"${v.title}" (${v.views.toLocaleString()} views)`).join(', ') || 'N/A'}
- Padrões de sucesso: ${youtubeData.successPatterns?.join(', ') || 'N/A'}
- Engagement médio: ${youtubeData.averageEngagement || 'N/A'}%
- Estilo da audiência: ${youtubeData.audienceStyle || 'Engajada'}
- Duração média que funciona: ${duration === 'short' ? '3-5 min' : duration === 'medium' ? '6-8 min' : '8-12 min'}
` : `
NICHO IDENTIFICADO: ${idea.niche || idea.channelType}
AUDIÊNCIA ESTIMADA: ${customizations?.audience || 'Geral do nicho'}
`;

  return `
Você é um especialista em criação de conteúdo para YouTube com 10+ anos de experiência. 
Sua missão é criar roteiros que MAXIMIZAM retenção e engagement, não vendas diretas.

DADOS DO VÍDEO:
- Ideia: ${idea.title}
- Descrição: ${idea.description}
- Categoria: ${idea.channelType}
- Tags principais: ${idea.tags.join(', ')}
- Tom desejado: ${tone}

${channelContext}

FRAMEWORK OBRIGATÓRIO - YOUTUBE-NATIVE:

🎣 HOOK (0-8s): 
- Capture 80%+ da audiência nos primeiros 8 segundos
- ESCOLHA UM DOS 5 TIPOS:
  * curiosity_gap: "O que [AUDIÊNCIA] não sabe sobre [TÓPICO]"
  * contradictory: "Todo mundo diz [CRENÇA], mas [VERDADE OPOSTA]"
  * personal_story: "[EVENTO] que mudou [RESULTADO]"
  * benefit_focused: "[TEMPO] para [RESULTADO ESPECÍFICO]"
  * story_hook: "[SITUAÇÃO DRAMÁTICA] e o que aprendi"
- Adapte à linguagem do nicho ${youtubeData?.niche || idea.niche}
- TESTE: Geraria curiosidade para VOCÊ continuar?

📖 NARRATIVE FLOW (8s-${duration === 'short' ? '5min' : duration === 'medium' ? '8min' : '12min'}):

1. IDENTIFICAÇÃO (8s-90s):
   - Faça viewer se identificar com problema/situação
   - Use story, estatística, ou pain point comum
   - Crie empatia, não venda problema
   - TESTE: Audiência pensaria "isso é comigo"?

2. SOLUÇÃO (90s-80% do vídeo):
   - Revele método/conhecimento prático
   - Step-by-step acionável
   - Exemplos reais, não teorias
   - TESTE: Viewer consegue aplicar hoje?

3. IMPLEMENTAÇÃO (últimos 20%):
   - Como aplicar na prática
   - Ferramentas/recursos específicos
   - Próximos passos claros
   - TESTE: Há valor suficiente para like/comment?

⚡ OTIMIZAÇÕES OBRIGATÓRIAS:
✅ Pattern interrupts a cada 15-20 segundos
✅ Value payoffs a cada 90 segundos  
✅ Open loops para manter curiosidade
✅ Soft CTAs baseados em valor entregue
✅ Callback ao hook no final

❌ EVITAR ABSOLUTAMENTE:
- Tom de carta de vendas ou promocional
- Promessas exageradas ou clickbait enganoso
- Estrutura linear que mata retenção
- CTAs agressivos ou prematuros
- Jargões de marketing

🎯 PERSONALIZAÇÃO:
- Adapte linguagem ao estilo: ${youtubeData?.audienceStyle || 'casual e direto'}
- Use referências do nicho: ${youtubeData?.niche || idea.niche}
- Incorpore padrões que funcionaram: ${youtubeData?.successPatterns?.join(', ') || 'storytelling + valor prático'}

Responda APENAS com JSON neste formato:
{
  "type": "youtube_native_basic",
  "hook": {
    "primary": "Hook otimizado para máxima retenção",
    "type": "curiosity_gap|contradictory|personal_story|benefit_focused|story_hook",
    "estimated_retention": "78%",
    "psychology_used": "Explicação da psicologia aplicada"
  },
  "narrative_flow": {
    "identification": {
      "content": "História de identificação com problema (30-60s de conteúdo)",
      "timing": "0:08-1:30",
      "engagement_elements": ["Pergunta retórica", "Estatística relevante"],
      "psychological_triggers": ["Empathy building", "Problem amplification"]
    },
    "solution": {
      "content": "Método prático step-by-step (2-4 min de conteúdo detalhado)",
      "timing": "1:30-5:00",
      "engagement_elements": ["Exemplo visual", "Pattern interrupt aos 3:00"],
      "value_delivery": ["Framework específico", "Caso real", "Resultado mensurável"]
    },
    "implementation": {
      "content": "Como aplicar + próximos passos (1-2 min)",
      "timing": "5:00-${duration === 'short' ? '6:00' : duration === 'medium' ? '7:30' : '9:00'}",
      "engagement_elements": ["Valor bonus", "Soft CTA"],
      "next_steps": ["Ação imediata", "Recurso específico", "Metric para medir"]
    }
  },
  "cta_strategy": {
    "primary": "CTA baseado em valor entregue e reciprocidade",
    "approach": "Value-first, ask-second",
    "timing": "Após entregar valor significativo"
  },
  "retention_optimization": {
    "pattern_interrupts": ["0:45", "2:15", "3:30", "5:00"],
    "value_payoffs": ["1:00", "2:30", "4:15"],
    "open_loops": ["Hook até 1:30", "2:00 até 3:45", "Tease final aos 5:30"]
  },
  "framework_type": "youtube_native",
  "generatedAt": "${new Date().toISOString()}",
  "promptVersion": "v3.0-youtube-native"
}`;
}

// YouTube-Native Premium Prompt (Advanced Scientific)
function generateYouTubeNativePremiumPrompt(input: ScriptGenerationInput): string {
  const { idea, youtubeData, customizations } = input;
  const tone = customizations?.tone || 'casual';
  const duration = customizations?.duration || 'medium';
  
  const fullChannelAnalysis = youtubeData ? `
CONTEXTO COMPLETO DO CANAL:
${JSON.stringify(youtubeData, null, 2)}
` : `NICHO IDENTIFICADO: ${idea.niche || idea.channelType}`;

  return `
Você é o melhor script writer de YouTube do mundo, responsável por vídeos que geraram 100M+ views.
Sua especialidade é criar roteiros que o algoritmo AMA e audiências VICIAM.

${fullChannelAnalysis}

IDEIA PARA DESENVOLVER:
${JSON.stringify(idea, null, 2)}

CUSTOMIZAÇÕES: Tom ${tone}, Duração ${duration}

MISSÃO: Criar roteiro PREMIUM que:
1. Retenha 85%+ da audiência por 6+ minutos
2. Gere 5%+ engagement rate (likes, comments)
3. Converta 3%+ para subscribers
4. Seja compartilhado naturalmente
5. Rankeie organicamente para keywords

FRAMEWORK YOUTUBE-NATIVE AVANÇADO:

🎣 HOOK SYSTEM (0-8s):
- Gere 3 variações: Curiosity Gap, Personal Story, Contradictory
- Cada hook deve prometer transformação específica
- Use linguagem do nicho mas com twist único
- Inclua emotional trigger baseado em dados do canal
- TESTE: Isso faria VOCÊ parar o scroll?

📖 NARRATIVE ARC (8s-${duration === 'medium' ? '10min+' : duration === 'long' ? '15min+' : '8min'}):
Estruture como série Netflix, não apresentação corporativa:

ACT 1 - IDENTIFICATION (8s-90s):
- Story hook que conecta emocionalmente
- Problem amplification com dados reais
- "Eu também estava nessa situação" moment
- Setup para revelação que vem

ACT 2 - REVELATION (90s-70% do vídeo):  
- Framework/método único e nomeado
- Breakdown step-by-step visual
- Behind-the-scenes de como funciona
- Social proof integrado naturalmente
- Multiple "aha moments"

ACT 3 - TRANSFORMATION (70%-90% do vídeo):
- Como aplicar immediately
- Ferramentas específicas + links
- Casos de sucesso detalhados
- Troubleshooting comum
- Bonus value não prometido

🧠 PSYCHOLOGICAL TRIGGERS:
Integre sutilmente:
- Reciprocity (valor antes de ask)
- Social proof (results, testimonials)
- Authority (expertise demonstration)
- Scarcity (limited-time insights)
- Commitment (viewer takes action)

⚡ RETENTION ENGINEERING:
- Pattern interrupt a cada 12-18 segundos
- Visual variety: talking head → screen → B-roll → graphic
- Audio variety: normal → excited → conversational → urgent
- Pacing: slow reveal → fast implementation → thoughtful conclusion
- Open 3+ loops, close systematicamente
- Value payoff every 75-90 seconds

🎬 PRODUCTION GUIDANCE:
Para cada seção, especifique:
- Visual suggestions (B-roll, screenshots, graphics)
- Audio cues (music changes, SFX)
- Editing notes (cuts, transitions, effects)
- Thumbnail opportunities (reaction shots)

📊 ALGORITHM OPTIMIZATION:
- Comment bait questions integradas naturalmente
- Timestamps que incentivam rewatching
- Cliffhangers para próximo vídeo
- Easter eggs para super-fans
- Seasonal/trending elements quando relevante

🎯 CONVERSION PSYCHOLOGY:
- 90% value, 10% ask
- CTAs que fazem sentido contextualmente
- Community building over subscriber hunting
- Value-based reciprocity triggers
- Natural next step progression

Responda com JSON estruturado contendo TODOS os elementos especificados.
Cada seção deve ser detalhada o suficiente para execução imediata.

FORMATO OBRIGATÓRIO: JSON com estrutura youtube_native_premium completa.`;
}

// Traditional prompts (legacy support)
function generateTraditionalBasicPrompt(input: ScriptGenerationInput): string {
  const { idea, customizations } = input;
  const tone = customizations?.tone || 'casual';
  const duration = customizations?.duration || 'medium';
  
  return `
Crie um roteiro tradicional básico para esta ideia:

TÍTULO: ${idea.title}
DESCRIÇÃO: ${idea.description}
CATEGORIA: ${idea.channelType}
TOM: ${tone}
DURAÇÃO: ${duration}

Responda em JSON:
{
  "type": "traditional_basic",
  "hook": "Hook tradicional",
  "mainPoints": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "cta": "Call to action",
  "estimatedDuration": "5-8 minutos",
  "framework_type": "traditional",
  "generatedAt": "${new Date().toISOString()}",
  "promptVersion": "v1.0-traditional"
}`;
}

function generateTraditionalPremiumPrompt(input: ScriptGenerationInput): string {
  const { idea, youtubeData, customizations } = input;
  // Implementation similar to original premium prompt
  return `[Traditional Premium Prompt - Legacy Support]`;
}

// Enhanced script parsing with framework detection
function parseVideoScript(
  content: string, 
  scriptType: 'basic' | 'premium', 
  frameworkType: 'youtube_native' | 'traditional',
  input: ScriptGenerationInput
): VideoScript {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const scriptData = JSON.parse(jsonMatch[0]);
    
    if (frameworkType === 'youtube_native') {
      if (scriptType === 'basic') {
        return {
          type: 'youtube_native_basic',
          hook: scriptData.hook || {
            primary: 'Erro no processamento',
            type: 'curiosity_gap',
            estimated_retention: '50%',
            psychology_used: 'N/A'
          },
          narrative_flow: scriptData.narrative_flow || {},
          cta_strategy: scriptData.cta_strategy || {},
          retention_optimization: scriptData.retention_optimization || {},
          framework_type: 'youtube_native',
          generatedAt: new Date().toISOString(),
          promptVersion: scriptData.promptVersion || 'v3.0'
        } as YouTubeNativeBasicScript;
      } else {
        return {
          type: 'youtube_native_premium',
          hook_system: scriptData.hook_system || {},
          narrative_structure: scriptData.narrative_structure || {},
          conversion_strategy: scriptData.conversion_strategy || {},
          optimization_data: scriptData.optimization_data || {},
          personalization: scriptData.personalization || {},
          performance_prediction: scriptData.performance_prediction || {},
          post_production_guidance: scriptData.post_production_guidance || {},
          framework_type: 'youtube_native',
          generatedAt: new Date().toISOString(),
          promptVersion: scriptData.promptVersion || 'v3.0'
        } as YouTubeNativePremiumScript;
      }
    } else {
      // Traditional framework parsing (legacy)
      if (scriptType === 'basic') {
        return {
          type: 'traditional_basic',
          hook: scriptData.hook || 'Erro no processamento',
          mainPoints: scriptData.mainPoints || [],
          cta: scriptData.cta || 'Tente novamente',
          estimatedDuration: scriptData.estimatedDuration || '5-8 minutos',
          framework_type: 'traditional',
          generatedAt: new Date().toISOString(),
          promptVersion: scriptData.promptVersion || 'v1.0'
        } as TraditionalBasicScript;
      } else {
        return {
          type: 'traditional_premium',
          hook: scriptData.hook || 'Erro no processamento',
          alternativeHooks: scriptData.alternativeHooks || [],
          introduction: scriptData.introduction || '',
          mainContent: scriptData.mainContent || { sections: [] },
          transitions: scriptData.transitions || [],
          conclusion: scriptData.conclusion || '',
          cta: scriptData.cta || 'Tente novamente',
          seoTags: scriptData.seoTags || [],
          thumbnailSuggestions: scriptData.thumbnailSuggestions || [],
          estimatedDuration: scriptData.estimatedDuration || '8-12 minutos',
          targetAudience: scriptData.targetAudience || 'N/A',
          engagementTips: scriptData.engagementTips || [],
          postingRecommendations: scriptData.postingRecommendations || {},
          performancePrediction: scriptData.performancePrediction || {},
          framework_type: 'traditional',
          generatedAt: new Date().toISOString(),
          promptVersion: scriptData.promptVersion || 'v2.0',
          channelPersonalization: scriptData.channelPersonalization
        } as TraditionalPremiumScript;
      }
    }
  } catch (error) {
    console.error('Error parsing video script:', error);
    throw new Error('Failed to parse generated script. Please try again.');
  }
}