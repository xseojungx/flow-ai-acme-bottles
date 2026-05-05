import { TopBar } from '../components/ui/TopBar';
import { ProductionNowSection } from '../components/production/ProductionNowSection';
import { ProductionTable } from '../components/production/ProductionTable';
import type { Order } from '../types/order';

const SLOTS_TOTAL = 2;

type ProductionPageProps = {
  orders: Order[];
};

export const ProductionPage = ({ orders }: ProductionPageProps) => {
  const inProd = orders.filter((o) => o.status === 'In Production');

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <TopBar crumbs={['ACME Bottles', 'Production Status']} />
      <div className="px-8 pt-7 pb-10 max-w-[1280px] w-full mx-auto">
        <header className="mb-[22px]">
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-ink m-0 mb-1">
            Production Status
          </h1>
          <p className="text-[13.5px] text-muted m-0">
            Overview of all production orders and scheduling
          </p>
        </header>

        <ProductionNowSection orders={inProd} slotsTotal={SLOTS_TOTAL} />
        <ProductionTable orders={orders} />
      </div>
    </div>
  );
};
