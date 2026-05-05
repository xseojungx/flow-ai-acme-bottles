import type { OrderStatus } from '../../types/order';

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-warning text-warning',
  'In Production': 'bg-primary-soft text-primary',
  Completed: 'bg-success text-success',
  Cancelled: 'bg-danger text-danger',
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold ${STATUS_STYLES[status]}`}
  >
    {status}
  </span>
);
