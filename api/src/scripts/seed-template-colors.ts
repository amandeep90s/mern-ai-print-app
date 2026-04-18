import 'dotenv/config';

import path from 'path';
import { fileURLToPath } from 'url';

import cloudinary from '@/config/cloudinary.config';
import { connectDB } from '@/config/database.config';
import ProductColor from '@/models/product-color.model';
import Product, { ProductType } from '@/models/products.model';

const ASSETS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../assets',
);

const uploadMockup = async (localFile: string): Promise<string> => {
  const result = await cloudinary.uploader.upload(localFile, {
    folder: 'ai-print/mockups',
    resource_type: 'image',
  });
  return result.secure_url;
};

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

    console.log('Uploading mockup images to Cloudinary...');

    const colorDefs = [
      // T-Shirt Colors
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'White',
        color: 'rgb(255, 255, 255)',
        localFile: path.join(
          ASSETS_DIR,
          'tshirt-mockup/tshirt-white-mockup.png',
        ),
      },
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'Very Dark Gray',
        color: 'rgb(26, 26, 26)',
        localFile: path.join(
          ASSETS_DIR,
          'tshirt-mockup/tshirt-dark-grey-mockup.png',
        ),
      },
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'Medium Blue',
        color: 'rgb(58, 75, 152)',
        localFile: path.join(
          ASSETS_DIR,
          'tshirt-mockup/tshirt-medium-blue-mokup.png',
        ),
      },
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'Light Pink',
        color: 'rgb(244, 144, 182)',
        localFile: path.join(
          ASSETS_DIR,
          'tshirt-mockup/tshirt-pink-mockup.png',
        ),
      },
      {
        templateId: TSHIRT_TEMPLATE_ID,
        name: 'Dark Green',
        color: 'rgb(19, 69, 34)',
        localFile: path.join(
          ASSETS_DIR,
          'tshirt-mockup/tshirt-dark-green-mockup.png',
        ),
      },

      // Hoodie Colors
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'White',
        color: 'rgb(255, 255, 255)',
        localFile: path.join(
          ASSETS_DIR,
          'hoodie-mockup/hoodie-white-mockup.png',
        ),
      },
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'Very Dark Gray',
        color: 'rgb(15, 15, 15)',
        localFile: path.join(
          ASSETS_DIR,
          'hoodie-mockup/hoodie-dark-grey-mockup.png',
        ),
      },
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'Medium Blue',
        color: 'rgb(0, 53, 148)',
        localFile: path.join(
          ASSETS_DIR,
          'hoodie-mockup/hoodie-medium-blue-mockup.png',
        ),
      },
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'Red',
        color: 'rgb(186, 12, 47)',
        localFile: path.join(ASSETS_DIR, 'hoodie-mockup/hoodie-red-mockup.png'),
      },
      {
        templateId: HOODIE_TEMPLATE_ID,
        name: 'Dark Purple',
        color: 'rgb(71, 10, 104)',
        localFile: path.join(
          ASSETS_DIR,
          'hoodie-mockup/hoodie-dark-purple-mockup.png',
        ),
      },
    ];

    const colors = await Promise.all(
      colorDefs.map(async ({ localFile, ...rest }) => {
        const mockupUrl = await uploadMockup(localFile);
        console.log(`  Uploaded: ${path.basename(localFile)} -> ${mockupUrl}`);
        return { ...rest, mockupUrl };
      }),
    );

    await ProductColor.deleteMany({});
    const created = await ProductColor.insertMany(colors);
    console.log(`Added the colors ${created.length}`);
  } catch (error) {
    console.log('Error occured seeding colors', error);
    process.exit(1);
  }
};

seedColors();
