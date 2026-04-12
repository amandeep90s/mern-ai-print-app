import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { openAPI } from 'better-auth/plugins';
import { jwt } from 'better-auth/plugins';
import mongoose from 'mongoose';

import { Env } from '@/config/env.config';
import { compareValue, hashValue } from '@/utils/bcrypt';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authInstance: any = null;

export const initAuth = () => {
  if (!mongoose.connection.db) {
    throw new Error(
      'Database connection not established. Call connectDatabase() first.',
    );
  }

  authInstance = betterAuth({
    baseURL: Env.BETTER_AUTH_URL,
    secret: Env.BETTER_AUTH_SECRET,
    trustedOrigins: [Env.FRONTEND_ORIGIN],
    database: mongodbAdapter(mongoose.connection.db, {
      client: mongoose.connection.getClient(),
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      password: {
        hash: hashValue,
        verify: compareValue,
      },
    },
    socialProviders: {
      google: {
        clientId: Env.GOOGLE_CLIENT_ID,
        clientSecret: Env.GOOGLE_CLIENT_SECRET,
      },
    },
    advanced: {
      database: {
        generateId: false,
      },
      cookiePrefix: 'ai-print',
      cookies: {
        session_token: {
          name: 'ai_print_session_token',
        },
      },
    },
    plugins: [openAPI(), jwt()],
  });

  return authInstance;
};

export const getAuth = (): ReturnType<typeof betterAuth> => {
  if (!authInstance) {
    throw new Error('Auth not initialized. Call initAuth() first.');
  }
  return authInstance!;
};
