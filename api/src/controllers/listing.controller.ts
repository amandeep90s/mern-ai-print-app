import { Request, Response } from 'express';

import { asyncHandler } from '@/middlewares/asyncHandler.middleware';

export const createListingController = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const getUserListingsController = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const getListingBySlugController = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const getMockupUrlController = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const generateArtworkController = asyncHandler(
  async (req: Request, res: Response) => {},
);
