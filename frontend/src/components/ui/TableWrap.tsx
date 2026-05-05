type TableWrapProps = {
  children: React.ReactNode;
};

export const TableWrap = ({ children }: TableWrapProps) => (
  <div className="bg-surface rounded-md border border-base shadow-card overflow-x-auto">
    {children}
  </div>
);
