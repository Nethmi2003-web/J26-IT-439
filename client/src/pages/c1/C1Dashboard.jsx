import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { AlertTriangle, ArrowRight, Download, Package, TrendingUp, Wallet } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Button from '../../components/ui/Button.jsx';
import AlertItem from '../../components/ui/AlertItem.jsx';
import ChartTooltip from '../../components/ui/ChartTooltip.jsx';
import ForecastChart, { ForecastLegend, buildForecastSeries } from '../../components/charts/ForecastChart.jsx';
import {
  alerts, forecast, history, post2022Series, pre2022Series, productSummary, products, totalForecast, totalHistory,
} from '../../data/c1MockData.js';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import { downloadCsv } from '../../utils/download.js';
import { formatCompact, formatMt, formatPercent, formatUsd } from '../../utils/format.js';

function MiniTrend({ productId, color }) {
  const data = [
    ...history[productId].slice(-12).map((r) => ({ label: r.label, actual: r.volume })),
    ...forecast[productId].slice(0, 3).map((r) => ({ label: r.label, forecast: r.volume })),
  ];
  data[11].forecast = data[11].actual;
  return (
    <ResponsiveContainer width="100%" height={64}>
      <LineChart data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
        <XAxis dataKey="label" hide />
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Tooltip content={<ChartTooltip format={formatMt} names={{ actual: 'Historical', forecast: 'Forecast' }} />} />
        <Line isAnimationActive={false} dataKey="actual" stroke={color} strokeWidth={2} dot={false} />
        <Line isAnimationActive={false} dataKey="forecast" stroke={color} strokeWidth={2} strokeDasharray="4 3" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function PeriodChart({ title, subtitle, data }) {
  const isMobile = useIsMobile();
  const mape = data.reduce((a, r) => a + Math.abs(r.predicted - r.actual) / r.actual, 0) / data.length;
  return (
    <Card header={title} subtitle={`${subtitle} · MAPE ${formatPercent(mape)}`}>
      <ResponsiveContainer width="100%" height={isMobile ? 220 : 260}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            interval={isMobile ? 8 : 5}
          />
          <YAxis
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={formatCompact}
          />
          <Tooltip
            content={<ChartTooltip format={formatMt} names={{ actual: 'Actual', predicted: 'Hybrid model' }} />}
          />
          <Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
          <Line isAnimationActive={false} dataKey="actual" name="Actual" stroke="#111827" strokeWidth={2} dot={false} />
          <Line isAnimationActive={false} dataKey="predicted" name="Hybrid model" stroke="#2563EB" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default function C1Dashboard() {
  const [productId, setProductId] = useState('all');
  const [horizon, setHorizon] = useState(6);
  const [metric, setMetric] = useState('volume');

  const product = products.find((p) => p.id === productId);
  const color = product?.color ?? '#2563EB';
  const summary = productSummary(productId);
  const activeAlerts = alerts.filter((a) => productId === 'all' || a.productId === productId);

  const chartData = useMemo(() => {
    const h = productId === 'all' ? totalHistory : history[productId];
    const f = productId === 'all' ? totalForecast : forecast[productId];
    return buildForecastSeries(h, f.slice(0, horizon), metric);
  }, [productId, horizon, metric]);

  const exportCsv = () => {
    const f = productId === 'all' ? totalForecast : forecast[productId];
    downloadCsv(
      `c1-forecast-${productId}-${horizon}m.csv`,
      f.slice(0, horizon).map((r) => ({
        month: r.month,
        volume_mt: r.volume,
        volume_lower: r.volumeLower,
        volume_upper: r.volumeUpper,
        value_usd: r.value,
        value_lower: r.valueLower,
        value_upper: r.valueUpper,
      })),
    );
  };

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Export Forecast Dashboard</h1>
        <p className="caption mt-1">Historical exports (24 months) and forecasts with 95% prediction intervals.</p>
      </div>

      {/* Filter bar */}
      <Card bodyClassName="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex w-full flex-col gap-1 sm:w-auto">
          <span className="text-xs font-medium text-neutral-700">Product</span>
          <select className="select sm:min-w-[220px]" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="all">All products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral-700">Horizon</span>
          <div className="flex rounded-sm border border-neutral-200 p-1" role="group" aria-label="Forecast horizon">
            {[3, 6].map((h) => (
              <button
                key={h}
                type="button"
                aria-pressed={horizon === h}
                onClick={() => setHorizon(h)}
                className={`min-h-[36px] flex-1 rounded-[6px] px-4 text-sm font-medium sm:flex-none ${
                  horizon === h ? 'bg-primary-500 text-white' : 'text-neutral-700 md:hover:bg-neutral-100'
                }`}
              >
                {h}M
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral-700">Measure</span>
          <div className="flex rounded-sm border border-neutral-200 p-1" role="group" aria-label="Measure">
            {[
              ['volume', 'Volume'],
              ['value', 'Value'],
            ].map(([k, label]) => (
              <button
                key={k}
                type="button"
                aria-pressed={metric === k}
                onClick={() => setMetric(k)}
                className={`min-h-[36px] flex-1 rounded-[6px] px-4 text-sm font-medium sm:flex-none ${
                  metric === k ? 'bg-primary-500 text-white' : 'text-neutral-700 md:hover:bg-neutral-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:ml-auto">
          <Button variant="secondary" icon={Download} onClick={exportCsv}>
            Export
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        <StatCard icon={Package} label="Total Volume (12M)" value={formatMt(summary.volume12)} trend={summary.yoyVolume >= 0 ? 'up' : 'down'} trendLabel={`${formatPercent(summary.yoyVolume, 1, true)} vs prior 12M`} iconClass="bg-blue-50 text-c1" />
        <StatCard icon={Wallet} label="Total Value (12M)" value={formatUsd(summary.value12)} trend={summary.yoyValue >= 0 ? 'up' : 'down'} trendLabel={`${formatPercent(summary.yoyValue, 1, true)} vs prior 12M`} iconClass="bg-green-50 text-c2" />
        <StatCard icon={TrendingUp} label="YoY Change (Volume)" value={formatPercent(summary.yoyVolume, 1, true)} trend={summary.yoyVolume >= 0 ? 'up' : 'down'} trendLabel={`Next 3M: ${formatPercent(summary.next3Change, 1, true)}`} iconClass="bg-amber-50 text-c3" />
        <StatCard icon={AlertTriangle} label="Active Alerts" value={activeAlerts.length} trend={activeAlerts.some((a) => a.severity === 'critical') ? 'up' : 'flat'} trendGood={false} trendLabel={`${activeAlerts.filter((a) => a.severity === 'critical').length} critical`} iconClass="bg-red-50 text-c4" />
      </div>

      {/* Main forecast chart */}
      <Card
        header={`${product?.name ?? 'All Products'} – ${metric === 'volume' ? 'Export Volume' : 'Export Value'}`}
        subtitle={`${horizon}-month forecast · ${metric === 'volume' ? 'metric tonnes' : 'USD'}`}
        actions={<ForecastLegend color={color} />}
      >
        <ForecastChart data={chartData} metric={metric} color={color} />
      </Card>

      {/* Per-product cards */}
      <div>
        <h2 className="section-title">Products</h2>
        <p className="caption mt-1">Last 12 months and 3-month forecast (dashed).</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-5">
        {products.map((p) => {
          const s = productSummary(p.id);
          return (
            <Link
              key={p.id}
              to={`/c1/product/${p.id}`}
              className="group min-w-0 rounded-md bg-white p-3 shadow-card ring-primary-400 transition md:hover:ring-2 sm:p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
                  <span className="truncate text-sm font-semibold text-neutral-900">{p.name}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400 md:group-hover:text-primary-500" aria-hidden />
              </div>
              <p className="mt-2 text-lg font-bold">{formatMt(s.volume12)}</p>
              <p className={`text-xs font-medium ${s.yoyVolume >= 0 ? 'text-risk-low' : 'text-risk-critical'}`}>
                {formatPercent(s.yoyVolume, 1, true)} YoY
              </p>
              <MiniTrend productId={p.id} color={p.color} />
            </Link>
          );
        })}
      </div>

      {/* Pre vs post 2022 */}
      <div>
        <h2 className="section-title">Pre-2022 vs Post-2022</h2>
        <p className="caption mt-1">
          Total export volume against the hybrid model&apos;s back-tested forecast. The 2022 economic crisis made exports
          more volatile and harder to predict.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6">
        <PeriodChart title="Pre-2022 (2019–2021)" subtitle="Stable regime" data={pre2022Series} />
        <PeriodChart title="Post-2022 (2022–2024)" subtitle="Volatile regime" data={post2022Series} />
      </div>

      {/* Alerts */}
      <Card
        header="Recent Alerts"
        actions={
          <Button to="/c1/alerts" variant="ghost" size="sm" iconRight={ArrowRight}>
            Alerts Center
          </Button>
        }
      >
        {activeAlerts.length ? (
          <ul className="divide-y divide-neutral-200">
            {activeAlerts.slice(0, 4).map((a) => (
              <AlertItem key={a.id} alert={a} />
            ))}
          </ul>
        ) : (
          <p className="caption py-4 text-center">No alerts for this product.</p>
        )}
      </Card>
    </div>
  );
}
