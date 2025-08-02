import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { 
  AffiliateCommission, 
  CommissionStatus,
  Affiliate 
} from '@/types/creators';

export interface CommissionCreateInput {
  affiliateId: string;
  subscriptionId: string;
  couponUseId?: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
}

export interface CommissionProcessResult {
  success: boolean;
  commissionId?: string;
  commissionAmount?: number;
  error?: string;
}

export interface RecurringCommissionUpdate {
  subscriptionId: string;
  newPeriodStart: string;
  newPeriodEnd: string;
  isActive: boolean;
}

export class CommissionEngine {
  private supabase = createServerSupabaseClient();

  /**
   * Create a new commission for an affiliate
   */
  async createCommission(input: CommissionCreateInput): Promise<CommissionProcessResult> {
    try {
      // Use the database function to create commission
      const { data, error } = await this.supabase
        .rpc('create_affiliate_commission', {
          affiliate_id_param: input.affiliateId,
          subscription_id_param: input.subscriptionId,
          coupon_use_id_param: input.couponUseId || null
        });

      if (error) {
        console.error('Error creating commission:', error);
        return {
          success: false,
          error: error.message
        };
      }

      const result = data as {
        success: boolean;
        commission_id?: string;
        commission_amount?: number;
        error?: string;
      };

      if (!result.success) {
        return {
          success: false,
          error: result.error
        };
      }

      return {
        success: true,
        commissionId: result.commission_id,
        commissionAmount: result.commission_amount
      };

    } catch (error) {
      console.error('Commission creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Commission creation failed'
      };
    }
  }

