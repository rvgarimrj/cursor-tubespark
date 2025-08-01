import { createClient } from '@/lib/supabase/server';
import { YouTubeNativeAnalytics } from '@/lib/ai/script-generator';

// Enhanced Analytics for YouTube-Native Framework
export class YouTubeNativeAnalyticsService {
  
  /**
   * Analyzes a script and calculates all performance metrics
   */
  static async analyzeScript(script: any, channelData?: any): Promise<ScriptAnalysis> {
    const hookText = this.extractHookText(script);
    const niche = channelData?.niche || script.niche || 'general';
    
    // Core analysis
    const hookStrength = YouTubeNativeAnalytics.analyzeHookStrength(hookText, niche);
    const retentionPrediction = YouTubeNativeAnalytics.calculateRetentionPrediction(script);
    const engagementPrediction = YouTubeNativeAnalytics.calculateEngagementPrediction(script, channelData);
    const viralElements = YouTubeNativeAnalytics.identifyViralElements(script);
    
    // Advanced calculations
    const narrativeScore = this.calculateNarrativeFlowScore(script);
    const algorithmScore = this.calculateAlgorithmOptimizationScore(script);
    const personalizedScore = this.calculatePersonalizationScore(script, channelData);
    
    // Performance predictions
    const performancePrediction = this.calculatePerformancePrediction({
      hookStrength,
      narrativeScore,
      algorithmScore,
      personalizedScore,
      frameworkType: script.framework_type,
      scriptType: script.type
    });
    
    return {
      hookStrength,
      narrativeScore,
      algorithmScore,
      personalizedScore,
      retentionPrediction,
      engagementPrediction,
      viralElements,
      performancePrediction,
      overallQualityScore: this.calculateOverallQualityScore({
        hookStrength,
        narrativeScore,
        algorithmScore,
        personalizedScore
      }),
      confidenceLevel: this.calculateConfidenceLevel(script, channelData)
    };
  }
  
