// Types for Creator Partnership System

export type AffiliateTier = 'bronze' | 'silver' | 'gold';
export type AffiliateStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'inactive';
export type CommissionStatus = 'pending' | 'paid' | 'failed' | 'disputed';
export type ActivityType = 'signup' | 'conversion' | 'content_creation' | 'social_share' | 'channel_analysis' | 'application';

export interface Affiliate {
  id: string;
  user_id: string;
  
  // YouTube Channel Information
  youtube_channel_id: string;
  youtube_channel_handle?: string;
  channel_name: string;
  channel_url: string;
  
  // Channel Analytics
  subscriber_count: number;
  average_views: number;
  total_videos: number;
  channel_country?: string;
  channel_language?: string;
  main_categories?: string[];
  
  // Tier and Status
  tier: AffiliateTier;
  status: AffiliateStatus;
  commission_rate: number;
  commission_duration_months: number;
  
  // Performance Metrics
  total_referrals: number;
  total_conversions: number;
  total_commissions_earned: number;
  conversion_rate: number;
  
  // Application Details
  application_notes?: string;
  admin_notes?: string;
  approved_by?: string;
  approved_at?: string;
  
  // Contact and Payment
  contact_email: string;
  payment_method?: any;
  tax_information?: any;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface DiscountCoupon {
  id: string;
  affiliate_id: string;
  
  // Coupon Details
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  description?: string;
  
  // Usage Limits
  max_uses?: number;
  current_uses: number;
  max_uses_per_user: number;
  min_purchase_amount: number;
  
  // Validity
  valid_from: string;
  valid_until?: string;
  
  // Applicable Plans
  applicable_plans?: string[];
  
  // Status
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponUse {
  id: string;
  coupon_id: string;
  user_id: string;
  affiliate_id: string;
  subscription_id?: string;
  
  // Transaction Details
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  
  // Stripe Info
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  
  // Metadata
  user_ip_address?: string;
  user_agent?: string;
  referrer_url?: string;
  
  // Timestamps
  used_at: string;
  created_at: string;
}

export interface AffiliateCommission {
  id: string;
  affiliate_id: string;
  subscription_id: string;
  coupon_use_id?: string;
  
  // Commission Details
  commission_rate: number;
  base_amount: number;
  commission_amount: number;
  
  // Payment Info
  status: CommissionStatus;
  paid_amount: number;
  payment_date?: string;
  stripe_transfer_id?: string;
  
  // Billing Period
  billing_period_start: string;
  billing_period_end: string;
  
  // Metadata
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateActivity {
  id: string;
  affiliate_id: string;
  user_id?: string;
  
  // Activity Details
  activity_type: ActivityType;
  description?: string;
  metadata?: any;
  
  // Performance Tracking
  conversion_value: number;
  commission_earned: number;
  
  // Attribution
  referrer_url?: string;
  landing_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  
  // Timestamp
  created_at: string;
}

// API Request/Response Types

export interface ChannelAnalysisRequest {
  channelUrl: string;
}

export interface ChannelAnalysisResponse {
  success: boolean;
  analysis?: ChannelAnalysis;
  error?: string;
}

export interface ChannelAnalysis {
  channelId: string;
  channelHandle?: string;
  channelName: string;
  channelUrl: string;
  subscriberCount: number;
  averageViews: number;
  totalVideos: number;
  channelCountry?: string;
  channelLanguage?: string;
  mainCategories: string[];
  suggestedTier: AffiliateTier;
  commissionRate: number;
  analysis: {
    growth_trend: 'growing' | 'stable' | 'declining';
    engagement_rate: number;
    content_quality_score: number;
    consistency_score: number;
    niche_strength: number;
    overall_score: number;
    strengths: string[];
    recommendations: string[];
  };
}

export interface CreatorApplicationRequest {
  channelUrl: string;
  contactEmail: string;
  applicationNotes?: string;
  agreesToTerms: boolean;
}

export interface CreatorApplicationResponse {
  success: boolean;
  application?: {
    id: string;
    status: AffiliateStatus;
    suggestedTier: AffiliateTier;
    analysis: ChannelAnalysis;
  };
  error?: string;
}

export interface CouponValidationRequest {
  code: string;
  planType?: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  coupon?: {
    id: string;
    affiliate_id: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_purchase_amount: number;
    description?: string;
  };
  error?: string;
}

export interface AffiliateDashboardStats {
  total_earnings: number;
  pending_earnings: number;
  this_month_earnings: number;
  total_referrals: number;
  active_referrals: number;
  conversion_rate: number;
  generated_at: string;
}

// Tier Configuration
export const TIER_CONFIG = {
  bronze: {
    min_subscribers: 1000,
    max_subscribers: 9999,
    commission_rate: 0.20,
    commission_duration: 12,
    coupon_discount: 0.20
  },
  silver: {
    min_subscribers: 10000,
    max_subscribers: 99999,
    commission_rate: 0.25,
    commission_duration: 18,
    coupon_discount: 0.30
  },
  gold: {
    min_subscribers: 100000,
    max_subscribers: Infinity,
    commission_rate: 0.30,
    commission_duration: null, // Lifetime
    coupon_discount: 0.40
  }
} as const;

// Utility Functions
export function getTierFromSubscribers(subscriberCount: number): AffiliateTier {
  if (subscriberCount >= TIER_CONFIG.gold.min_subscribers) {
    return 'gold';
  } else if (subscriberCount >= TIER_CONFIG.silver.min_subscribers) {
    return 'silver';
  } else {
    return 'bronze';
  }
}

export function getTierConfig(tier: AffiliateTier) {
  return TIER_CONFIG[tier];
}

export function formatCommissionRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}