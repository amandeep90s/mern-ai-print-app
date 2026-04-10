import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import {
  createOrderService,
  getUserOrdersSrevice,
} from '@/services/order.service';
import { createOrderSchema } from '@/validators/order.validator';

export const createOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createOrderSchema.parse(req.body);

    const { url } = await createOrderService(body);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'Order created successfully', url });
  },
);

export const getUserOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    const orders = await getUserOrdersSrevice(userId);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Orders retrieved successfully', orders });
  },
);
