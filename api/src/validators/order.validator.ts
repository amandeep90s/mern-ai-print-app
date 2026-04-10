import z from 'zod';

import { SIZE_OPTIONS } from '@/models/products.model';

export const createOrderSchema = z.object({
  listingId: z.string().min(1, 'Listing Id is required'),
  colorId: z.string().min(1, 'Color Id is required'),
  size: z.enum(SIZE_OPTIONS, 'Size is required'),
  customerEmail: z
    .email('Invalid email address')
    .min(1, 'Customer Email is required'),
  customerName: z
    .string()
    .min(1, 'Customer Name is required')
    .max(100, 'Customer Name must be less than 100 characters'),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal Code is required'),
    country: z.string().min(1, 'Country is required'),
    phoneNumber: z.string().min(1, 'Phone Number is required'),
  }),
});

export type CreateOrderType = z.infer<typeof createOrderSchema>;
