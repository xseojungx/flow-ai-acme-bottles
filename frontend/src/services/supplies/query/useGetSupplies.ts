import { useQuery } from '@tanstack/react-query';
import { getSupplies } from '@/api/supplies/handleSupply.api';
import { QUERY_KEYS } from '@/constants/api';

export const useGetSupplies = () =>
  useQuery({
    queryKey: [QUERY_KEYS.SUPPLY_ORDERS],
    queryFn: getSupplies,
  });
