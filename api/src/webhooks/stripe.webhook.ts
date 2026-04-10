import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';

import { Env } from '@/config/env.config';
import logger from '@/config/logger.config';
import stripeClient from '@/config/stripe.config';
import Order, { OrderStatus } from '@/models/order.model';

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      Env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error: unknown) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(`Webhook Error ${(error as Error)?.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleOrderCheckoutCompleted(session);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleOrderCheckoutFailed(session);
        break;
      }
      default:
        logger.warn(`Unhandled event type: ${event.type}`);
        break;
    }
    return res.status(StatusCodes.OK).json({ received: true });
  } catch (error: unknown) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(`Webhook Error ${(error as Error)?.message}`);
  }
};

async function handleOrderCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    logger.warn('No OrderId in session metadata');
    return;
  }

  try {
    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      status: OrderStatus.AWAITING_SHIPMENT,
    });
    logger.info(`Order ${orderId} marked as paid`);
  } catch (error) {
    logger.error(`Error updating order ${orderId}`, error);
    return;
  }
}

async function handleOrderCheckoutFailed(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    logger.warn('No OrderId in session metadata');
    return;
  }

  try {
    await Order.findByIdAndUpdate(orderId, {
      isPaid: false,
      status: OrderStatus.FAILED,
    });
    logger.info(`Order ${orderId} marked as failed`);
  } catch (error) {
    logger.error(`Error updating order ${orderId}`, error);
    return;
  }
}
