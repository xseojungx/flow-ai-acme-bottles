import { TableWrap } from '../ui/TableWrap';
import { THead } from '../ui/THead';
import { SupplyStatusBadge } from '../ui/StatusBadge';
import type { Supply } from '../../types/supply';

type SupplyTableProps = {
  supplies: Supply[];
};

const COLS = [
  'Material',
  'Quantity (kg)',
  'Supplier',
  'Tracking Number',
  'Order Date',
  'ETA',
  'Status',
];

export const SupplyTable = ({ supplies }: SupplyTableProps) => (
  <TableWrap>
    <table className="w-full text-[13px] border-collapse">
      <THead cols={COLS} numCols={[1]} />
      <tbody>
        {supplies.map((s) => (
          <tr key={s.id} className="border-b border-soft last:border-0 hover:bg-slate-50/60">
            <td className="px-4 py-3.5 text-ink font-medium">{s.material}</td>
            <td className="px-4 py-3.5 text-right tabular-nums text-ink-2">
              {s.qty.toLocaleString()} kg
            </td>
            <td className="px-4 py-3.5 text-ink-2">{s.supplier}</td>
            <td className="px-4 py-3.5">
              <span className="font-mono text-[12.5px] text-muted">{s.tracking}</span>
            </td>
            <td className="px-4 py-3.5 text-muted">{s.orderDate}</td>
            <td className="px-4 py-3.5 text-muted">
              {s.eta ?? <span className="text-dim">—</span>}
            </td>
            <td className="px-4 py-3.5">
              <SupplyStatusBadge status={s.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </TableWrap>
);
