import { generateImage, generateText } from 'ai';

import cloudinary from '@/config/cloudinary.config';
import { Env } from '@/config/env.config';
import Listing from '@/models/listing.model';
import Product from '@/models/products.model';
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from '@/utils/app-error';
import { SYSTEM_PROMPT } from '@/utils/prompt';
import { CreateListingType } from '@/validators/listing.validator';

const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

/**
 * Create a new listing
 * @param userId - ID of the user creating the listing
 * @param data
 * @returns Created listing
 * @description This function creates a new listing in the database based on the provided data, which includes template ID, title, description, selling price, color options, artwork URL, and artwork placement.
 * It first validates the product template and selling price against the base price of the template.
 * Then it uploads the artwork to Cloudinary and creates the listing with a generated slug based on the title.
 * If any step fails, it throws an appropriate error.
 */
export const createListingService = async (
  userId: string,
  data: CreateListingType,
) => {
  try {
    const template = await Product.findById(data.templateId);

    if (!template) {
      throw new NotFoundException('Product template not found');
    }

    if (!template.template) {
      throw new BadRequestException('Selected product is not a template');
    }

    if (!template.basePrice) {
      throw new BadRequestException(
        'Base price is not set for this product template',
      );
    }

    if (data.sellingPrice < template.basePrice) {
      throw new BadRequestException(
        `Selling price must be at least ${template.basePrice}`,
      );
    }

    // Upload the artwork to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(data.artworkUrl, {
      folder: 'ai-print/artworks',
      resource_type: 'image',
    });

    const listing = await Listing.create({
      userId,
      templateId: data.templateId,
      title: data.title,
      description: data.description,
      sellingPrice: data.sellingPrice,
      colorIds: data.colorIds,
      artworkUrl: uploadResult.secure_url,
      slug: toSlug(data.title),
      artworkPlacement: data.artworkPlacement,
    });

    return { listing };
  } catch {
    throw new InternalServerException('Failed to create listing');
  }
};

/**
 * Get listings for a specific user
 * @param userId - ID of the user whose listings are to be retrieved
 * @returns Listings created by the user
 * @description This function retrieves all listings created by a specific user from the database.
 * It populates the template and color information for each listing and sorts them by creation date in descending order.
 * If the retrieval fails, it throws an error.
 */
export const getUserListingService = async (userId: string) => {
  try {
    const listings = await Listing.find({ userId })
      .populate('templateId')
      .populate('colorIds')
      .sort({ createdAt: -1 })
      .lean();

    return { listings };
  } catch {
    throw new InternalServerException('Failed to get user listings');
  }
};

export const getListingBySlugService = async (slug: string) => {};

export const getMockupUrlService = async (
  slug: string,
  colorName: string,
) => {};

export const generateArtworkService = async (prompt: string) => {};
