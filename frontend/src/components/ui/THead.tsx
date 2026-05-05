type THeadProps = {
  cols: string[];
  numCols?: number[];    // indices of right-aligned (numeric) columns
  firstColClass?: string; // Tailwind width class for the first column, e.g. 'w-10'
};

export const THead = ({ cols, numCols = [], firstColClass }: THeadProps) => (
  <thead>
    <tr className="border-b border-base">
      {cols.map((col, i) => (
        <th
          key={col}
          className={[
            'px-4 py-3 text-label whitespace-nowrap',
            numCols.includes(i) ? 'text-right' : 'text-left',
            i === 0 && firstColClass ? firstColClass : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>
);
