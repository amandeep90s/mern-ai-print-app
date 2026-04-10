import 'dotenv/config';

import { toNodeHandler } from 'better-auth/node';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

import { connectDB } from '@/config/database.config';
import { Env } from '@/config/env.config';
import { getAuth } from '@/lib/auth';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import { errorHandler } from '@/middlewares/errorHandler.middleware';
import routes from '@/routes';
import webhookRoutes from '@/routes/webhook.route';

const app = express();

app.use(
  cors({
    origin: [Env.FRONTEND_ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.all('/api/auth/*splat', (req, res) => {
  const auth = getAuth();
  return toNodeHandler(auth)(req, res);
});

app.use('/api/webhook', webhookRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get(
  '/health',
  asyncHandler(async (req: Request, res: Response) => {
    res
      .status(StatusCodes.OK)
      .json({ status: 'ok', message: 'Server is healthy' });
  }),
);

app.use('/api', routes);

if (Env.NODE_ENV === 'production') {
  const clientPath = path.resolve(__dirname, '../../web/dist');

  // Serve static files from the React app
  app.use(express.static(clientPath));

  // Serve index.html for all non-API routes (SPA fallback)
  app.get(/^(?!\/api).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(Env.PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
