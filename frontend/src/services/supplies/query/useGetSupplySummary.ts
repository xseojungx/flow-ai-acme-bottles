import { useQuery } from '@tanstack/react-query';
import { getSupplySummary } from '@/api/supplies/handleSupply.api';
import { QUERY_KEYS } from '@/constants/api';

export const useGetSupplySummary = () =>
  useQuery({
    queryKey: [QUERY_KEYS.SUPPLY_SUMMARY],
    queryFn: getSupplySummary,
  });
