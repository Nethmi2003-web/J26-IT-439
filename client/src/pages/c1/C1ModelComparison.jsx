import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Info, Trophy } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import ResponsiveTable from '../../components/ui/ResponsiveTable.jsx';
import ChartTooltip from '../../components/ui/ChartTooltip.jsx';
import { models, periodAccuracy } from '../../data/c1MockData.js';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import { formatNumber } from '../../utils/format.js';

const axis = {
  tick: { fill: '#9CA3AF', fontSize: 12 },
  tickLine: false,
};

export default function C1ModelComparison() {
  const isMobile = useIsMobile();
  const chartHeight = isMobile ? 240 : 320;

  const columns = [
    {
      key: 'name',
      label: 'Model',
      render: (m) => (
        <span className="inline-flex items-center gap-2 font-semibold">
          {m.name}
          {m.best && <Badge variant="success" icon={Trophy}>Best</Badge>}
        </span>
      ),
    },
    { key: 'mae', label: 'MAE (MT)', align: 'right', render: (m) => formatNumber(m.mae) },
    { key: 'rmse', label: 'RMSE (MT)', align: 'right', render: (m) => formatNumber(m.rmse) },
    { key: 'mape', label: 'MAPE', align: 'right', render: (m) => `${m.mape}%` },
    { key: 'coverage', label: 'Coverage (95%)', align: 'right', render: (m) => `${m.coverage}%` },
  ];

  const periodColumns = [
    { key: 'model', label: 'Model', render: (r) => <span className="font-semibold">{r.model}</span> },
    { key: 'preMape', label: 'MAPE pre-2022', align: 'right', render: (r) => `${r.preMape}%` },
    { key: 'postMape', label: 'MAPE post-2022', align: 'right', render: (r) => `${r.postMape}%` },
    {
      key: 'change',
      label: 'Change',
      align: 'right',
      render: (r) => <span className="text-risk-critical">+{(r.postMape - r.preMape).toFixed(1)} pts</span>,
    },
    { key: 'preCoverage', label: 'Coverage pre', align: 'right', render: (r) => `${r.preCoverage}%` },
    { key: 'postCoverage', label: 'Coverage post', align: 'right', render: (r) => `${r.postCoverage}%` },
  ];

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Model Comparison</h1>
        <p className="caption mt-1">
          Back-test results for all five products combined, using a rolling 12-month evaluation window.
        </p>
      </div>

      {/* Model cards */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-6">
        {models.map((m) => (
          <Card key={m.id} className={m.best ? 'ring-2 ring-primary-400' : ''}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{m.name}</h2>
              {m.best && <Badge variant="success" icon={Trophy}>Best</Badge>}
            </div>
            <p className="caption mt-1">{m.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['MAPE', `${m.mape}%`],
                ['Coverage', `${m.coverage}%`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-sm bg-neutral-100 p-3">
                  <dt className="text-xs text-neutral-400">{k}</dt>
                  <dd className="text-xl font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>

      <Card header="Accuracy Metrics" subtitle="Lower MAE, RMSE and MAPE is better; coverage should be close to 95%">
        <ResponsiveTable columns={columns} rows={models} highlight={(m) => m.best} />
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6">
        <Card header="MAE and RMSE by Model" subtitle="Metric tonnes · lower is better">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={models} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={2} barCategoryGap="28%">
              <CartesianGrid stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" {...axis} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis {...axis} axisLine={false} width={44} />
              <Tooltip content={<ChartTooltip format={(v) => `${formatNumber(v)} MT`} />} cursor={{ fill: '#F3F4F6' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar isAnimationActive={false} dataKey="mae" name="MAE" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar isAnimationActive={false} dataKey="rmse" name="RMSE" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card header="MAPE: Pre-2022 vs Post-2022" subtitle="Percent · lower is better">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={periodAccuracy} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={2} barCategoryGap="28%">
              <CartesianGrid stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="model" {...axis} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis {...axis} axisLine={false} width={36} unit="%" />
              <Tooltip content={<ChartTooltip format={(v) => `${v}%`} />} cursor={{ fill: '#F3F4F6' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar isAnimationActive={false} dataKey="preMape" name="Pre-2022" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar isAnimationActive={false} dataKey="postMape" name="Post-2022" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card header="Pre-2022 vs Post-2022 Accuracy" subtitle="How the 2022 structural break affected each model">
        <ResponsiveTable columns={periodColumns} rows={periodAccuracy} rowKey="model" />
        <div className="mt-4 flex gap-3 rounded-sm bg-blue-50 p-3 text-sm text-neutral-700">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-c1" aria-hidden />
          <p>
            All models lost accuracy after 2022, when the economic crisis caused sharp swings in exchange rates and
            input costs. The hybrid model degraded least and kept interval coverage closest to 95%, which is why it is
            used for the production forecasts.
          </p>
        </div>
      </Card>
    </div>
  );
}
