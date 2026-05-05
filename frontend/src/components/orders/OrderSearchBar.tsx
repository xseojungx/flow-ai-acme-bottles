import { Icon } from '../ui/Icon';

type OrderSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export const OrderSearchBar = ({ value, onChange }: OrderSearchBarProps) => (
  <div className="flex items-center gap-2.5 bg-surface border border-base rounded-md px-3.5 py-[11px] mb-4 shadow-card focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary-100)]">
    <Icon.Search width="16" height="16" className="text-muted shrink-0" />
    <input
      placeholder="Search by PO number, customer, or product..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent outline-none w-full text-[13.5px] placeholder:text-dim"
    />
  </div>
);
