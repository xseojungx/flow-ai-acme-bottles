import { instance } from '@/api/axiosInstance';
import { API_DOMAINS } from '@/constants/api';
import { mapApiSupply } from '@/types/supply';
import type { ApiSupply, CreateSupplyApiDto, Supply } from '@/types/supply';

interface ListEnvelope<T> {
  message: string;
  data: { items: T[]; total: number };
}

interface ItemEnvelope<T> {
  message: string;
  data: T;
}

export const getSupplies = async (): Promise<Supply[]> => {
  const response = await instance.get<ListEnvelope<ApiSupply>>(
    API_DOMAINS.SUPPLY_ORDERS,
  );
  return response.data.data.items.map(mapApiSupply);
};

export const postSupply = async (data: CreateSupplyApiDto): Promise<void> => {
  await instance.post<ItemEnvelope<ApiSupply>>(API_DOMAINS.SUPPLY_ORDERS, data);
};
