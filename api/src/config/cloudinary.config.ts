import { v2 as cloudinary } from 'cloudinary';

import { Env } from './env.config';

/**
 * Configures the Cloudinary client with credentials from environment variables
 * This allows the application to interact with Cloudinary's API for media management
 */
cloudinary.config({
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
