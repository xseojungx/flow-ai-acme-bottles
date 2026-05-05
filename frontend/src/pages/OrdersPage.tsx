import { useState } from 'react';
import { TopBar } from '../components/ui/TopBar';
import { Icon } from '../components/ui/Icon';
import { OrderSearchBar } from '../components/orders/OrderSearchBar';
import { OrderTable } from '../components/orders/OrderTable';
import { CreateOrderModal } from '../components/orders/CreateOrderModal';
import { useGetOrders } from '@/services/orders/query/useGetOrders';

export const OrdersPage = () => {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { data: orders, isLoading, isError } = useGetOrders();

  const list = orders ?? [];
  const filtered = list.filter((o) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [o.po, o.customer, o.product].join(' ').toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <TopBar crumbs={['ACME Bottles', 'Purchase Orders']} />
      <div className="px-8 pt-7 pb-10 max-w-[1280px] w-full mx-auto">
        <header className="mb-[22px] flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold tracking-[-0.02em] text-ink m-0 mb-1">
              Purchase Orders
            </h1>
            <p className="text-[13.5px] text-muted m-0">{list.length} total orders</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-[13.5px] font-semibold bg-primary text-white hover:bg-[var(--color-primary-600)] shadow-[0_1px_2px_rgba(37,99,235,0.25)] transition-colors"
          >
            <Icon.Plus width="16" height="16" /> Create New PO
          </button>
        </header>

        <OrderSearchBar value={query} onChange={setQuery} />

        {isLoading && (
          <div className="py-16 text-center text-muted text-[13px]" aria-busy="true">
            Loading orders…
          </div>
        )}
        {isError && (
          <div className="py-16 text-center text-danger text-[13px]">
            Failed to load orders. Please refresh.
          </div>
        )}
        {!isLoading && !isError && (
          <OrderTable orders={filtered} query={query} />
        )}
      </div>

      <CreateOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
