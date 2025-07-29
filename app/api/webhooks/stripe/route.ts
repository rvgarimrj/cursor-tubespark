import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update user subscription in database
        const { error } = await supabase
          .from('users')
          .update({
            subscription_plan: getSubscriptionPlan(subscription),
            subscription_status: subscription.status === 'active' ? 'active' : 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer);

        if (error) {
          console.error('Error updating subscription:', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Downgrade user to free plan
        const { error } = await supabase
          .from('users')
          .update({
            subscription_plan: 'free',
            subscription_status: 'cancelled',
            usage_limit: 10, // Reset to free tier limit
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer);

        if (error) {
          console.error('Error cancelling subscription:', error);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Reset usage count for the new billing period
        if (invoice.billing_reason === 'subscription_cycle') {
          const { error } = await supabase
            .from('users')
            .update({
              usage_count: 0,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', invoice.customer);

          if (error) {
            console.error('Error resetting usage count:', error);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Mark subscription as past due or cancelled
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', invoice.customer);

        if (error) {
          console.error('Error handling failed payment:', error);
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription' && session.customer) {
          // Link Stripe customer to user account
          const { error } = await supabase
            .from('users')
            .update({
              stripe_customer_id: session.customer as string,
              updated_at: new Date().toISOString(),
            })
            .eq('email', session.customer_details?.email);

          if (error) {
            console.error('Error linking customer:', error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

function getSubscriptionPlan(subscription: Stripe.Subscription): 'free' | 'pro' | 'enterprise' {
  // Map Stripe price IDs to subscription plans
  const priceId = subscription.items.data[0]?.price.id;
  
  // You'll need to replace these with your actual Stripe price IDs
  switch (priceId) {
    case process.env.STRIPE_PRO_PRICE_ID:
      return 'pro';
    case process.env.STRIPE_ENTERPRISE_PRICE_ID:
      return 'enterprise';
    default:
      return 'free';
  }
}