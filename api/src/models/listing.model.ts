import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ListingDocument extends Document {
  userId: string;
  templateId: Schema.Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  sellingPrice: number;
  colorIds: Schema.Types.ObjectId[];
  artworkUrl: string;
  artworkPlacement: {
    top: number;
    left: number;
    width: number;
    height: number;
    refDisplayWidth: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<ListingDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    colorIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProductColor',
      },
    ],
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    artworkUrl: {
      type: String,
      required: true,
    },
    artworkPlacement: {
      top: Number,
      left: Number,
      width: Number,
      height: Number,
      refDisplayWidth: Number,
    },
  },
  { timestamps: true },
);

listingSchema.pre('save', async function () {
  if (this.isNew) {
    this.slug = `${slugify(this.title, {
      lower: true,
      strict: true,
    })}-${Date.now()}`;
  }
});

const Listing = mongoose.model<ListingDocument>('Listing', listingSchema);

export default Listing;
