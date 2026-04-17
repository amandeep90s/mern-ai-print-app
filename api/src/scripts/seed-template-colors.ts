import 'dotenv/config';

import { connectDB } from '@/config/database.config';
import ProductColor from '@/models/product-color.model';
import Product, { ProductType } from '@/models/products.model';

const seedColors = async () => {
  try {
    await connectDB();

    const tshirtTemplate = await Product.findOne({
      type: ProductType.TSHIRT,
      template: true,
    }).lean();
    const hoodieTemplate = await Product.findOne({
      type: ProductType.HOODIE,
      template: true,
    }).lean();

    if (!tshirtTemplate || !hoodieTemplate) {
      console.error('Templates not found. Run seed-products script first.');
      process.exit(1);
    }

    const TSHIRT_TEMPLATE_ID = tshirtTemplate._id;
    const HOODIE_TEMPLATE_ID = hoodieTemplate._id;

    const colors = [
      // T-Shirt Colors
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'White',
        color: 'rgb(255, 255, 255)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687938/tshirt-white-mockup_zw59ck.png',
      },
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'Very Dark Gray',
        color: 'rgb(26, 26, 26)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687937/tshirt-dark-grey-mockup_bdbvfa.png',
      },
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'Medium Blue',
        color: 'rgb(58, 75, 152)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687938/tshirt-medium-blue-mokup_ou9kry.png',
      },
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'Light Pink',
        color: 'rgb(244, 144, 182)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687938/tshirt-pink-mockup_buazv1.png',
      },
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'Dark Green',
        color: 'rgb(19, 69, 34)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687936/tshirt-dark-green-mockup_m8afg9.png',
      },

      // Hoodie Colors
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'White',
        color: 'rgb(255, 255, 255)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687872/hoodie-white-mockup_eya9nz.png',
      },
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'Very Dark Gray',
        color: 'rgb(15, 15, 15)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687871/hoodie-dark-grey-mockup_qoxxfp.png',
      },
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'Medium Blue',
        color: 'rgb(0, 53, 148)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687875/hoodie-medium-blue-mockup_tckmsu.png',
      },
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'Red',
        color: 'rgb(186, 12, 47)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687873/hoodie-red-mockup_xyzke2.png',
      },
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'Dark Purple',
        color: 'rgb(71, 10, 104)',
        mockupUrl:
          'https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687872/hoodie-dark-purple-mockup_uiefd0.png',
      },
    ];

    await ProductColor.deleteMany({});
    const created = await ProductColor.insertMany(colors);
    console.log(`Added the colors ${created.length}`);
  } catch (error) {
    console.log('Error occured seeding colors', error);
    process.exit(1);
  }
};

seedColors();
