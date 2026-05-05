import { MATERIALS, type Supply } from '../../types/supply';
import { SupplyStatCard } from './SupplyStatCard';

type SupplyStatsGridProps = {
  supplies: Supply[];
};

export function SupplyStatsGrid({ supplies }: SupplyStatsGridProps) {
  const stats = MATERIALS.map((material) => {
    const rows = supplies.filter((s) => s.material === material);
    const received = rows
      .filter((s) => s.status === 'Received')
      .reduce((sum, s) => sum + s.qty, 0);
    const inTransit = rows.filter((s) => s.status === 'Ordered').length;
    return { material, received, inTransit };
  });

  return (
    <div className="grid grid-cols-3 gap-3.5 mb-6 max-md:grid-cols-1">
      {stats.map((s) => (
        <SupplyStatCard
          key={s.material}
          material={s.material}
          received={s.received}
          inTransit={s.inTransit}
        />
      ))}
    </div>
  );
}
