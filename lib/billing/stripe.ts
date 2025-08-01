import Stripe from 'stripe';
import { PlanType } from '@/types';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
});

// Plan configurations
export const STRIPE_PLANS = {
  starter: {
    name: 'TubeSpark Starter',
    price: 9.99,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter_placeholder',
    features: [
      '100 ideias por mês',
      '20 roteiros básicos',
      '5 roteiros premium',
      'Análise de tendências',
      'Suporte por email'
    ],
    limits: {
      ideasPerMonth: 100,
      scriptsBasicPerMonth: 20,
      scriptsPremiumPerMonth: 5,
      apiCallsPerMonth: 1000
    }
  },
  pro: {
    name: 'TubeSpark Pro',
    price: 29.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
    features: [
      'Ideias ilimitadas',
      'Roteiros básicos ilimitados',
      '50 roteiros premium por mês',
      'Análise de concorrentes',
      'Análise de tendências avançada',
      'Integração YouTube completa',
      'Suporte prioritário'
    ],
    limits: {
      ideasPerMonth: -1,
      scriptsBasicPerMonth: -1,
      scriptsPremiumPerMonth: 50,
      apiCallsPerMonth: 5000
    }
  },
  business: {
    name: 'TubeSpark Business',
    price: 99.99,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business_placeholder',
    features: [
      'Tudo do Pro',
      'Roteiros premium ilimitados',
      'Acesso à API',
      'White-label (em breve)',
      'Multi-usuário (em breve)',
      'Suporte dedicado',
      'Relatórios avançados'
    ],
    limits: {
      ideasPerMonth: -1,
      scriptsBasicPerMonth: -1,
      scriptsPremiumPerMonth: -1,
      apiCallsPerMonth: 25000
    }
  }
} as const;

export type StripePlanKey = keyof typeof STRIPE_PLANS;

// Create customer
export async function createStripeCustomer(
  email: string,
  name?: string,
  userId?: string
): Promise<Stripe.Customer> {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId: userId || ''
    }
  });

  return customer;
}

// Create checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  planType,
  successUrl,
  cancelUrl,
  userId
}: {
  customerId?: string;
  priceId: string;
  planType: PlanType;
  successUrl: string;
  cancelUrl: string;
  userId: string;
}): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planType
    },
    subscription_data: {
      metadata: {
        userId,
        planType
      }
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    customer_creation: customerId ? undefined : 'always',
  };

  if (customerId) {
    sessionParams.customer = customerId;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session;
}

// Create portal session for subscription management
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Get subscription details
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return null;
  }
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId);
  } else {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }
}

// Reactivate subscription
export async function reactivateSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}

// Get customer invoices
export async function getCustomerInvoices(
  customerId: string,
  limit: number = 10
): Promise<Stripe.Invoice[]> {
  const { data: invoices } = await stripe.invoices.list({
    customer: customerId,
    limit,
    status: 'paid',
  });

  return invoices;
}

// Get usage records for metered billing (if needed later)
export async function createUsageRecord(
  subscriptionItemId: string,
  quantity: number,
  timestamp?: number
): Promise<Stripe.UsageRecord> {
  return await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
    quantity,
    timestamp: timestamp || Math.floor(Date.now() / 1000),
    action: 'increment',
  });
}

// Helper to get plan details from price ID
export function getPlanFromPriceId(priceId: string): StripePlanKey | null {
  for (const [planKey, planData] of Object.entries(STRIPE_PLANS)) {
    if (planData.priceId === priceId) {
      return planKey as StripePlanKey;
    }
  }
  return null;
}

// Helper to format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100); // Stripe amounts are in cents
}

// Webhook signature verification
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, secret);
}