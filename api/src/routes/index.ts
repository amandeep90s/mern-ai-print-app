import { Router } from 'express';

import listingRoutes from '@/routes/listing.route';
import orderRoutes from '@/routes/order.route';
import productRoutes from '@/routes/product.route';

const router = Router();
router.use('/product', productRoutes);
router.use('/listing', listingRoutes);
router.use('/order', orderRoutes);

export default router;
