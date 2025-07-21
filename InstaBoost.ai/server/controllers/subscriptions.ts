import { Request, Response } from 'express';
import Stripe from 'stripe';
import User from '../../database/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripe_price_id: string;
  popular?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: [
      '5 AI captions per month',
      'Basic analytics',
      'Manual posting',
      'Community support'
    ],
    stripe_price_id: '',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited AI captions',
      'Advanced analytics',
      'Content calendar',
      'Auto-scheduling',
      'Collab finder',
      'Priority support'
    ],
    stripe_price_id: 'price_1234567890', // Replace with actual Stripe price ID
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Everything in Pro',
      'AI-powered reel editor',
      'Advanced automation',
      'White-label options',
      'Custom integrations',
      'Dedicated support'
    ],
    stripe_price_id: 'price_0987654321', // Replace with actual Stripe price ID
  },
  {
    id: 'pro_yearly',
    name: 'Pro (Yearly)',
    price: 199.99,
    currency: 'usd',
    interval: 'year',
    features: [
      'Everything in Pro monthly',
      '2 months free',
      'Annual strategy session',
      'Exclusive webinars'
    ],
    stripe_price_id: 'price_yearly_pro', // Replace with actual Stripe price ID
  }
];

export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      plans: SUBSCRIPTION_PLANS,
      currency_symbol: '$',
      billing_info: {
        trial_period: '7 days free trial for Pro plans',
        cancellation_policy: 'Cancel anytime, no hidden fees',
        refund_policy: '30-day money-back guarantee'
      }
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch subscription plans',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { userId, planId, successUrl, cancelUrl } = req.body;

    // Validate user
    const user = await User.findOne({ instagramId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the plan
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan || plan.id === 'free') {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        planId: planId,
      },
      subscription_data: {
        trial_period_days: planId.includes('pro') ? 7 : 0,
        metadata: {
          userId: userId,
          planId: planId,
        },
      },
      success_url: successUrl || `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/subscription/canceled`,
      allow_promotion_codes: true,
    });

    res.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
      plan_details: plan
    });

  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook signature verification failed');
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ instagramId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let stripeSubscription = null;
    if (user.subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(user.subscription.stripeSubscriptionId);
      } catch (error) {
        console.error('Failed to fetch Stripe subscription:', error);
      }
    }

    const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === user.subscription.plan) || SUBSCRIPTION_PLANS[0];
    
    res.json({
      success: true,
      subscription: {
        plan: currentPlan,
        status: user.subscription.status,
        current_period_start: user.subscription.currentPeriodStart,
        current_period_end: user.subscription.currentPeriodEnd,
        trial_end: user.subscription.trialEnd,
        cancel_at_period_end: stripeSubscription?.cancel_at_period_end || false,
        usage: {
          ai_credits_used: user.subscription.aiCreditsUsed || 0,
          ai_credits_limit: getAICreditsLimit(user.subscription.plan),
          posts_scheduled: user.subscription.postsScheduled || 0,
          collaborations_found: user.subscription.collaborationsFound || 0
        }
      },
      billing_portal_url: user.subscription.stripeCustomerId 
        ? await createBillingPortalUrl(user.subscription.stripeCustomerId)
        : null
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch subscription status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ instagramId: userId });
    if (!user || !user.subscription.stripeSubscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel the subscription at period end
    const updatedSubscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update user in database
    user.subscription.status = 'canceling';
    await user.save();

    res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the current billing period',
      cancellation_date: new Date(updatedSubscription.current_period_end * 1000),
      access_until: new Date(updatedSubscription.current_period_end * 1000)
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const reactivateSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ instagramId: userId });
    if (!user || !user.subscription.stripeSubscriptionId) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    // Reactivate the subscription
    const updatedSubscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      }
    );

    // Update user in database
    user.subscription.status = 'active';
    await user.save();

    res.json({
      success: true,
      message: 'Subscription reactivated successfully',
      subscription: updatedSubscription
    });

  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({ 
      error: 'Failed to reactivate subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Helper functions
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const user = await User.findOne({ instagramId: userId });
  if (!user) {
    console.error('User not found for checkout session');
    return;
  }

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) {
    console.error('Plan not found for checkout session');
    return;
  }

  // Update user subscription
  user.subscription = {
    plan: planId,
    status: 'active',
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: session.subscription as string,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + (plan.interval === 'year' ? 365 : 30) * 24 * 60 * 60 * 1000),
    aiCreditsUsed: 0,
    postsScheduled: 0,
    collaborationsFound: 0
  };

  await user.save();
  console.log(`Subscription activated for user ${userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Handle successful payment - renew subscription period
  const subscriptionId = invoice.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const user = await User.findOne({ instagramId: userId });
  if (!user) return;

  user.subscription.status = 'active';
  user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
  user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  
  await user.save();
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Handle failed payment
  const subscriptionId = invoice.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const user = await User.findOne({ instagramId: userId });
  if (!user) return;

  user.subscription.status = 'past_due';
  await user.save();
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const user = await User.findOne({ instagramId: userId });
  if (!user) return;

  user.subscription.status = subscription.status as any;
  user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
  user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  
  await user.save();
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const user = await User.findOne({ instagramId: userId });
  if (!user) return;

  user.subscription.status = 'canceled';
  user.subscription.plan = 'free';
  
  await user.save();
}

async function createBillingPortalUrl(customerId: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL}/subscription`,
  });
  
  return session.url;
}

function getAICreditsLimit(plan: string): number {
  switch (plan) {
    case 'free': return 5;
    case 'pro': return 1000;
    case 'pro_yearly': return 1000;
    case 'premium': return -1; // Unlimited
    default: return 5;
  }
}
