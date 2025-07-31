import type { Locale } from './config';

// Import all translation files
import ptTranslations from './locales/pt.json';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';

// Type for nested object keys
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKey = NestedKeyOf<typeof ptTranslations>;

// All translations
const translations = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
} as const;

// Helper function to get nested value from object using dot notation
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

// Main translation function
export function t(key: TranslationKey, locale: Locale = 'pt'): string {
  const translation = getNestedValue(translations[locale], key);
  
  // Fallback to Portuguese if translation not found
  if (translation === key && locale !== 'pt') {
    return getNestedValue(translations.pt, key);
  }
  
  return translation;
}

// Hook-like function for use in components
export function useTranslations(locale: Locale) {
  return {
    t: (key: TranslationKey) => t(key, locale),
    locale,
  };
}

// Landing page translations
export const landingTranslations = {
  pt: {
    title: "Gere Ideias Virais de Vídeos com IA",
    subtitle: "Pare de lutar contra o bloqueio criativo. TubeSpark analisa seu canal do YouTube, tendências atuais e competidores para gerar ideias personalizadas de vídeo que aumentam o engajamento e crescimento.",
    features: "Recursos",
    pricing: "Preços", 
    about: "Sobre",
    signIn: "Entrar",
    getStarted: "Começar",
    startCreating: "Começar a Criar Ideias",
    watchDemo: "Ver Demo",
    activeCreators: "Criadores Ativos",
    ideasGenerated: "Ideias Geradas",
    viralVideos: "Vídeos Virais Criados",
    featuresTitle: "Tudo que você precisa para criar conteúdo viral",
    featuresSubtitle: "Nossa IA analisa os dados do seu canal, tópicos em alta e estratégias de competidores para gerar ideias personalizadas de vídeo que seu público vai amar.",
    aiPowered: "Ideias com IA",
    aiPoweredDesc: "Gere ideias ilimitadas de vídeo adaptadas ao seu nicho, público e estilo de conteúdo usando modelos avançados de IA.",
    trendAnalysis: "Análise de Tendências",
    trendAnalysisDesc: "Fique à frente da curva com análise de tendências em tempo real e sugestões de tópicos virais baseados em dados atuais.",
    competitorInsights: "Insights de Competidores",
    competitorInsightsDesc: "Analise o que está funcionando para canais similares e descubra lacunas de conteúdo que você pode preencher.",
    seoOptimization: "Otimização SEO",
    seoOptimizationDesc: "Obtenha sugestões de títulos, tags e descrições otimizadas para o algoritmo do YouTube e rankings de busca.",
    channelAnalysis: "Análise de Canal",
    channelAnalysisDesc: "Conecte seu canal do YouTube para obter insights personalizados e recomendações baseadas nos seus dados de performance.",
    contentCalendar: "Calendário de Conteúdo",
    contentCalendarDesc: "Planeje e agende seu conteúdo com um calendário inteligente que sugere horários ideais de postagem.",
    ctaTitle: "Pronto para criar conteúdo viral?",
    ctaSubtitle: "Junte-se a milhares de criadores que já estão usando TubeSpark para crescer seus canais do YouTube.",
    ctaButton: "Começar Gratuitamente",
    copyright: "© 2025 TubeSpark. Todos os direitos reservados."
  },
  en: {
    title: "Generate Viral Video Ideas with AI",
    subtitle: "Stop struggling with writer's block. TubeSpark analyzes your YouTube channel, current trends, and competitors to generate personalized video ideas that drive engagement and growth.",
    features: "Features",
    pricing: "Pricing",
    about: "About", 
    signIn: "Sign In",
    getStarted: "Get Started",
    startCreating: "Start Creating Ideas",
    watchDemo: "Watch Demo",
    activeCreators: "Active Creators",
    ideasGenerated: "Ideas Generated",
    viralVideos: "Viral Videos Created",
    featuresTitle: "Everything you need to create viral content",
    featuresSubtitle: "Our AI analyzes your channel data, trending topics, and competitor strategies to generate personalized video ideas that your audience will love.",
    aiPowered: "AI-Powered Ideas",
    aiPoweredDesc: "Generate unlimited video ideas tailored to your niche, audience, and content style using advanced AI models.",
    trendAnalysis: "Trend Analysis",
    trendAnalysisDesc: "Stay ahead of the curve with real-time trend analysis and viral topic suggestions based on current data.",
    competitorInsights: "Competitor Insights",
    competitorInsightsDesc: "Analyze what's working for similar channels and discover content gaps you can fill.",
    seoOptimization: "SEO Optimization",
    seoOptimizationDesc: "Get title suggestions, tags, and descriptions optimized for YouTube's algorithm and search rankings.",
    channelAnalysis: "Channel Analysis",
    channelAnalysisDesc: "Connect your YouTube channel to get personalized insights and recommendations based on your performance data.",
    contentCalendar: "Content Calendar",
    contentCalendarDesc: "Plan and schedule your content with an intelligent calendar that suggests optimal posting times.",
    ctaTitle: "Ready to create viral content?",
    ctaSubtitle: "Join thousands of creators who are already using TubeSpark to grow their YouTube channels.",
    ctaButton: "Get Started for Free",
    copyright: "© 2025 TubeSpark. All rights reserved."
  },
  es: {
    title: "Genera Ideas de Vídeos Virales con IA",
    subtitle: "Deja de luchar contra el bloqueo creativo. TubeSpark analiza tu canal de YouTube, tendencias actuales y competidores para generar ideas personalizadas de vídeo que impulsan el engagement y crecimiento.",
    features: "Características",
    pricing: "Precios",
    about: "Acerca de",
    signIn: "Iniciar Sesión", 
    getStarted: "Empezar",
    startCreating: "Empezar a Crear Ideas",
    watchDemo: "Ver Demo",
    activeCreators: "Creadores Activos",
    ideasGenerated: "Ideas Generadas",
    viralVideos: "Vídeos Virales Creados",
    featuresTitle: "Todo lo que necesitas para crear contenido viral",
    featuresSubtitle: "Nuestra IA analiza los datos de tu canal, temas trending y estrategias de competidores para generar ideas personalizadas de vídeo que tu audiencia amará.",
    aiPowered: "Ideas con IA",
    aiPoweredDesc: "Genera ideas ilimitadas de vídeo adaptadas a tu nicho, audiencia y estilo de contenido usando modelos avanzados de IA.",
    trendAnalysis: "Análisis de Tendencias",
    trendAnalysisDesc: "Mantente a la vanguardia con análisis de tendencias en tiempo real y sugerencias de temas virales basadas en datos actuales.",
    competitorInsights: "Insights de Competidores",
    competitorInsightsDesc: "Analiza qué está funcionando para canales similares y descubre brechas de contenido que puedes llenar.",
    seoOptimization: "Optimización SEO",
    seoOptimizationDesc: "Obtén sugerencias de títulos, etiquetas y descripciones optimizadas para el algoritmo de YouTube y rankings de búsqueda.",
    channelAnalysis: "Análisis de Canal",
    channelAnalysisDesc: "Conecta tu canal de YouTube para obtener insights personalizados y recomendaciones basadas en tus datos de rendimiento.",
    contentCalendar: "Calendario de Contenido",
    contentCalendarDesc: "Planifica y programa tu contenido con un calendario inteligente que sugiere tiempos óptimos de publicación.",
    ctaTitle: "¿Listo para crear contenido viral?",
    ctaSubtitle: "Únete a miles de creadores que ya están usando TubeSpark para hacer crecer sus canales de YouTube.",
    ctaButton: "Empezar Gratis",
    copyright: "© 2025 TubeSpark. Todos los derechos reservados."
  },
  fr: {
    title: "Générez des Idées de Vidéos Virales avec l'IA",
    subtitle: "Arrêtez de lutter contre le blocage créatif. TubeSpark analyse votre chaîne YouTube, les tendances actuelles et les concurrents pour générer des idées vidéo personnalisées qui stimulent l'engagement et la croissance.",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    about: "À propos",
    signIn: "Se Connecter",
    getStarted: "Commencer",
    startCreating: "Commencer à Créer des Idées", 
    watchDemo: "Voir la Démo",
    activeCreators: "Créateurs Actifs",
    ideasGenerated: "Idées Générées",
    viralVideos: "Vidéos Virales Créées",
    featuresTitle: "Tout ce dont vous avez besoin pour créer du contenu viral",
    featuresSubtitle: "Notre IA analyse les données de votre chaîne, les sujets tendance et les stratégies de concurrents pour générer des idées vidéo personnalisées que votre audience adorera.",
    aiPowered: "Idées Alimentées par l'IA",
    aiPoweredDesc: "Générez des idées vidéo illimitées adaptées à votre niche, audience et style de contenu en utilisant des modèles d'IA avancés.",
    trendAnalysis: "Analyse des Tendances",
    trendAnalysisDesc: "Restez en avance sur la courbe avec une analyse des tendances en temps réel et des suggestions de sujets viraux basées sur les données actuelles.",
    competitorInsights: "Insights Concurrents",
    competitorInsightsDesc: "Analysez ce qui fonctionne pour des chaînes similaires et découvrez les lacunes de contenu que vous pouvez combler.",
    seoOptimization: "Optimisation SEO",
    seoOptimizationDesc: "Obtenez des suggestions de titres, tags et descriptions optimisées pour l'algorithme YouTube et les classements de recherche.",
    channelAnalysis: "Analyse de Chaîne",
    channelAnalysisDesc: "Connectez votre chaîne YouTube pour obtenir des insights personnalisés et des recommandations basées sur vos données de performance.",
    contentCalendar: "Calendrier de Contenu",
    contentCalendarDesc: "Planifiez et programmez votre contenu avec un calendrier intelligent qui suggère des heures de publication optimales.",
    ctaTitle: "Prêt à créer du contenu viral ?",
    ctaSubtitle: "Rejoignez des milliers de créateurs qui utilisent déjà TubeSpark pour faire croître leurs chaînes YouTube.",
    ctaButton: "Commencer Gratuitement",
    copyright: "© 2025 TubeSpark. Tous droits réservés."
  }
} as const;

export type LandingTranslationKey = keyof typeof landingTranslations.pt;