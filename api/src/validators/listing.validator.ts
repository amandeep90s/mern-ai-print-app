import { z } from 'zod';

export const createListingSchema = z.object({
  templateId: z.string().trim().min(1, 'Template ID is required'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  description: z.string().trim().default(''),
  sellingPrice: z.number().positive('Selling price must be a positive number'),
  colorIds: z
    .array(z.string().trim().min(1, 'Color ID cannot be empty'))
    .min(1, 'At least one color ID is required'),
  artworkUrl: z.string().trim().min(1, 'Artwork URL is required'),
  artworkPlacement: z.object({
    top: z.number(),
    left: z.number(),
    width: z.number(),
    height: z.number(),
    refDisplayWidth: z.number(),
  }),
});

export const slugSchema = z.object({
  slug: z.string().trim().min(1, 'Slug is required'),
});

export const GetMockupUrlSchema = z.object({
  slug: z.string().trim().min(1, 'Slug is required'),
  colorName: z.string().trim().min(1, 'Color name is required'),
});

export const generateArtworkSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required'),
});

export type CreateListingType = z.infer<typeof createListingSchema>;
