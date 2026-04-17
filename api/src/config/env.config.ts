import { getEnv } from '@/utils/get-env';

/**
 * Centralized configuration object that loads all necessary environment variables
 * Uses the getEnv utility to ensure required variables are present and have default values when needed
 * This object is imported throughout the application to access configuration settings in a consistent way
 */
export const Env = {
  NODE_ENV: getEnv('NODE_ENV'),
  PORT: getEnv('PORT'),
  BASE_URL: getEnv('BASE_URL'),
  MONGO_URI: getEnv('MONGO_URI'),
  BETTER_AUTH_SECRET: getEnv('BETTER_AUTH_SECRET'),
  BETTER_AUTH_URL: getEnv('BETTER_AUTH_URL'),

  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),

  CLOUDINARY_CLOUD_NAME: getEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET'),

  REMOVE_BG_API_KEY: getEnv('REMOVE_BG_API_KEY'),
  AI_GATEWAY_API_KEY: getEnv('AI_GATEWAY_API_KEY'),

  STRIPE_SECRET_KEY: getEnv('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: getEnv('STRIPE_WEBHOOK_SECRET'),

  FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', 'http://localhost:5173'),
};
