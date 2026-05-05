import { useState } from 'react';
import { TopBar } from '../components/ui/TopBar';
import { Icon } from '../components/ui/Icon';
import { SupplyStatsGrid } from '../components/supplies/SupplyStatsGrid';
import { SupplyTable } from '../components/supplies/SupplyTable';
import { CreateSupplyModal } from '../components/supplies/CreateSupplyModal';
import { useGetSupplies } from '@/services/supplies/query/useGetSupplies';

export const SuppliesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: supplies, isLoading, isError } = useGetSupplies();

  const list = supplies ?? [];

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <TopBar crumbs={['ACME Bottles', 'Supplies']} />
      <div className="px-8 pt-7 pb-10 max-w-[1280px] w-full mx-auto">
        <header className="mb-[22px] flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold tracking-[-0.02em] text-ink m-0 mb-1">
              Supplies
            </h1>
            <p className="text-[13.5px] text-muted m-0">Manage raw material supply orders</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-[13.5px] font-semibold bg-primary text-white hover:bg-[var(--color-primary-600)] shadow-[0_1px_2px_rgba(37,99,235,0.25)] transition-colors"
          >
            <Icon.Plus width="16" height="16" /> Create New Order
          </button>
        </header>

        {isLoading && (
          <div className="py-16 text-center text-muted text-[13px]" aria-busy="true">
            Loading supplies…
          </div>
        )}
        {isError && (
          <div className="py-16 text-center text-danger text-[13px]">
            Failed to load supplies. Please refresh.
          </div>
        )}
        {!isLoading && !isError && (
          <>
            <SupplyStatsGrid supplies={list} />
            <div className="flex-between mb-2.5">
              <div className="text-label">SUPPLY ORDERS</div>
              <div className="text-[12.5px] text-muted">{list.length} orders</div>
            </div>
            <SupplyTable supplies={list} />
          </>
        )}
      </div>

      <CreateSupplyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
