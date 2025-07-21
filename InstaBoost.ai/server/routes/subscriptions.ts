import express from 'express';
import { 
  getSubscriptionPlans,
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription,
  reactivateSubscription
} from '../controllers/subscriptions';

const router = express.Router();

// Get available subscription plans
router.get('/plans', getSubscriptionPlans);

// Create Stripe checkout session
router.post('/checkout', createCheckoutSession);

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Get user subscription status
router.get('/status/:userId', getSubscriptionStatus);

// Cancel subscription
router.post('/cancel', cancelSubscription);

// Reactivate subscription
router.post('/reactivate', reactivateSubscription);

export default router;