  /**
   * Saves script analysis to database with all calculated metrics
   */
  static async saveScriptWithAnalysis(
    userId: string,
    ideaId: string,
    script: any,
    analysis: ScriptAnalysis
  ): Promise<string> {
    const supabase = createClient();
    
    // Prepare engagement prediction JSONB
    const engagementPredictionData = {
      expectedLikeRate: analysis.engagementPrediction.expectedLikeRate,
      expectedCommentRate: analysis.engagementPrediction.expectedCommentRate,
      expectedShareRate: analysis.engagementPrediction.expectedShareRate,
      multiplier: analysis.engagementPrediction.multiplier,
      calculatedAt: new Date().toISOString()
    };
    
    // Prepare viral factors JSONB
    const viralFactorsData = analysis.viralElements.map((element, index) => ({
      id: index + 1,
      factor: element,
      weight: this.getViralElementWeight(element)
    }));
    
    // Prepare optimization data JSONB
    const optimizationData = {
      retention_curve_prediction: `${analysis.retentionPrediction}% based on hook strength and narrative flow`,
      engagement_hotspots: this.identifyEngagementHotspots(script),
      algorithm_factors: this.identifyAlgorithmFactors(script),
      viral_probability_score: analysis.viralElements.length * 15, // Each viral element adds 15 points
      performance_prediction: analysis.performancePrediction
    };
    
    // Prepare personalization data JSONB
    const personalizationData = script.personalization || script.channelPersonalization || {};
    
    // Insert script with all analysis data
    const { data, error } = await supabase
      .from('video_scripts')
      .insert({
        user_id: userId,
        idea_id: ideaId,
        script_type: script.type === 'youtube_native_premium' || script.type === 'traditional_premium' ? 'premium' : 'basic',
        content: script,
        framework_type: script.framework_type || 'youtube_native',
        hook_strength: analysis.hookStrength,
        narrative_flow_score: analysis.narrativeScore,
        algorithm_optimization_score: analysis.algorithmScore,
        retention_score: analysis.overallQualityScore,
        predicted_retention: analysis.retentionPrediction,
        predicted_engagement: analysis.engagementPrediction.expectedLikeRate,
        predicted_ctr: analysis.performancePrediction.ctr,
        confidence_level: analysis.confidenceLevel,
        engagement_prediction: engagementPredictionData,
        viral_factors: viralFactorsData,
        optimization_data: optimizationData,
        personalization_data: personalizationData,
        generation_cost: script.type.includes('premium') ? 0.08 : 0.03, // OpenAI cost estimation
        was_used: false
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error saving script with analysis:', error);
      throw new Error('Failed to save script analysis');
    }
    
    return data.id;
  }
  
  /**
   * Gets performance comparison between YouTube-Native and Traditional scripts
   */
  static async getPerformanceComparison(userId: string): Promise<PerformanceComparison> {
    const supabase = createClient();
    
    // Get YouTube-Native scripts
    const { data: youtubeNativeScripts } = await supabase
      .from('video_scripts')
      .select('*')
      .eq('user_id', userId)
      .eq('framework_type', 'youtube_native');
    
    // Get Traditional scripts
    const { data: traditionalScripts } = await supabase
      .from('video_scripts')
      .select('*')
      .eq('user_id', userId)
      .eq('framework_type', 'traditional');
    
    const youtubeNativeMetrics = this.calculateAverageMetrics(youtubeNativeScripts || []);
    const traditionalMetrics = this.calculateAverageMetrics(traditionalScripts || []);
    
    return {
      youtubeNative: {
        count: youtubeNativeScripts?.length || 0,
        averageHookStrength: youtubeNativeMetrics.hookStrength,
        averageRetention: youtubeNativeMetrics.retention,
        averageEngagement: youtubeNativeMetrics.engagement,
        averageQualityScore: youtubeNativeMetrics.qualityScore
      },
      traditional: {
        count: traditionalScripts?.length || 0,
        averageHookStrength: traditionalMetrics.hookStrength,
        averageRetention: traditionalMetrics.retention,
        averageEngagement: traditionalMetrics.engagement,
        averageQualityScore: traditionalMetrics.qualityScore
      },
      improvement: {
        hookStrength: ((youtubeNativeMetrics.hookStrength - traditionalMetrics.hookStrength) / traditionalMetrics.hookStrength) * 100,
        retention: ((youtubeNativeMetrics.retention - traditionalMetrics.retention) / traditionalMetrics.retention) * 100,
        engagement: ((youtubeNativeMetrics.engagement - traditionalMetrics.engagement) / traditionalMetrics.engagement) * 100,
        qualityScore: ((youtubeNativeMetrics.qualityScore - traditionalMetrics.qualityScore) / traditionalMetrics.qualityScore) * 100
      }
    };
  }
  
  /**
   * Gets user's script performance summary
   */
  static async getUserScriptSummary(userId: string): Promise<UserScriptSummary> {
    const supabase = createClient();
    
    const { data: summary } = await supabase
      .rpc('get_youtube_native_performance_summary', {
        user_id_param: userId
      });
    
    if (!summary) {
      return {
        totalScripts: 0,
        avgRetention: 0,
        avgHookStrength: 0,
        topPerforming: [],
        recentTrends: []
      };
    }
    
    // Get recent performance trends (last 30 days)
    const { data: recentScripts } = await supabase
      .from('video_scripts')
      .select('predicted_retention, hook_strength, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });
    
    const trends = this.calculateTrends(recentScripts || []);
    
    return {
      totalScripts: summary.total_scripts,
      avgRetention: summary.avg_retention,
      avgHookStrength: summary.avg_hook_strength,
      topPerforming: summary.top_performing || [],
      recentTrends: trends
    };
  }
  
  // Private helper methods
  
  private static extractHookText(script: any): string {
    if (script.hook_system?.primary) return script.hook_system.primary;
    if (script.hook?.primary) return script.hook.primary;
    if (script.hook && typeof script.hook === 'string') return script.hook;
    return '';
  }
  
  private static calculateNarrativeFlowScore(script: any): number {
    let score = 50; // Base score
    
    // YouTube-Native structure bonus
    if (script.narrative_structure || script.narrative_flow) {
      score += 20;
      
      // Check for proper act structure
      if (script.narrative_structure?.act1_identification) score += 10;
      if (script.narrative_structure?.act2_solution_reveal) score += 10;
      if (script.narrative_structure?.act3_implementation) score += 10;
      
      // Check for engagement elements
      const hasEngagementElements = !!(
        script.narrative_structure?.act1_identification?.engagement_mechanics ||
        script.narrative_flow?.identification?.engagement_elements
      );
      if (hasEngagementElements) score += 15;
    }
    
    // Traditional structure (lower score)
    if (script.mainContent?.sections) {
      score += 10;
      score += Math.min(15, script.mainContent.sections.length * 3);
    }
    
    return Math.min(100, Math.max(0, score));
  }
  
  private static calculateAlgorithmOptimizationScore(script: any): number {
    let score = 50; // Base score
    
    // YouTube-Native optimization elements
    if (script.retention_optimization) {
      if (script.retention_optimization.pattern_interrupts?.length > 0) score += 15;
      if (script.retention_optimization.value_payoffs?.length > 0) score += 15;
      if (script.retention_optimization.open_loops?.length > 0) score += 10;
    }
    
    if (script.optimization_data) {
      if (script.optimization_data.algorithm_factors?.length > 0) score += 15;
      if (script.optimization_data.engagement_hotspots?.length > 0) score += 10;
    }
    
    // Engagement tips (traditional)
    if (script.engagementTips?.length > 0) {
      score += Math.min(20, script.engagementTips.length * 3);
    }
    
    return Math.min(100, Math.max(0, score));
  }
  
  private static calculatePersonalizationScore(script: any, channelData?: any): number {
    let score = 50; // Base score
    
    if (!channelData) return score;
    
    // Personalization elements
    if (script.personalization) {
      if (script.personalization.channel_adaptation) score += 20;
      if (script.personalization.trend_integration) score += 10;
    }
    
    if (script.channelPersonalization) {
      if (script.channelPersonalization.basedOnTopVideos?.length > 0) score += 15;
      if (script.channelPersonalization.successPatterns?.length > 0) score += 15;
    }
    
    return Math.min(100, Math.max(0, score));
  }
  
  private static calculatePerformancePrediction(metrics: {
    hookStrength: number;
    narrativeScore: number;
    algorithmScore: number;
    personalizedScore: number;
    frameworkType: string;
    scriptType: string;
  }): PerformancePrediction {
    const { hookStrength, narrativeScore, algorithmScore, personalizedScore, frameworkType, scriptType } = metrics;
    
    // Base metrics
    let baseCTR = 4.5;
    let baseViews = 10000;
    let baseSubscriberConversion = 2.0;
    
    // Framework bonus
    if (frameworkType === 'youtube_native') {
      baseCTR += 1.5;
      baseViews *= 1.8;
      baseSubscriberConversion += 1.5;
    }
    
    // Script type bonus
    if (scriptType.includes('premium')) {
      baseCTR += 0.8;
      baseViews *= 1.4;
      baseSubscriberConversion += 0.8;
    }
    
    // Calculate multipliers from scores
    const avgScore = (hookStrength + narrativeScore + algorithmScore + personalizedScore) / 4;
    const multiplier = 0.5 + (avgScore / 100) * 1.5; // 0.5x to 2x multiplier
    
    return {
      ctr: Math.round((baseCTR * multiplier) * 100) / 100,
      estimatedViews: Math.round(baseViews * multiplier),
      subscriberConversion: Math.round((baseSubscriberConversion * multiplier) * 100) / 100,
      viralProbability: Math.min(95, Math.round((avgScore - 50) * 0.9 + 25)) // 25-95% range
    };
  }
  
  private static calculateOverallQualityScore(metrics: {
    hookStrength: number;
    narrativeScore: number;
    algorithmScore: number;
    personalizedScore: number;
  }): number {
    const { hookStrength, narrativeScore, algorithmScore, personalizedScore } = metrics;
    
    // Weighted average (hook is most important)
    return Math.round(
      hookStrength * 0.4 +
      narrativeScore * 0.3 +
      algorithmScore * 0.2 +
      personalizedScore * 0.1
    );
  }
  
  private static calculateConfidenceLevel(script: any, channelData?: any): 'low' | 'medium' | 'high' {
    let confidenceScore = 0;
    
    // Framework type
    if (script.framework_type === 'youtube_native') confidenceScore += 30;
    else confidenceScore += 10;
    
    // Script type
    if (script.type?.includes('premium')) confidenceScore += 25;
    else confidenceScore += 15;
    
    // Channel data availability
    if (channelData?.topPerformingVideos?.length > 0) confidenceScore += 20;
    if (channelData?.successPatterns?.length > 0) confidenceScore += 15;
    if (channelData?.averageEngagement) confidenceScore += 10;
    
    if (confidenceScore >= 80) return 'high';
    if (confidenceScore >= 50) return 'medium';
    return 'low';
  }
  
  private static identifyEngagementHotspots(script: any): string[] {
    const hotspots = [];
    
    if (script.hook_system || script.hook) {
      hotspots.push("0:00-0:08 - Hook crítico para retenção");
    }
    
    if (script.narrative_structure?.act2_solution_reveal || script.narrative_flow?.solution) {
      hotspots.push("2:00-5:00 - Revelação da solução (máximo engagement)");
    }
    
    if (script.retention_optimization?.pattern_interrupts) {
      script.retention_optimization.pattern_interrupts.forEach((time: string) => {
        hotspots.push(`${time} - Pattern interrupt moment`);
      });
    }
    
    return hotspots;
  }
  
  private static identifyAlgorithmFactors(script: any): string[] {
    const factors = [];
    
    if (script.framework_type === 'youtube_native') {
      factors.push("Estrutura otimizada para retenção");
      factors.push("Hook científico baseado em psicologia");
    }
    
    if (script.retention_optimization) {
      factors.push("Pattern interrupts programados");
      factors.push("Value payoffs estratégicos");
    }
    
    if (script.conversion_strategy?.soft_ctas || script.cta_strategy) {
      factors.push("CTAs não-intrusivos e baseados em valor");
    }
    
    return factors;
  }
  
  private static getViralElementWeight(element: string): number {
    const weights: Record<string, number> = {
      "Elemento de exclusividade": 20,
      "Ângulo contrário": 18,
      "História de transformação": 16,
      "Conteúdo baseado em dados": 14,
      "Narrativa pessoal": 12,
      "Gatilho emocional forte": 15,
      "Metodologia única": 17
    };
    
    return weights[element] || 10;
  }
  
  private static calculateAverageMetrics(scripts: any[]): {
    hookStrength: number;
    retention: number;
    engagement: number;
    qualityScore: number;
  } {
    if (scripts.length === 0) {
      return { hookStrength: 0, retention: 0, engagement: 0, qualityScore: 0 };
    }
    
    const totals = scripts.reduce((acc, script) => ({
      hookStrength: acc.hookStrength + (script.hook_strength || 0),
      retention: acc.retention + (script.predicted_retention || 0),
      engagement: acc.engagement + (script.predicted_engagement || 0),
      qualityScore: acc.qualityScore + (script.retention_score || 0)
    }), { hookStrength: 0, retention: 0, engagement: 0, qualityScore: 0 });
    
    return {
      hookStrength: Math.round(totals.hookStrength / scripts.length),
      retention: Math.round(totals.retention / scripts.length),
      engagement: Math.round((totals.engagement / scripts.length) * 100) / 100,
      qualityScore: Math.round(totals.qualityScore / scripts.length)
    };
  }
  
  private static calculateTrends(recentScripts: any[]): TrendData[] {
    // Group scripts by week
    const weeklyData: Record<string, { retention: number[], hookStrength: number[] }> = {};
    
    recentScripts.forEach(script => {
      const weekStart = new Date(script.created_at);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { retention: [], hookStrength: [] };
      }
      
      weeklyData[weekKey].retention.push(script.predicted_retention || 0);
      weeklyData[weekKey].hookStrength.push(script.hook_strength || 0);
    });
    
    return Object.entries(weeklyData).map(([week, data]) => ({
      week,
      avgRetention: data.retention.reduce((a, b) => a + b, 0) / data.retention.length,
      avgHookStrength: data.hookStrength.reduce((a, b) => a + b, 0) / data.hookStrength.length,
      scriptCount: data.retention.length
    })).sort((a, b) => a.week.localeCompare(b.week));
  }
}

// Types for the analytics service
export interface ScriptAnalysis {
  hookStrength: number;
  narrativeScore: number;
  algorithmScore: number;
  personalizedScore: number;
  retentionPrediction: number;
  engagementPrediction: {
    expectedLikeRate: number;
    expectedCommentRate: number;
    expectedShareRate: number;
    multiplier: number;
  };
  viralElements: string[];
  performancePrediction: PerformancePrediction;
  overallQualityScore: number;
  confidenceLevel: 'low' | 'medium' | 'high';
}

export interface PerformancePrediction {
  ctr: number;
  estimatedViews: number;
  subscriberConversion: number;
  viralProbability: number;
}

export interface PerformanceComparison {
  youtubeNative: {
    count: number;
    averageHookStrength: number;
    averageRetention: number;
    averageEngagement: number;
    averageQualityScore: number;
  };
  traditional: {
    count: number;
    averageHookStrength: number;
    averageRetention: number;
    averageEngagement: number;
    averageQualityScore: number;
  };
  improvement: {
    hookStrength: number;
    retention: number;
    engagement: number;
    qualityScore: number;
  };
}

export interface UserScriptSummary {
  totalScripts: number;
  avgRetention: number;
  avgHookStrength: number;
  topPerforming: Array<{
    id: string;
    retention_score: number;
    predicted_retention: number;
    hook_strength: number;
    idea_title: string;
    was_used: boolean;
  }>;
  recentTrends: TrendData[];
}

export interface TrendData {
  week: string;
  avgRetention: number;
  avgHookStrength: number;
  scriptCount: number;
}