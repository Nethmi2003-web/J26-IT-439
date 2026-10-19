// Table on tablet/desktop, stacked label:value cards on mobile.
// columns: [{ key, label, align?: 'right', render?: (row) => node }]
export default function ResponsiveTable({ columns, rows, rowKey = 'id', highlight }) {
  const cell = (c, row) => (c.render ? c.render(row) : row[c.key]);

  return (
    <>
      {/* Mobile: cards */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li
            key={row[rowKey]}
            className={`rounded-sm border p-3 ${highlight?.(row) ? 'border-primary-400 bg-primary-100/40' : 'border-neutral-200'}`}
          >
            <dl className="space-y-1.5">
              {columns.map((c) => (
                <div key={c.key} className="flex items-start justify-between gap-4 text-sm">
                  <dt className="text-neutral-400">{c.label}</dt>
                  <dd className="text-right font-medium text-neutral-900">{cell(c, row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* Tablet & desktop: table */}
      <div className="hidden max-h-[480px] overflow-auto md:block">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-white">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`whitespace-nowrap border-b border-neutral-200 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-400 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[rowKey]} className={highlight?.(row) ? 'bg-primary-100/40' : 'md:hover:bg-neutral-100'}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`whitespace-nowrap border-b border-neutral-100 px-3 py-3 ${c.align === 'right' ? 'text-right tabular-nums' : ''}`}
                  >
                    {cell(c, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
