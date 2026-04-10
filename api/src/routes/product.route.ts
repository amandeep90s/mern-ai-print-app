import { Router } from 'express';

import {
  getProductByIdController,
  getProductsController,
} from '@/controllers/product.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const productRoutes = Router()
  .use(requireAuth)
  .get('/all', getProductsController)
  .get('/:id', getProductByIdController);

export default productRoutes;
