import { VideoIdea } from './ideas';

export type ScriptType = 'basic' | 'premium';

export interface BaseScript {
  id?: string;
  ideaId?: string;
  userId?: string;
  scriptType: ScriptType;
  generationCost?: number;
  wasUsed?: boolean;
  publishedVideoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BasicScriptContent {
  type: 'basic';
  hook: string;
  mainPoints: string[];
  cta: string;
  estimatedDuration: string;
  generatedAt: string;
  promptVersion: string;
}

export interface PremiumScriptContent {
  type: 'premium';
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
  generatedAt: string;
  promptVersion: string;
  channelPersonalization?: {
    basedOnTopVideos: string[];
    audienceInsights: string;
    successPatterns: string[];
  };
}

export type ScriptContent = BasicScriptContent | PremiumScriptContent;

export interface VideoScript extends BaseScript {
  content: ScriptContent;
}

// For script generation requests
export interface ScriptGenerationRequest {
  ideaId: string;
  scriptType: ScriptType;
  customizations?: {
    tone?: 'professional' | 'casual' | 'energetic';
    duration?: 'short' | 'medium' | 'long';
    audience?: string;
  };
}

export interface ScriptGenerationResponse {
  success: boolean;
  scriptId?: string;
  script?: VideoScript;
  error?: string;
  message?: string;
}

// Engagement tracking types
export type EngagementType = 'favorite' | 'share' | 'copy' | 'time_spent' | 'expand' | 'click_script';

export interface EngagementEvent {
  id?: string;
  userId?: string;
  ideaId: string;
  engagementType: EngagementType;
  engagementValue?: {
    // For time_spent
    timeSpent?: number; // milliseconds
    
    // For share
    platform?: 'twitter' | 'facebook' | 'whatsapp' | 'copy_link';
    
    // For copy
    contentType?: 'idea_title' | 'idea_full' | 'script_section';
    
    // For expand
    section?: 'description' | 'tags' | 'full_content';
    
    // For click_script
    scriptType?: ScriptType;
    fromLocation?: 'idea_card' | 'dashboard' | 'notification';
  };
  createdAt?: string;
}

// Billing types
export type PlanType = 'free' | 'starter' | 'pro' | 'business';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing';

export interface Subscription {
  id?: string;
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  planType: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlanLimits {
  planType: PlanType;
  ideasPerMonth: number; // -1 = unlimited
  scriptsBasicPerMonth: number;
  scriptsPremiumPerMonth: number;
  apiCallsPerMonth: number;
  features: {
    youtubeIntegration?: boolean;
    competitorAnalysis?: boolean;
    trendAnalysis?: boolean;
    apiAccess?: boolean;
    whiteLabel?: boolean;
    multiUser?: boolean;
  };
  priceMonthly: number;
  stripePriceId?: string;
}

export interface UsageTracking {
  id?: string;
  userId: string;
  monthYear: string; // YYYY-MM format
  ideasGenerated: number;
  scriptsBasic: number;
  scriptsPremium: number;
  apiCalls: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsageLimitsCheck {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
  planType: PlanType;
  upgradeRequired?: boolean;
}

// Analytics types
export interface ConversionMetrics {
  ideasGenerated: number;
  ideasFavorited: number;
  scriptsGenerated: number;
  ideasPublished: number;
  successRate: number;
  avgEngagementTime: number;
  topPerformingIdeas: Array<{
    id: string;
    title: string;
    engagementScore: number;
    wasPublished: boolean;
  }>;
}

export interface ROIData {
  successStories: Array<{
    id: string;
    ideaTitle: string;
    scriptUsed: boolean;
    videoUrl?: string;
    publishedAt: string;
    views: number;
    likes: number;
    comments: number;
    estimatedRevenue: number;
  }>;
  totalROI: number;
  insights: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
  }>;
  summary: {
    totalVideos: number;
    totalViews: number;
    avgViewsPerVideo: number;
    scriptsUsedPercentage: number;
  };
}

// YouTube integration types
export interface YouTubeChannelData {
  channelId: string;
  title: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  topPerformingVideos?: Array<{
    title: string;
    views: number;
    likes: number;
    comments: number;
    publishedAt: string;
    engagement: number;
  }>;
  demographics?: string;
  averageViews?: number;
  averageEngagement?: number;
  successPatterns?: string[];
  bestPerformingHours?: string;
}