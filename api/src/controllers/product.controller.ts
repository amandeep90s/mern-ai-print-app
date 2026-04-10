import { Request, Response } from 'express';

import { asyncHandler } from '@/middlewares/asyncHandler.middleware';

export const getProductsController = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const getProductByIdController = asyncHandler(
  async (req: Request, res: Response) => {},
);
