import mongoose, { Document, Schema, Types } from 'mongoose';

// Can also be called template colors
export interface ProductColorDocument extends Document {
  templateId: Types.ObjectId;
  name: string;
  color: string;
  mockupUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const productColorSchema = new Schema<ProductColorDocument>(
  {
    templateId: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    mockupUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const ProductColor = mongoose.model<ProductColorDocument>(
  'ProductColor',
  productColorSchema,
);

export default ProductColor;
