import { Icon } from './Icon';

type TopBarProps = {
  crumbs: string[];
};

export const TopBar = ({ crumbs }: TopBarProps) => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex-between px-8 py-3.5 border-b border-base bg-surface shrink-0">
      <div className="flex items-center gap-2 text-[13px] text-muted">
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-2">
            {i > 0 && <Icon.Chevron width="14" height="14" className="text-dim" />}
            <span className={i === crumbs.length - 1 ? 'text-ink font-medium' : ''}>{crumb}</span>
          </span>
        ))}
      </div>
      <div className="text-[12.5px] text-ink-2 bg-[var(--color-bg)] border border-base rounded-full px-3.5 py-1.5">
        {dateStr}
      </div>
    </div>
  );
};
