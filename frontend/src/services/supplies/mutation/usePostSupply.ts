import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postSupply } from '@/api/supplies/handleSupply.api';
import { QUERY_KEYS } from '@/constants/api';
import type { CreateSupplyApiDto } from '@/types/supply';

export const usePostSupply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplyApiDto) => postSupply(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUPPLY_ORDERS] }),
  });
};
