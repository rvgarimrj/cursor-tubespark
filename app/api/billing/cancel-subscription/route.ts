import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cancelSubscription, reactivateSubscription } from '@/lib/billing/stripe';
import { z } from 'zod';

// Request validation schema
const CancelSubscriptionSchema = z.object({
  immediately: z.boolean().optional().default(false),
  reactivate: z.boolean().optional().default(false)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = CancelSubscriptionSchema.parse(body);
    const { immediately, reactivate } = validatedData;
    
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ 
        success: false,
        error: 'No active subscription found' 
      }, { status: 404 });
    }

    if (!subscription.stripe_subscription_id) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid subscription data' 
      }, { status: 400 });
    }

    let stripeSubscription;

    if (reactivate) {
      // Reactivate subscription
      stripeSubscription = await reactivateSubscription(subscription.stripe_subscription_id);
      
      // Update local subscription record
      await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      return NextResponse.json({
        success: true,
        message: 'Subscription reactivated successfully',
        subscription: {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString()
        }
      });
    } else {
      // Cancel subscription
      stripeSubscription = await cancelSubscription(subscription.stripe_subscription_id, immediately);
      
      // Update local subscription record
      const updateData: any = {
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      };

      if (immediately) {
        updateData.status = 'canceled';
        updateData.plan_type = 'free';
      }

      await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('user_id', user.id);

      return NextResponse.json({
        success: true,
        message: immediately 
          ? 'Subscription canceled immediately' 
          : 'Subscription will be canceled at the end of the current billing period',
        subscription: {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          canceled_immediately: immediately
        }
      });
    }

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to process subscription change. Please try again.'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve subscription status
export async function GET() {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError && subError.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json({ 
        success: false,
        error: 'Failed to fetch subscription' 
      }, { status: 500 });
    }

    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: {
          plan_type: 'free',
          status: 'active',
          cancel_at_period_end: false,
          current_period_end: null
        }
      });
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        plan_type: subscription.plan_type,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        created_at: subscription.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch subscription data' 
    }, { status: 500 });
  }
}