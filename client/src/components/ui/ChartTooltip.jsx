// Recharts tooltip body. Pass `format` to format values and `names` to rename series keys.
export default function ChartTooltip({ active, payload, label, format = (v) => v, names = {} }) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((p) => p.value !== null && p.value !== undefined && !Array.isArray(p.value));
  const bands = payload.filter((p) => Array.isArray(p.value));

  return (
    <div className="min-w-[170px] rounded-sm border border-neutral-200 bg-white px-3 py-2 text-xs shadow-lg sm:text-sm">
      <p className="mb-1 font-semibold text-neutral-900">{label}</p>
      {rows.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-neutral-700">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: p.color || p.stroke }} />
          {names[p.dataKey] || p.name}
          <span className="ml-auto pl-3 font-semibold tabular-nums text-neutral-900">{format(p.value)}</span>
        </div>
      ))}
      {bands.map((p) => (
        <div key={p.dataKey} className="mt-1 flex items-center gap-2 text-neutral-400">
          95% interval
          <span className="ml-auto pl-3 tabular-nums">
            {format(p.value[0])} – {format(p.value[1])}
          </span>
        </div>
      ))}
    </div>
  );
}
