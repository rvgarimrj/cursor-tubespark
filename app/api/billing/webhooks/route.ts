import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyWebhookSignature, getPlanFromPriceId } from '@/lib/billing/stripe';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = verifyWebhookSignature(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient();

    console.log(`Processing webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, session);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(supabase, subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(supabase, invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  supabase: any,
  session: Stripe.Checkout.Session
) {
  const { customer, subscription, metadata } = session;
  const userId = metadata?.userId;

  if (!userId || !customer || !subscription) {
    console.error('Missing required data in checkout session');
    return;
  }

  console.log(`Checkout completed for user ${userId}`);

  try {
    // Update subscription record
    const { error } = await supabase
      .from('subscriptions')
      .update({
        stripe_customer_id: customer as string,
        stripe_subscription_id: subscription as string,
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating subscription after checkout:', error);
    }
  } catch (error) {
    console.error('Error processing checkout completion:', error);
  }
}

async function handleSubscriptionCreated(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const { customer, metadata, items, current_period_start, current_period_end } = subscription;
  const userId = metadata?.userId;
  const planType = metadata?.planType;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  console.log(`Subscription created for user ${userId}`);

  const priceId = items.data[0]?.price.id;
  const detectedPlan = getPlanFromPriceId(priceId) || planType;

  try {
    // Upsert subscription record
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: customer as string,
        stripe_subscription_id: subscription.id,
        plan_type: detectedPlan,
        status: subscription.status,
        current_period_start: new Date(current_period_start * 1000).toISOString(),
        current_period_end: new Date(current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error creating subscription:', error);
    }
  } catch (error) {
    console.error('Error processing subscription creation:', error);
  }
}

async function handleSubscriptionUpdated(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const { customer, metadata, items, current_period_start, current_period_end } = subscription;
  const userId = metadata?.userId;

  if (!userId) {
    // Try to find user by customer ID
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customer)
      .single();

    if (!existingSubscription) {
      console.error('Cannot find user for subscription update');
      return;
    }
    
    // Use found userId
    const foundUserId = existingSubscription.user_id;
    
    const priceId = items.data[0]?.price.id;
    const detectedPlan = getPlanFromPriceId(priceId);

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_type: detectedPlan,
          status: subscription.status,
          current_period_start: new Date(current_period_start * 1000).toISOString(),
          current_period_end: new Date(current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', foundUserId);

      if (error) {
        console.error('Error updating subscription:', error);
      }
    } catch (error) {
      console.error('Error processing subscription update:', error);
    }
  } else {
    console.log(`Subscription updated for user ${userId}`);
    
    const priceId = items.data[0]?.price.id;
    const detectedPlan = getPlanFromPriceId(priceId);

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_type: detectedPlan,
          status: subscription.status,
          current_period_start: new Date(current_period_start * 1000).toISOString(),
          current_period_end: new Date(current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating subscription:', error);
      }
    } catch (error) {
      console.error('Error processing subscription update:', error);
    }
  }
}

async function handleSubscriptionDeleted(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const { customer } = subscription;

  console.log(`Subscription deleted for customer ${customer}`);

  try {
    // Set subscription to canceled
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        plan_type: 'free',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', customer);

    if (error) {
      console.error('Error marking subscription as deleted:', error);
    }
  } catch (error) {
    console.error('Error processing subscription deletion:', error);
  }
}

async function handleInvoicePaymentSucceeded(
  supabase: any,
  invoice: Stripe.Invoice
) {
  const { customer, subscription } = invoice;

  console.log(`Payment succeeded for customer ${customer}`);

  if (subscription) {
    try {
      // Ensure subscription is marked as active
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription);

      if (error) {
        console.error('Error updating subscription after payment:', error);
      }
    } catch (error) {
      console.error('Error processing successful payment:', error);
    }
  }
}

async function handleInvoicePaymentFailed(
  supabase: any,
  invoice: Stripe.Invoice
) {
  const { customer, subscription } = invoice;

  console.log(`Payment failed for customer ${customer}`);

  if (subscription) {
    try {
      // Mark subscription as past due
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription);

      if (error) {
        console.error('Error updating subscription after failed payment:', error);
      }
    } catch (error) {
      console.error('Error processing failed payment:', error);
    }
  }
}