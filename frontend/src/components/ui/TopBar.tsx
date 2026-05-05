type TopBarProps = {
  crumbs: string[];
};

export const TopBar = ({ crumbs }: TopBarProps) => (
  <div className="h-12 border-b border-base bg-surface flex items-center px-8 gap-2 shrink-0">
    {crumbs.map((crumb, i) => (
      <span key={crumb} className="flex items-center gap-2">
        {i > 0 && <span className="text-dim text-sm">/</span>}
        <span
          className={
            i === crumbs.length - 1 ? 'text-ink font-medium text-sm' : 'text-muted text-sm'
          }
        >
          {crumb}
        </span>
      </span>
    ))}
  </div>
);
