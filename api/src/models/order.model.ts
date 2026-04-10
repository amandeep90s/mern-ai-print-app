import mongoose, { Document, Schema, Types } from 'mongoose';

import { SIZE_OPTIONS } from './products.model';

export enum OrderStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  AWAITING_SHIPMENT = 'awaiting_shipment',
  SHIPPED = 'shipped',
  FULFILLED = 'fulfilled',
}

export interface OrderDocument extends Document {
  listingId: Types.ObjectId;
  colorId: Types.ObjectId;
  size: (typeof SIZE_OPTIONS)[number];
  customerName: string;
  customerEmail: string;
  amount: number;
  isPaid: boolean;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    listingId: {
      type: Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    colorId: {
      type: Types.ObjectId,
      ref: 'ProductColor',
      required: true,
    },
    size: {
      type: String,
      enum: SIZE_OPTIONS,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    shippingAddress: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
      state: String,
      phoneNumber: String,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model<OrderDocument>('Order', orderSchema);

export default Order;
