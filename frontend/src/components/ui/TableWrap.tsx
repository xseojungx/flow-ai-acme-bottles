type TableWrapProps = {
  children: React.ReactNode;
};

export function TableWrap({ children }: TableWrapProps) {
  return (
    <div className="bg-surface rounded-md border border-base shadow-card overflow-x-auto">
      {children}
    </div>
  );
}
