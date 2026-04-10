import { Router } from 'express';

import {
  createListingController,
  generateArtworkController,
  getListingBySlugController,
  getMockupUrlController,
  getUserListingsController,
} from '@/controllers/listing.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const listingRoutes = Router()
  .get('/all', requireAuth, getUserListingsController)
  .get('/mockup/:slug/:colorName', getMockupUrlController)
  .get('/:slug', getListingBySlugController)
  .post('/generate-artwork', requireAuth, generateArtworkController)
  .post('/create', requireAuth, createListingController);

export default listingRoutes;
