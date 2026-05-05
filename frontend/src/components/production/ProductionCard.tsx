import { Icon } from '../ui/Icon';
import { fmtNum } from '../../utils/format';
import { fmtDate, overdueDays } from '../../utils/date';
import type { Order } from '../../types/order';

type ProductionCardProps = {
  order: Order;
};

export const ProductionCard = ({ order }: ProductionCardProps) => {
  const od = overdueDays(order.eta);

  return (
    <div className="bg-surface border border-base rounded-md p-4 px-[18px] flex gap-3.5 shadow-card hover:border-slate-300 transition-colors">
      <div className="w-10 h-10 bg-primary-soft text-primary rounded-md grid place-items-center shrink-0">
        <Icon.Factory width="20" height="20" />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="font-mono text-[12.5px] text-primary cursor-pointer hover:underline">
          {order.po}
        </div>
        <div className="text-[15px] font-semibold text-ink">{order.customer}</div>
        <div className="text-[13px] text-muted">
          {order.product} · {fmtNum(order.qty)} units
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-[13px]">
          <span className="text-muted">ETA:</span>
          <span className="text-danger font-semibold">{fmtDate(order.eta, { short: true })}</span>
          {od > 0 && (
            <span className="bg-danger text-danger text-[11.5px] font-semibold px-2 py-0.5 rounded-full">
              {od}d overdue
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
