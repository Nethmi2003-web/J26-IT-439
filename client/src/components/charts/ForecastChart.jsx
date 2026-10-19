import {
  Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import ChartTooltip from '../ui/ChartTooltip.jsx';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import { formatCompact, formatMt, formatUsd } from '../../utils/format.js';

// Joins history and forecast rows into one series. The last actual point is repeated
// as the first forecast point so the two lines connect.
export function buildForecastSeries(historyRows, forecastRows, metric) {
  const lower = `${metric}Lower`;
  const upper = `${metric}Upper`;
  const rows = historyRows.map((r) => ({ label: r.label, actual: r[metric] }));
  const last = rows.at(-1);
  last.forecast = last.actual;
  last.band = [last.actual, last.actual];
  forecastRows.forEach((r) => rows.push({ label: r.label, forecast: r[metric], band: [r[lower], r[upper]] }));
  return rows;
}

export function ForecastLegend({ color }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-700 sm:text-sm">
      <span className="flex items-center gap-2">
        <span className="h-0.5 w-5 rounded" style={{ background: color }} /> Historical
      </span>
      <span className="flex items-center gap-2">
        <span className="w-5 border-t-2 border-dashed" style={{ borderColor: color }} /> Forecast
      </span>
      <span className="flex items-center gap-2">
        <span className="h-3 w-5 rounded-[3px]" style={{ background: color, opacity: 0.18 }} /> 95% interval
      </span>
    </div>
  );
}

export default function ForecastChart({ data, metric = 'volume', color = '#2563EB', height }) {
  const isMobile = useIsMobile();
  const format = metric === 'value' ? formatUsd : formatMt;
  const forecastStart = data.find((d) => d.forecast !== undefined)?.label;

  return (
    <ResponsiveContainer width="100%" height={height ?? (isMobile ? 240 : 340)}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#E5E7EB" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
          interval={isMobile ? 5 : 2}
          minTickGap={8}
        />
        <YAxis
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={metric === 'value' ? 60 : isMobile ? 44 : 56}
          tickFormatter={(v) => (metric === 'value' ? `$${formatCompact(v)}` : formatCompact(v))}
        />
        <Tooltip
          content={<ChartTooltip format={format} names={{ actual: 'Historical', forecast: 'Forecast' }} />}
          cursor={{ stroke: '#9CA3AF', strokeWidth: 1 }}
        />
        {forecastStart && (
          <ReferenceLine
            x={forecastStart}
            stroke="#9CA3AF"
            label={{ value: 'Forecast →', position: 'insideTopRight', fill: '#9CA3AF', fontSize: 11 }}
          />
        )}
        <Area dataKey="band" stroke="none" fill={color} fillOpacity={0.15} isAnimationActive={false} activeDot={false} />
        <Line isAnimationActive={false} dataKey="actual" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line
          isAnimationActive={false}
          dataKey="forecast"
          stroke={color}
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
