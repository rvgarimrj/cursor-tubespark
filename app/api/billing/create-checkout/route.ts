import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession, createStripeCustomer, STRIPE_PLANS } from '@/lib/billing/stripe';
import { PlanType } from '@/types';
import { z } from 'zod';

// Request validation schema
const CreateCheckoutSchema = z.object({
  planType: z.enum(['starter', 'pro', 'business']),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateCheckoutSchema.parse(body);
    const { planType, successUrl, cancelUrl } = validatedData;
    
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get user details
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ 
        success: false,
        error: 'User profile not found' 
      }, { status: 404 });
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription && existingSubscription.plan_type !== 'free') {
      return NextResponse.json({ 
        success: false,
        error: 'User already has an active subscription',
        subscription: existingSubscription
      }, { status: 409 });
    }

    // Get or create Stripe customer
    let customerId = existingSubscription?.stripe_customer_id;
    
    if (!customerId) {
      const customer = await createStripeCustomer(
        userProfile.email,
        userProfile.name,
        user.id
      );
      customerId = customer.id;
    }

    // Get plan configuration
    const planConfig = STRIPE_PLANS[planType as keyof typeof STRIPE_PLANS];
    if (!planConfig) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid plan type' 
      }, { status: 400 });
    }

    // Create URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const finalSuccessUrl = successUrl || `${baseUrl}/dashboard/billing?success=true&plan=${planType}`;
    const finalCancelUrl = cancelUrl || `${baseUrl}/dashboard/billing?canceled=true`;

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      customerId,
      priceId: planConfig.priceId,
      planType: planType as PlanType,
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
      userId: user.id
    });

    // Save or update subscription record (pending state)
    if (existingSubscription) {
      await supabase
        .from('subscriptions')
        .update({
          stripe_customer_id: customerId,
          plan_type: planType,
          status: 'trialing', // Will be updated by webhook
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          stripe_customer_id: customerId,
          plan_type: planType,
          status: 'trialing' // Will be updated by webhook
        });
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      planType,
      planName: planConfig.name,
      price: planConfig.price,
      message: 'Checkout session created successfully'
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    
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
      message: 'Failed to create checkout session. Please try again.'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve available plans
export async function GET() {
  try {
    const plans = Object.entries(STRIPE_PLANS).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      price: plan.price,
      features: plan.features,
      limits: plan.limits,
      priceId: plan.priceId,
      popular: key === 'pro' // Mark Pro as popular
    }));

    return NextResponse.json({
      success: true,
      plans
    });

  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch plans' 
    }, { status: 500 });
  }
}