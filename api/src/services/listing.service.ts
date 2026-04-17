import { gateway } from '@ai-sdk/gateway';
import { generateImage, generateText } from 'ai';

import cloudinary from '@/config/cloudinary.config';
import { Env } from '@/config/env.config';
import Listing from '@/models/listing.model';
import type { ProductColorDocument } from '@/models/product-color.model';
import Product, { ProductDocument } from '@/models/products.model';
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
export const getUserListingsService = async (userId: string) => {
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

/**
 * Get listing by slug
 * @param slug - Slug of the listing to be retrieved
 * @returns Listing details * @description This function retrieves a listing from the database based on its slug, populates the template and color information, and returns the listing details along with the mockup image URLs for each color option.
 * If the listing is not found or if any error occurs during retrieval, it throws an appropriate error.
 */
export const getListingBySlugService = async (slug: string) => {
  try {
    const listing = await Listing.findOne({ slug })
      .populate('templateId')
      .populate('colorIds')
      .lean();

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const colors = (listing.colorIds as unknown as ProductColorDocument[]).map(
      (color) => ({
        ...color,
        mockupImageUrl: color?.name
          ? `${Env.BASE_URL}/api/listing/mockup/${slug}/${toSlug(color.name)}.jpg`
          : null,
      }),
    );

    const template = listing.templateId as unknown as ProductDocument;

    return {
      listing: {
        ...listing,
        _id: listing._id,
        slug: listing.slug,
        title: listing.title,
        description: listing.description,
        sellingPrice: listing.sellingPrice,
        templateId: undefined,
        templateName: template?.name,
        templateBody: template?.body,
        sizes: template?.sizes,
        colorIds: colors,
      },
    };
  } catch {
    throw new InternalServerException('Failed to get listing by slug');
  }
};

/**
 * Get mockup URL for a specific listing and color
 * @param slug - Slug of the listing
 * @param colorName - Name of the color option
 * @returns Mockup image URL
 * @description This function generates a mockup image URL for a specific listing and color by retrieving the listing and color information from the database, extracting the public IDs from the artwork and mockup URLs, and using Cloudinary's transformation features to overlay the artwork onto the mockup.
 * If any step fails, it throws an appropriate error.
 */
export const getMockupUrlService = async (slug: string, colorName: string) => {
  const listing = await Listing.findOne({ slug })
    .populate('colorIds')
    .populate('templateId')
    .lean();

  if (!listing) {
    throw new NotFoundException('Listing not found');
  }

  const color = (listing.colorIds as unknown as ProductColorDocument[]).find(
    (color) => toSlug(color.name) === colorName.replace('.jpg', ''),
  );

  if (!color) {
    throw new NotFoundException('Color not found for this listing');
  }

  const template = listing.templateId as unknown as ProductDocument;

  if (!template || !template.printableArea) {
    throw new NotFoundException('Template or printable area not found');
  }

  const printableArea = template.printableArea;
  const getPublicId = (url: string) => {
    const parts = url.split('/upload/');
    if (!parts[1]) {
      throw new InternalServerException('Invalid URL format');
    }
    return parts[1]
      .replace(/^v\d+\//, '') // remove version prefix e.g. v1773951553/
      .replace(/\.[^.]+$/, '') // remove extension
      .replace(/\//g, ':'); // slashes → colons
  };

  const artworkPublicId = getPublicId(listing.artworkUrl);
  const mockupPublicId = getPublicId(color.mockupUrl);

  const { refDisplayWidth } = listing.artworkPlacement;

  const mockup_width = 900;

  const scale = mockup_width / (refDisplayWidth ?? 662);

  const url = cloudinary.url(mockupPublicId, {
    transformation: [
      { overlay: artworkPublicId },
      {
        width: Math.round(printableArea.width * scale),
        height: Math.round(printableArea.height * scale),
        crop: 'fit',
      },
      {
        flags: 'layer_apply',
        gravity: 'north_west',
        x: Math.round(printableArea.left * scale),
        y: Math.round(printableArea.top * scale),
      },
    ],
    format: 'jpg',
    quality: 90,
  });

  return url;
};

/**
 * Generate artwork based on a given prompt
 * @param prompt The prompt to generate artwork from
 * @returns Artwork URL
 * @description This function generates artwork based on a given prompt using AI services, uploads the generated image to Cloudinary, removes the background using the remove.bg API, and returns the final artwork URL.
 * If any step fails, it throws an appropriate error.
 */
export const generateArtworkService = async (prompt: string) => {
  try {
    const { text } = await generateText({
      model: gateway('anthropic/claude-opus-4.5'),
      system: SYSTEM_PROMPT,
      prompt: prompt,
    });

    const result = await generateImage({
      model: gateway.image('recraft/recraft-v4'),
      prompt: text.trim(),
      size: '1024x1024',
    });

    const image = result.images[0];
    if (!image) throw new NotFoundException('No image generated');

    const uploadImg = await cloudinary.uploader.upload(
      `data:image/png;base64,${image.base64}`,
      {
        folder: 'ai-print/artworks',
        resource_type: 'image',
      },
    );

    const formData = new FormData();
    formData.append('image_url', uploadImg.secure_url);
    formData.append('size', 'auto');

    const bgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': Env.REMOVE_BG_API_KEY! },
      body: formData,
    });

    if (!bgRes.ok) {
      throw new InternalServerException('Background removal failed');
    }

    const bgBuffer = Buffer.from(await bgRes.arrayBuffer());

    const finalUpload = await cloudinary.uploader.upload(
      `data:image/png;base64,${bgBuffer.toString('base64')}`,
      {
        folder: 'ai-print/artworks',
        resource_type: 'image',
      },
    );

    return { artworkUrl: finalUpload.secure_url };
  } catch {
    throw new InternalServerException('Failed to generate artwork');
  }
};
