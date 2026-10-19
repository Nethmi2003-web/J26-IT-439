import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, ChevronRight, Download, FileText, Trophy } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import ResponsiveTable from '../../components/ui/ResponsiveTable.jsx';
import ForecastChart, { ForecastLegend, buildForecastSeries } from '../../components/charts/ForecastChart.jsx';
import {
  contributingFactors, forecast, getProduct, history, productModelMetrics, productSummary,
} from '../../data/c1MockData.js';
import { downloadCsv, mockExport } from '../../utils/download.js';
import { formatMt, formatNumber, formatPercent, formatUsd } from '../../utils/format.js';

export default function C1ProductDetail() {
  const { productId } = useParams();
  const product = getProduct(productId);
  if (!product) return <Navigate to="/c1" replace />;

  const h = history[product.id];
  const f = forecast[product.id];
  const s = productSummary(product.id);
  const metrics = productModelMetrics(product.id);
  const bestMape = Math.min(...metrics.map((m) => m.mape));
  const factors = contributingFactors(product.id);

  const csvRows = [
    ...h.map((r) => ({ month: r.month, type: 'historical', volume_mt: r.volume, value_usd: r.value })),
    ...f.map((r) => ({
      month: r.month,
      type: 'forecast',
      volume_mt: r.volume,
      volume_lower: r.volumeLower,
      volume_upper: r.volumeUpper,
      value_usd: r.value,
      value_lower: r.valueLower,
      value_upper: r.valueUpper,
    })),
  ];

  const forecastColumns = [
    { key: 'label', label: 'Month' },
    { key: 'volume', label: 'Volume (MT)', align: 'right', render: (r) => formatNumber(r.volume) },
    {
      key: 'volumeRange',
      label: 'Volume 95% PI',
      align: 'right',
      render: (r) => `${formatNumber(r.volumeLower)} – ${formatNumber(r.volumeUpper)}`,
    },
    { key: 'value', label: 'Value (USD)', align: 'right', render: (r) => formatUsd(r.value) },
    {
      key: 'valueRange',
      label: 'Value 95% PI',
      align: 'right',
      render: (r) => `${formatUsd(r.valueLower)} – ${formatUsd(r.valueUpper)}`,
    },
  ];

  const modelColumns = [
    {
      key: 'name',
      label: 'Model',
      render: (m) => (
        <span className="inline-flex items-center gap-2 font-semibold">
          {m.name}
          {m.mape === bestMape && <Badge variant="success" icon={Trophy}>Best</Badge>}
        </span>
      ),
    },
    { key: 'mae', label: 'MAE (MT)', align: 'right', render: (m) => formatNumber(m.mae) },
    { key: 'rmse', label: 'RMSE (MT)', align: 'right', render: (m) => formatNumber(m.rmse) },
    { key: 'mape', label: 'MAPE', align: 'right', render: (m) => `${m.mape}%` },
    { key: 'coverage', label: 'Coverage (95%)', align: 'right', render: (m) => `${m.coverage}%` },
  ];

  return (
    <div className="page">
      {/* Breadcrumbs (md+) */}
      <nav className="hidden items-center gap-1 text-sm text-neutral-400 md:flex" aria-label="Breadcrumb">
        <Link to="/c1" className="md:hover:text-primary-500">C1</Link>
        <ChevronRight className="h-4 w-4" aria-hidden />
        <Link to="/c1/dashboard" className="md:hover:text-primary-500">Dashboard</Link>
        <ChevronRight className="h-4 w-4" aria-hidden />
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: product.color }} />
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{product.short}</span>
          </div>
          <h1 className="page-title mt-1">{product.name}</h1>
          <p className="caption mt-1">{product.description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" icon={Download} onClick={() => downloadCsv(`c1-${product.id}.csv`, csvRows)}>
            Download CSV
          </Button>
          <Button icon={FileText} onClick={() => mockExport('PDF', `${product.name} forecast`)}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Key numbers */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {[
          ['Volume (12M)', formatMt(s.volume12)],
          ['Value (12M)', formatUsd(s.value12)],
          ['YoY volume', formatPercent(s.yoyVolume, 1, true), s.yoyVolume >= 0],
          ['Next 3 months', formatPercent(s.next3Change, 1, true), s.next3Change >= 0],
        ].map(([label, value, up]) => (
          <div key={label} className="rounded-md bg-white p-3 shadow-card sm:p-4">
            <p className="caption">{label}</p>
            <p
              className={`mt-1 flex items-center gap-1 text-lg font-bold sm:text-2xl ${
                up === undefined ? '' : up ? 'text-risk-low' : 'text-risk-critical'
              }`}
            >
              {up !== undefined && (up ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />)}
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Large forecast chart */}
      <Card header="Export Volume Forecast" subtitle="Metric tonnes · 6-month horizon" actions={<ForecastLegend color={product.color} />}>
        <ForecastChart data={buildForecastSeries(h, f, 'volume')} metric="volume" color={product.color} />
      </Card>

      <Card header="Export Value Forecast" subtitle="USD · 6-month horizon" actions={<ForecastLegend color={product.color} />}>
        <ForecastChart data={buildForecastSeries(h, f, 'value')} metric="value" color={product.color} />
      </Card>

      <Card header="Forecast with Prediction Intervals" subtitle="95% prediction interval (PI) for each month">
        <ResponsiveTable columns={forecastColumns} rows={f} rowKey="month" />
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
        <Card
          header="Model Comparison"
          subtitle="Back-test on the last 12 months"
          className="lg:col-span-3"
          actions={
            <Button to="/c1/models" variant="ghost" size="sm">
              All models
            </Button>
          }
        >
          <ResponsiveTable columns={modelColumns} rows={metrics} highlight={(m) => m.mape === bestMape} />
          <p className="caption mt-3">
            Lower MAE, RMSE and MAPE is better. Coverage is the share of actuals inside the 95% interval (closer to 95%
            is better).
          </p>
        </Card>

        <Card header="Contributing Factors" subtitle="Hybrid model feature importance" className="lg:col-span-2">
          <ul className="space-y-3">
            {factors.map((fct) => (
              <li key={fct.name}>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-start gap-1.5 text-neutral-700">
                    {fct.direction === 'up' ? (
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-risk-low" aria-label="Increases exports" />
                    ) : (
                      <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-risk-critical" aria-label="Decreases exports" />
                    )}
                    {fct.name}
                  </span>
                  <span className="font-semibold tabular-nums">{formatPercent(fct.weight, 0)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-c1" style={{ width: `${fct.weight * 100 * 2.5}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
