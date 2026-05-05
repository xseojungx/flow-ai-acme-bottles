import { ProductionCard } from './ProductionCard';
import type { Order } from '../../types/order';

type ProductionNowSectionProps = {
  orders: Order[];
  slotsTotal: number;
};

export const ProductionNowSection = ({ orders, slotsTotal }: ProductionNowSectionProps) => (
  <section className="mt-6">
    <div className="text-label mb-3 inline-flex items-center gap-2">
      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
      IN PRODUCTION NOW
      <span className="text-muted font-normal tracking-normal text-[12.5px]">
        ({orders.length}/{slotsTotal} slots)
      </span>
    </div>

    <div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
      {orders.map((o) => (
        <ProductionCard key={o.id} order={o} />
      ))}
      {Array.from({ length: Math.max(0, slotsTotal - orders.length) }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="border border-dashed border-base rounded-md p-4 grid place-items-center text-dim text-[13px]"
        >
          Open production slot
        </div>
      ))}
    </div>
  </section>
);
