export interface PrintArea {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type ProductVariants = 'TSHIRT' | 'HOODIE';

export type ProductSection = 'catalog' | 'featured';

export interface ProductType {
  _id: string;
  type: ProductVariants;
  template: boolean;
  section: ProductSection;
  name: string;
  body: string;
  displayUrl: string;
  basePrice: number;
  sizes: string[];
  baseUrl: string;
  printableArea: PrintArea;
  created: string;
  updated: string;
}

export interface ProductsResponse {
  message: string;
  products: {
    catalog: ProductType[];
    featured: ProductType[];
  };
}

export type GetAllProductsResponse = ProductsResponse;

export interface ProductColorType {
  _id: string;
  templateId: string;
  name: string;
  color: string;
  mockupUrl: string;
}

export interface ProductTemplateResponse {
  message: string;
  template: ProductType;
  colors: ProductColorType[];
}

export const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', '2XL'] as const;
