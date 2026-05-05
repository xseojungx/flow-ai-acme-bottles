import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api/orders/handleOrder.api';
import { QUERY_KEYS } from '@/constants/api';

export const useGetOrders = () =>
  useQuery({
    queryKey: [QUERY_KEYS.PURCHASE_ORDERS],
    queryFn: getOrders,
  });
