import { TableWrap } from '../ui/TableWrap';
import { THead } from '../ui/THead';
import { OrderStatusBadge } from '../ui/OrderStatusBadge';
import { fmtNum } from '../../utils/format';
import { fmtDate, overdueDays } from '../../utils/date';
import type { Order } from '../../types/order';

type ProductionTableProps = {
  orders: Order[];
};

const COLS = [
  '#',
  'PO Number',
  'Customer',
  'Product',
  'Qty',
  'Order Date',
  'Expected Start',
  'ETA',
  'Status',
];

export const ProductionTable = ({ orders }: ProductionTableProps) => (
  <section className="mt-6">
    <div className="text-label mb-3">ALL PURCHASE ORDERS</div>
    <TableWrap>
      <table className="w-full text-[13px] border-collapse">
        <THead cols={COLS} numCols={[4]} firstColClass="w-10" />
        <tbody>
          {orders.map((o, i) => {
            const od = overdueDays(o.eta);
            const isOverdue = od > 0 && o.status === 'In Production';
            const isSupplyDelayed = (o.daysLate ?? 0) > 0;
            const etaHighlight = isOverdue || isSupplyDelayed;
            return (
              <tr key={o.id} className="border-b border-soft last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3.5 text-muted">{i + 1}</td>
                <td className="px-4 py-3.5">
                  <span className="font-mono text-[12.5px] text-primary cursor-pointer hover:underline">
                    {o.po}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-ink font-medium">{o.customer}</td>
                <td className="px-4 py-3.5 text-ink-2">{o.product}</td>
                <td className="px-4 py-3.5 text-right tabular-nums text-ink-2">{fmtNum(o.qty)}</td>
                <td className="px-4 py-3.5 text-muted">{o.orderDate}</td>
                <td className="px-4 py-3.5">
                  {o.expectedStart === 'Started' ? (
                    <span className="text-success font-semibold">Started</span>
                  ) : o.expectedStart ? (
                    <span className="text-muted">{o.expectedStart}</span>
                  ) : (
                    <span className="text-dim">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  {o.eta ? (
                    <span className={etaHighlight ? 'text-danger font-semibold' : 'text-muted'}>
                      {fmtDate(o.eta, { short: true })}
                      {isOverdue && (
                        <span className="font-medium text-xs"> ({od}d late)</span>
                      )}
                      {!isOverdue && isSupplyDelayed && (
                        <span className="font-medium text-xs"> ({o.daysLate}d late)</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-dim">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <OrderStatusBadge status={o.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrap>
  </section>
);
