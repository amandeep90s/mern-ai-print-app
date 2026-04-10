import { Request, Response } from 'express';

import { asyncHandler } from '@/middlewares/asyncHandler.middleware';

export const createOrderController = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const getUserOrdersController = asyncHandler(
  async (req: Request, res: Response) => {},
);
