import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import {
  getProductByIdService,
  getProductsService,
} from '@/services/product.service';
import { productIdSchema } from '@/validators/product.validator';

export const getProductsController = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await getProductsService();
    return res.status(StatusCodes.OK).json({
      message: 'Products fetched successfully',
      products,
    });
  },
);

export const getProductByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = productIdSchema.parse(req.params);
    const data = await getProductByIdService(id);
    return res.status(StatusCodes.OK).json({
      message: 'Product fetched successfully',
      ...data,
    });
  },
);
