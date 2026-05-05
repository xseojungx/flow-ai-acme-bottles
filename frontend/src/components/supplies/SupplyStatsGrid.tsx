import { MATERIALS, type Supply, type ApiSupplySummary, type ApiMaterialType } from '../../types/supply';
import { SupplyStatCard } from './SupplyStatCard';

const MATERIAL_TO_API: Record<string, ApiMaterialType> = {
  'PET Resin': 'PET',
  'PTA': 'PTA',
  'EG': 'EG',
};

type SupplyStatsGridProps = {
  supplies: Supply[];
  summary: ApiSupplySummary | null;
};

export const SupplyStatsGrid = ({ supplies, summary }: SupplyStatsGridProps) => (
  <div className="grid grid-cols-3 gap-3.5 mb-6 max-md:grid-cols-1">
    {MATERIALS.map((material) => {
      const apiKey = MATERIAL_TO_API[material];
      const inTransit = supplies.filter(
        (s) => s.material === material && s.status === 'Ordered',
      ).length;
      const availableKg = summary ? summary.available[apiKey] / 1000 : 0;
      const receivedKg  = summary ? summary.received[apiKey]  / 1000 : 0;
      return (
        <SupplyStatCard
          key={material}
          material={material}
          availableKg={availableKg}
          receivedKg={receivedKg}
          inTransit={inTransit}
        />
      );
    })}
  </div>
);
