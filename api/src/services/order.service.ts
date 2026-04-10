import { Types } from 'mongoose';

import { Env } from '@/config/env.config';
import stripeClient from '@/config/stripe.config';
import Listing from '@/models/listing.model';
import Order, { OrderStatus } from '@/models/order.model';
import { SIZE_OPTIONS } from '@/models/products.model';
import { InternalServerException, NotFoundException } from '@/utils/app-error';
import { CreateOrderType } from '@/validators/order.validator';

/**
 * Create a new order and initiate Stripe checkout session
 * @param data
 * @returns Stripe checkout URL
 * @description This function creates a new order in the database based on the provided data, which includes listing ID, color ID, size, customer information, and shipping address.
 * It first validates the size and color against the listing's available options.
 * If valid, it creates the order with a pending status and then initiates a Stripe checkout session for payment.
 * If the checkout session is successfully created, it returns the URL for the session; otherwise, it deletes the created order and throws an error.
 */
export const createOrderService = async (data: CreateOrderType) => {
  if (!SIZE_OPTIONS.includes(data.size)) {
    throw new NotFoundException('Size is invalid');
  }

  const listing = await Listing.findById(data.listingId).populate('colorIds');

  if (!listing) {
    throw new NotFoundException('Listing not found');
  }

  const isColorValid = listing.colorIds.some(
    (color) => color._id.toString() === data.colorId,
  );

  if (!isColorValid) {
    throw new NotFoundException('Color is invalid for this listing');
  }

  const order = await Order.create({
    listingId: data.listingId,
    colorId: data.colorId,
    size: data.size,
    customerEmail: data.customerEmail,
    customerName: data.customerName,
    amount: listing.sellingPrice,
    isPaid: false,
    status: OrderStatus.PENDING,
    shippingAddress: data.shippingAddress,
  });

  const session = await stripeClient.checkout.sessions.create({
    mode: 'payment',
    customer_email: data.customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: listing.title },
          unit_amount: Math.round(listing.sellingPrice * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: (order._id as Types.ObjectId).toString(),
    },
    success_url: `${Env.FRONTEND_ORIGIN}/thank-you?orderId=${order._id}`,
    cancel_url: `${Env.FRONTEND_ORIGIN}/listing/${listing.slug}?error=true`,
  });

  if (!session.url) {
    await Order.findByIdAndDelete(order._id);
    throw new InternalServerException(
      'Failed to create Stripe checkout session',
    );
  }

  return { url: session.url };
};

/**
 * Get all orders for a user
 * @param userId
 * @returns Orders for the user
 * @description This function retrieves all orders for a given user by first finding all listings created by the user and then fetching the orders associated with those listings.
 * The orders are populated with the listing's title, slug, artwork URL, and the color's name and color code.
 * The results are sorted by creation date in descending order.
 */
export const getUserOrdersSrevice = async (userId: string) => {
  const listings = await Listing.find({ userId }).select('_id');
  const listingIds = listings.map((listing) => listing._id);

  const orders = await Order.find({ listingId: { $in: listingIds } })
    .populate('listingId', 'title slug artworkUrl')
    .populate('colorId', 'name color')
    .sort({ createdAt: -1 });

  return orders;
};
