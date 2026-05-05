import type { SupplyStatus } from '../../types/supply';

type SupplyStatusBadgeProps = {
  status: SupplyStatus;
};

const STATUS_STYLES: Record<SupplyStatus, string> = {
  Received: 'bg-success text-success',
  Ordered: 'bg-warning text-warning',
};

export const SupplyStatusBadge = ({ status }: SupplyStatusBadgeProps) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold ${STATUS_STYLES[status]}`}
  >
    {status}
  </span>
);
