import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';

import { Env } from '@/config/env.config';
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
        console.log(`Unhandled event type: ${event.type}`);
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
    console.log('No OrderId in session metadata');
    return;
  }

  try {
    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      status: OrderStatus.AWAITING_SHIPMENT,
    });
    console.log(`Order marked as paid`);
  } catch {
    console.log('Error updating order');
    return;
  }
}

async function handleOrderCheckoutFailed(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.log('No OrderId in session metadata');
    return;
  }

  try {
    await Order.findByIdAndUpdate(orderId, {
      isPaid: false,
      status: OrderStatus.FAILED,
    });
    console.log(`Order marked as failed`);
  } catch {
    console.log('Error updating order');
    return;
  }
}
