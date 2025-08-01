import { createClient } from '@/lib/supabase/server';
import { PlanType, UsageLimitsCheck } from '@/types';

export async function checkUserLimits(
  userId: string, 
  action: 'idea' | 'script_basic' | 'script_premium' | 'api_call'
): Promise<UsageLimitsCheck> {
  const supabase = createClient();
  
  try {
    // Use the database function we created
    const { data, error } = await supabase
      .rpc('check_user_limits', {
        p_user_id: userId,
        p_action: action
      });

    if (error) {
      console.error('Error checking user limits:', error);
      // Fail-safe: allow the action if we can't check limits
      return {
        allowed: true,
        remaining: 0,
        limit: 0,
        used: 0,
        planType: 'free'
      };
    }

    if (!data || data.length === 0) {
      return {
        allowed: false,
        remaining: 0,
        limit: 0,
        used: 0,
        planType: 'free'
      };
    }

    const result = data[0];
    return {
      allowed: result.allowed,
      remaining: result.remaining,
      limit: result.limit_value,
      used: result.used,
      planType: result.plan_type as PlanType,
      upgradeRequired: !result.allowed
    };

  } catch (error) {
    console.error('Error checking limits:', error);
    // Fail-safe: allow the action
    return {
      allowed: true,
      remaining: 0,
      limit: 0,
      used: 0,
      planType: 'free'
    };
  }
}

export async function incrementUsage(
  userId: string,
  action: 'idea' | 'script_basic' | 'script_premium' | 'api_call'
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .rpc('increment_usage', {
        p_user_id: userId,
        p_action: action
      });

    if (error) {
      console.error('Error incrementing usage:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function getUserPlan(userId: string): Promise<PlanType> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return 'free';
    }

    return data.plan_type as PlanType;
  } catch (error) {
    console.error('Error getting user plan:', error);
    return 'free';
  }
}

export async function getUserUsageSummary(userId: string) {
  const supabase = createClient();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  try {
    const [planResult, usageResult, limitsResult] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('plan_type')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single(),
      
      supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('month_year', currentMonth)
        .single(),
      
      supabase
        .from('plan_limits')
        .select('*')
    ]);

    const planType = planResult.data?.plan_type || 'free';
    const usage = usageResult.data || {
      ideas_generated: 0,
      scripts_basic: 0,
      scripts_premium: 0,
      api_calls: 0
    };

    const planLimits = limitsResult.data?.find(limit => limit.plan_type === planType);

    return {
      planType: planType as PlanType,
      currentUsage: {
        ideasGenerated: usage.ideas_generated,
        scriptsBasic: usage.scripts_basic,
        scriptsPremium: usage.scripts_premium,
        apiCalls: usage.api_calls
      },
      limits: planLimits ? {
        ideasPerMonth: planLimits.ideas_per_month,
        scriptsBasicPerMonth: planLimits.scripts_basic_per_month,
        scriptsPremiumPerMonth: planLimits.scripts_premium_per_month,
        apiCallsPerMonth: planLimits.api_calls_per_month,
        features: planLimits.features,
        priceMonthly: planLimits.price_monthly
      } : null,
      monthYear: currentMonth
    };
  } catch (error) {
    console.error('Error getting usage summary:', error);
    return null;
  }
}

// Helper to get plan features
export async function getUserFeatures(userId: string): Promise<Record<string, boolean>> {
  const planType = await getUserPlan(userId);
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('plan_limits')
      .select('features')
      .eq('plan_type', planType)
      .single();

    if (error || !data) {
      return {
        youtube_integration: true,
        competitor_analysis: false,
        trend_analysis: false,
        api_access: false
      };
    }

    return data.features as Record<string, boolean>;
  } catch (error) {
    console.error('Error getting user features:', error);
    return {
      youtube_integration: true,
      competitor_analysis: false,
      trend_analysis: false,
      api_access: false
    };
  }
}