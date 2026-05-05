import type { OrderStatus } from '../../types/order';

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const BADGE_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-warning text-warning',
  'In Production': 'bg-primary-soft text-primary',
  Completed: 'bg-success text-success',
  Cancelled: 'bg-danger text-danger',
};

const DOT_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-[var(--color-warning)]',
  'In Production': 'bg-primary',
  Completed: 'bg-[var(--color-success)]',
  Cancelled: 'bg-[var(--color-danger)]',
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-xs font-semibold whitespace-nowrap ${BADGE_STYLES[status]}`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[status]}`} />
    {status}
  </span>
);
