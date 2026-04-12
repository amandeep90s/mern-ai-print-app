export type CreateListingType = {
  templateId: string;
  title: string;
  description: string;
  sellingPrice: number;
  colorIds: string[];
  artworkUrl: string;
  artworkPlacement: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

export type ColorIdsType = {
  _id: string;
  name: string;
  color: string;
  mockupImageUrl: string;
};

export type ListingSingleType = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  sellingPrice: number;
  sizes: string[];
  templateName: string;
  templateBody: string;
  artworkUrl: string;
  artworkPlacement: {
    top: number;
    left: number;
    width: number;
    height: number;
    refDisplayWidth: number;
  };
  colorIds: ColorIdsType[];
  createdAt: string;
  updatedAt: string;
};

export type GetUserListingsResponse = {
  message: string;
  listings: ListingSingleType[];
};

export type GetListingBySlugResponse = {
  message: string;
  listing: ListingSingleType;
};
