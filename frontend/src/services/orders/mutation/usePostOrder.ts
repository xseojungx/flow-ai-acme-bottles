import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postOrder } from '@/api/orders/handleOrder.api';
import { QUERY_KEYS } from '@/constants/api';
import type { CreateOrderApiDto } from '@/types/order';

export const usePostOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderApiDto) => postOrder(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PURCHASE_ORDERS] }),
  });
};
