import axios from 'axios';

import { ENV } from '@/lib/env';
import type {
  CreateListingType,
  GetListingBySlugResponse,
} from '@/types/listing';
import type { CreateOrderType, GetUserOrdersResponse } from '@/types/order';
import type {
  GetAllProductsResponse,
  ProductTemplateResponse,
} from '@/types/product';

const API = axios.create({
  baseURL: ENV.API_URL,
  timeout: 120000, // 2 minutes
  withCredentials: true, // Include cookies in requests
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  },
);

export const getProducts = async (): Promise<GetAllProductsResponse> => {
  const response = await API.get<GetAllProductsResponse>('/product/all');

  return response.data;
};

export const getListingQueryFn = async () => {
  const response = await API.get('/listing/all');

  return response.data;
};

export const getProductTemplateById = async (
  productId: string,
): Promise<ProductTemplateResponse> => {
  const response = await API.get(`/product/${productId}`);

  return response.data;
};

export const createListingMutationFn = async (data: CreateListingType) => {
  const response = await API.post('/listing/create', data);

  return response.data;
};

export const generateArtworkMutationFn = async (
  prompt: string,
): Promise<{ artworkUrl: string }> => {
  const response = await API.post('/listing/generate-artwork', { prompt });

  return response.data;
};

export const getListingBySlugQueryFn = async (
  slug: string,
): Promise<GetListingBySlugResponse> => {
  const response = await API.get(`/listing/${slug}`);

  return response.data;
};

export const createOrderSession = async (
  data: CreateOrderType,
): Promise<{ message: string; url: string }> => {
  const response = await API.post('/order/create', data);

  return response.data;
};

export const getUserOrders = async (): Promise<GetUserOrdersResponse> => {
  const response = await API.get('/order/user');

  return response.data;
};