  /**
   * Process recurring commissions for active subscriptions
   * This should be called monthly or when subscription periods renew
   */
  async processRecurringCommissions(updates: RecurringCommissionUpdate[]): Promise<{
    processed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let processed = 0;

    for (const update of updates) {
      try {
        // Get subscription with affiliate info
        const { data: subscription, error: subError } = await this.supabase
          .from('subscriptions')
          .select(`
            id,
            user_id,
            plan_type,
            referred_by_affiliate_id,
            current_period_start,
            current_period_end,
            status
          `)
          .eq('id', update.subscriptionId)
          .single();

        if (subError || !subscription) {
          errors.push(`Subscription ${update.subscriptionId} not found`);
          continue;
        }

        // Skip if not referred by affiliate or subscription is not active
        if (!subscription.referred_by_affiliate_id || !update.isActive) {
          continue;
        }

        // Get affiliate info to check commission duration
        const { data: affiliate, error: affError } = await this.supabase
          .from('affiliates')
          .select('id, commission_duration_months, status, tier')
          .eq('id', subscription.referred_by_affiliate_id)
          .single();

        if (affError || !affiliate || affiliate.status !== 'approved') {
          errors.push(`Affiliate for subscription ${update.subscriptionId} not found or not approved`);
          continue;
        }

        // Check if commission period has expired (except for Gold tier which is lifetime)
        if (affiliate.commission_duration_months !== null) {
          const firstCommission = await this.getFirstCommissionDate(affiliate.id, subscription.id);
          if (firstCommission) {
            const monthsSinceFirst = this.getMonthsDifference(
              new Date(firstCommission),
              new Date(update.newPeriodStart)
            );

            if (monthsSinceFirst >= affiliate.commission_duration_months) {
              // Commission period has expired
              continue;
            }
          }
        }

        // Create commission for this billing period
        const commissionResult = await this.createCommission({
          affiliateId: affiliate.id,
          subscriptionId: subscription.id,
          billingPeriodStart: update.newPeriodStart,
          billingPeriodEnd: update.newPeriodEnd
        });

        if (commissionResult.success) {
          processed++;
        } else {
          errors.push(`Failed to create commission for subscription ${update.subscriptionId}: ${commissionResult.error}`);
        }

      } catch (error) {
        errors.push(`Error processing subscription ${update.subscriptionId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { processed, errors };
  }

  /**
   * Update commission status (e.g., mark as paid)
   */
  async updateCommissionStatus(
    commissionId: string, 
    status: CommissionStatus,
    paidAmount?: number,
    stripeTransferId?: string,
    notes?: string
  ): Promise<CommissionProcessResult> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'paid') {
        updateData.payment_date = new Date().toISOString();
        if (paidAmount !== undefined) updateData.paid_amount = paidAmount;
        if (stripeTransferId) updateData.stripe_transfer_id = stripeTransferId;
      }

      if (notes) updateData.notes = notes;

      const { data, error } = await this.supabase
        .from('affiliate_commissions')
        .update(updateData)
        .eq('id', commissionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating commission status:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        commissionId: data.id
      };

    } catch (error) {
      console.error('Commission status update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Status update failed'
      };
    }
  }

  /**
   * Get pending commissions for payment processing
   */
  async getPendingCommissions(limit: number = 100): Promise<{
    commissions: AffiliateCommission[];
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('affiliate_commissions')
        .select(`
          *,
          affiliates!inner (
            id,
            channel_name,
            contact_email,
            payment_method,
            status
          )
        `)
        .eq('status', 'pending')
        .eq('affiliates.status', 'approved')
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching pending commissions:', error);
        return {
          commissions: [],
          error: error.message
        };
      }

      return {
        commissions: data || []
      };

    } catch (error) {
      console.error('Pending commissions fetch error:', error);
      return {
        commissions: [],
        error: error instanceof Error ? error.message : 'Failed to fetch pending commissions'
      };
    }
  }

  /**
   * Get commission history for an affiliate
   */
  async getAffiliateCommissions(
    affiliateId: string, 
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    commissions: AffiliateCommission[];
    total: number;
    error?: string;
  }> {
    try {
      // Get total count
      const { count, error: countError } = await this.supabase
        .from('affiliate_commissions')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', affiliateId);

      if (countError) {
        return {
          commissions: [],
          total: 0,
          error: countError.message
        };
      }

      // Get commissions with pagination
      const { data, error } = await this.supabase
        .from('affiliate_commissions')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching affiliate commissions:', error);
        return {
          commissions: [],
          total: count || 0,
          error: error.message
        };
      }

      return {
        commissions: data || [],
        total: count || 0
      };

    } catch (error) {
      console.error('Affiliate commissions fetch error:', error);
      return {
        commissions: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch commissions'
      };
    }
  }

  /**
   * Calculate total commissions owed to an affiliate
   */
  async calculateAffiliateEarnings(affiliateId: string): Promise<{
    totalEarned: number;
    pendingAmount: number;
    paidAmount: number;
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('affiliate_commissions')
        .select('commission_amount, status, paid_amount')
        .eq('affiliate_id', affiliateId);

      if (error) {
        console.error('Error calculating affiliate earnings:', error);
        return {
          totalEarned: 0,
          pendingAmount: 0,
          paidAmount: 0,
          error: error.message
        };
      }

      let totalEarned = 0;
      let pendingAmount = 0;
      let paidAmount = 0;

      data.forEach(commission => {
        totalEarned += commission.commission_amount;
        
        if (commission.status === 'pending') {
          pendingAmount += commission.commission_amount;
        } else if (commission.status === 'paid') {
          paidAmount += commission.paid_amount || commission.commission_amount;
        }
      });

      return {
        totalEarned,
        pendingAmount,
        paidAmount
      };

    } catch (error) {
      console.error('Earnings calculation error:', error);
      return {
        totalEarned: 0,
        pendingAmount: 0,
        paidAmount: 0,
        error: error instanceof Error ? error.message : 'Failed to calculate earnings'
      };
    }
  }

  /**
   * Helper function to get first commission date
   */
  private async getFirstCommissionDate(affiliateId: string, subscriptionId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('affiliate_commissions')
      .select('created_at')
      .eq('affiliate_id', affiliateId)
      .eq('subscription_id', subscriptionId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data.created_at;
  }

  /**
   * Helper function to calculate months difference
   */
  private getMonthsDifference(date1: Date, date2: Date): number {
    const yearDiff = date2.getFullYear() - date1.getFullYear();
    const monthDiff = date2.getMonth() - date1.getMonth();
    return yearDiff * 12 + monthDiff;
  }
}

// Export singleton instance
export const commissionEngine = new CommissionEngine();