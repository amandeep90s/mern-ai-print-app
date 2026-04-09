import mongoose from 'mongoose';

import { Env } from './env.config';

/**
 * Connects to the MongoDB database using Mongoose
 * Logs success or failure of the connection attempt
 * Exits the process on failure to prevent further errors
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(Env.MONGO_URI);
    console.log('Database connected');
  } catch (error) {
    console.error('Database disconnected', error);
    process.exit(1);
  }
};
