import { TableWrap } from '../ui/TableWrap';
import { THead } from '../ui/THead';
import { OrderStatusBadge } from '../ui/OrderStatusBadge';
import { fmtNum } from '../../utils/format';
import type { Order } from '../../types/order';

type OrderTableProps = {
  orders: Order[];
  query: string;
};

const COLS = ['PO Number', 'Customer', 'Product', 'Quantity', 'Order Date', 'Status'];

export const OrderTable = ({ orders, query }: OrderTableProps) => (
  <TableWrap>
    <table className="w-full text-[13px] border-collapse">
      <THead cols={COLS} numCols={[3]} />
      <tbody>
        {orders.map((o) => (
          <tr key={o.id} className="border-b border-soft last:border-0 hover:bg-slate-50/60">
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
              <OrderStatusBadge status={o.status} />
            </td>
          </tr>
        ))}
        {orders.length === 0 && (
          <tr>
            <td colSpan={6} className="px-4 py-8 text-center text-muted">
              {query ? `No purchase orders match "${query}"` : 'No purchase orders yet'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </TableWrap>
);
