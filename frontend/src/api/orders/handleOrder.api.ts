import { instance } from '@/api/axiosInstance';
import { API_DOMAINS } from '@/constants/api';
import { mapApiOrder } from '@/types/order';
import type { ApiOrder, CreateOrderApiDto, Order } from '@/types/order';

interface ListEnvelope<T> {
  message: string;
  data: { items: T[]; total: number };
}

interface ItemEnvelope<T> {
  message: string;
  data: T;
}

export const getOrders = async (): Promise<Order[]> => {
  const response = await instance.get<ListEnvelope<ApiOrder>>(
    API_DOMAINS.PURCHASE_ORDERS,
  );
  return response.data.data.items.map(mapApiOrder);
};

export const postOrder = async (data: CreateOrderApiDto): Promise<void> => {
  await instance.post<ItemEnvelope<ApiOrder>>(API_DOMAINS.PURCHASE_ORDERS, data);
};
