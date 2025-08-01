import { openai } from './openai';
import { VideoIdeaInput, VideoIdea } from '@/types/ideas';

export async function generateVideoIdeas(input: VideoIdeaInput): Promise<VideoIdea[]> {
  const prompt = createPrompt(input);
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert YouTube content strategist specializing in viral video ideas. Generate creative, engaging, and trend-aware video concepts."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    return parseVideoIdeas(content, input);
  } catch (error) {
    console.error('Error generating video ideas:', error);
    throw new Error('Failed to generate video ideas. Please try again.');
  }
}

function createPrompt(input: VideoIdeaInput): string {
  const { niche, channelType, audienceAge, contentStyle, keywords, language = 'pt' } = input;
  
  const languagePrompts = {
    pt: {
      instruction: "Gere 3 ideias de vídeos virais para YouTube em português brasileiro",
      format: "Para cada ideia, forneça EXATAMENTE neste formato JSON"
    },
    en: {
      instruction: "Generate 3 viral YouTube video ideas in English", 
      format: "For each idea, provide EXACTLY in this JSON format"
    },
    es: {
      instruction: "Genera 3 ideas de videos virales para YouTube en español",
      format: "Para cada idea, proporciona EXACTAMENTE en este formato JSON"
    },
    fr: {
      instruction: "Générez 3 idées de vidéos virales YouTube en français",
      format: "Pour chaque idée, fournissez EXACTEMENT dans ce format JSON"
    }
  };

  const lang = languagePrompts[language] || languagePrompts.pt;

  return `${lang.instruction}:

Canal: ${niche}
Tipo: ${channelType}
Público: ${audienceAge} anos
Estilo: ${contentStyle}
Palavras-chave: ${keywords || 'N/A'}

${lang.format}:
[
  {
    "title": "Título clickbait atrativo",
    "description": "Descrição detalhada do conceito (100-150 palavras)",
    "trendScore": 85,
    "estimatedViews": "50K-100K",
    "difficulty": "Fácil|Médio|Difícil",
    "tags": ["tag1", "tag2", "tag3"],
    "hooks": ["Hook de abertura cativante"],
    "duration": "8-12 min",
    "thumbnailIdea": "Ideia para thumbnail"
  }
]

Foque em:
- Títulos clickbait éticos e atraentes
- Conceitos que geram engajamento 
- Tendências atuais do nicho
- SEO otimizado
- Viabilidade de produção

Responda APENAS com o array JSON válido, sem texto adicional.`;
}

function parseVideoIdeas(content: string, input: VideoIdeaInput): VideoIdea[] {
  try {
    // Clean the content to extract only JSON
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }
    
    const ideas = JSON.parse(jsonMatch[0]);
    
    return ideas.map((idea: any, index: number) => ({
      id: `idea_${Date.now()}_${index}`,
      title: idea.title || 'Untitled Idea',
      description: idea.description || 'No description provided',
      trendScore: Math.min(Math.max(idea.trendScore || 50, 0), 100),
      estimatedViews: idea.estimatedViews || '10K-50K',
      difficulty: idea.difficulty || 'Médio',
      tags: Array.isArray(idea.tags) ? idea.tags : [],
      hooks: Array.isArray(idea.hooks) ? idea.hooks : [],
      duration: idea.duration || '5-10 min',
      thumbnailIdea: idea.thumbnailIdea || 'Thumbnail concept needed',
      niche: input.niche,
      channelType: input.channelType,
      createdAt: new Date().toISOString(),
      status: 'generated' as const
    }));
  } catch (error) {
    console.error('Error parsing video ideas:', error);
    // Fallback: create a basic idea if parsing fails
    return [{
      id: `fallback_${Date.now()}`,
      title: `Ideia para ${input.niche}`,
      description: 'Falha ao processar resposta da IA. Tente novamente com parâmetros diferentes.',
      trendScore: 50,
      estimatedViews: '10K-50K',
      difficulty: 'Médio',
      tags: [input.niche],
      hooks: [],
      duration: '5-10 min',
      thumbnailIdea: 'Thumbnail simples',
      niche: input.niche,
      channelType: input.channelType,
      createdAt: new Date().toISOString(),
      status: 'error' as const
    }];
  }
}