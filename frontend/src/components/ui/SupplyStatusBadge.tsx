import type { SupplyStatus } from '../../types/supply';

type SupplyStatusBadgeProps = {
  status: SupplyStatus;
};

const BADGE_STYLES: Record<SupplyStatus, string> = {
  Ordered: 'bg-sky-100 text-sky-700',
  Received: 'bg-success text-success',
};

const DOT_STYLES: Record<SupplyStatus, string> = {
  Ordered: 'bg-sky-600',
  Received: 'bg-[var(--color-success)]',
};

export const SupplyStatusBadge = ({ status }: SupplyStatusBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-xs font-semibold whitespace-nowrap ${BADGE_STYLES[status]}`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[status]}`} />
    {status}
  </span>
);
