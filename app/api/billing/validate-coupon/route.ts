import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { CouponValidationRequest, CouponValidationResponse } from '@/types/creators';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuth();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: CouponValidationRequest = await request.json();
    const { code, planType } = body;

    if (!code) {
      return NextResponse.json({
        valid: false,
        error: 'Coupon code is required'
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Use the validate_coupon function from the database
    const { data, error } = await supabase
      .rpc('validate_coupon', {
        coupon_code_param: code,
        user_id_param: user.id,
        plan_type_param: planType
      });

    if (error) {
      console.error('Error validating coupon:', error);
      return NextResponse.json({
        valid: false,
        error: 'Failed to validate coupon'
      }, { status: 500 });
    }

    const validationResult = data as {
      valid: boolean;
      error?: string;
      coupon_id?: string;
      affiliate_id?: string;
      discount_type?: 'percentage' | 'fixed';
      discount_value?: number;
      min_purchase_amount?: number;
      description?: string;
    };

    if (!validationResult.valid) {
      return NextResponse.json({
        valid: false,
        error: validationResult.error || 'Invalid coupon'
      });
    }

    const response: CouponValidationResponse = {
      valid: true,
      coupon: {
        id: validationResult.coupon_id!,
        affiliate_id: validationResult.affiliate_id!,
        discount_type: validationResult.discount_type!,
        discount_value: validationResult.discount_value!,
        min_purchase_amount: validationResult.min_purchase_amount!,
        description: validationResult.description
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Coupon validation error:', error);
    
    return NextResponse.json({
      valid: false,
      error: error instanceof Error ? error.message : 'Coupon validation failed'
    }, { status: 500 });
  }
}

// GET endpoint for quick coupon info lookup (without validation)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({
        error: 'Coupon code parameter is required'
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Get basic coupon information without user-specific validation
    const { data: coupon, error } = await supabase
      .from('discount_coupons')
      .select(`
        id,
        code,
        discount_type,
        discount_value,
        description,
        min_purchase_amount,
        max_uses,
        current_uses,
        max_uses_per_user,
        valid_from,
        valid_until,
        applicable_plans,
        is_active,
        affiliates!inner (
          channel_name,
          status
        )
      `)
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json({
          found: false,
          error: 'Coupon not found'
        });
      }
      
      console.error('Error fetching coupon info:', error);
      return NextResponse.json({
        error: 'Failed to fetch coupon information'
      }, { status: 500 });
    }

    // Check basic validity (dates, affiliate status)
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

    const isTimeValid = now >= validFrom && (!validUntil || now <= validUntil);
    const isAffiliateApproved = (coupon.affiliates as any)[0]?.status === 'approved';
    const hasUsesRemaining = !coupon.max_uses || coupon.current_uses < coupon.max_uses;

    return NextResponse.json({
      found: true,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        description: coupon.description,
        min_purchase_amount: coupon.min_purchase_amount,
        applicable_plans: coupon.applicable_plans,
        creator_name: (coupon.affiliates as any)[0]?.channel_name,
        is_valid: isTimeValid && isAffiliateApproved && hasUsesRemaining,
        validation_details: {
          time_valid: isTimeValid,
          affiliate_approved: isAffiliateApproved,
          has_uses_remaining: hasUsesRemaining,
          usage_info: coupon.max_uses ? 
            `${coupon.current_uses}/${coupon.max_uses} uses` : 
            `${coupon.current_uses} uses (unlimited)`
        }
      }
    });

  } catch (error) {
    console.error('Coupon info lookup error:', error);
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to lookup coupon'
    }, { status: 500 });
  }
}