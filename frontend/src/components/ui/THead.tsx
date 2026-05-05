type THeadProps = {
  cols: string[];
  numCols?: number[]; // indices of right-aligned (numeric) columns
};

export const THead = ({ cols, numCols = [] }: THeadProps) => (
  <thead>
    <tr className="border-b border-base">
      {cols.map((col, i) => (
        <th
          key={col}
          className={`px-4 py-3 text-label whitespace-nowrap ${numCols.includes(i) ? 'text-right' : 'text-left'}`}
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>
);
