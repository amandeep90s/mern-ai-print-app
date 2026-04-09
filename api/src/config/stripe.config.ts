import Stripe from 'stripe';

import { Env } from './env.config';

/**
 * Initializes the Stripe client using the secret key from environment variables
 * Configures the API version to ensure compatibility with Stripe's API
 * This client is used throughout the application to interact with Stripe's services
 */
const stripeClient = new Stripe(Env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-03-25.dahlia',
});

export default stripeClient;
