import { createAuthClient } from 'better-auth/react';

import { ENV } from '@/lib/env';

export const authClient = createAuthClient({
  baseURL: ENV.BASE_API_URL,
});
