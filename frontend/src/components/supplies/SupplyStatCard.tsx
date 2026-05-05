import { Icon } from '../ui/Icon';
import { fmtNum } from '../../utils/format';
import { MATERIAL_ICON_CLASS, type SupplyMaterial } from '../../types/supply';

type SupplyStatCardProps = {
  material: SupplyMaterial;
  availableKg: number;
  receivedKg: number;
  inTransit: number;
};

export const SupplyStatCard = ({ material, availableKg, receivedKg, inTransit }: SupplyStatCardProps) => (
  <div className="bg-surface border border-base rounded-md p-[18px] px-5 flex gap-3.5 items-start shadow-card">
    <div
      className={`w-[38px] h-[38px] rounded-md grid place-items-center shrink-0 ${MATERIAL_ICON_CLASS[material]}`}
    >
      <Icon.Box width="18" height="18" />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="text-[12.5px] text-muted font-medium">{material}</div>
      <div className="text-[24px] font-bold text-ink tracking-[-0.02em] tabular-nums">
        {fmtNum(availableKg)}{' '}
        <span className="text-[13px] font-medium text-muted">kg available</span>
      </div>
      <div className="text-[11px] text-muted mt-0.5">
        {fmtNum(receivedKg)} kg received total
      </div>
      <div className="mt-1 text-xs text-muted inline-flex items-center gap-1.5">
        {inTransit > 0 ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {inTransit} order{inTransit > 1 ? 's' : ''} in transit
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dim)]" />
            No orders in transit
          </>
        )}
      </div>
    </div>
  </div>
);
