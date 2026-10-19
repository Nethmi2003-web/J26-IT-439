import { Link } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import {
  Activity, ArrowRight, BarChart3, Bell, CloudRain, Database, FileText, Flame, Image, Leaf, Map, Settings,
  TrendingUp,
} from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AlertItem from '../components/ui/AlertItem.jsx';
import ChartTooltip from '../components/ui/ChartTooltip.jsx';
import {
  activityTimeline, alerts, currentUser, productSummary, totalForecast, totalHistory,
} from '../data/c1MockData.js';
import { formatMt, formatPercent } from '../utils/format.js';

const timelineIcons = { model: Activity, data: Database, alert: Bell, report: FileText, settings: Settings };

// Small decorative previews for modules that are not built yet.
function MiniImagePreview() {
  return (
    <div className="grid h-28 grid-cols-3 gap-2" aria-hidden>
      {['bg-green-100', 'bg-amber-100', 'bg-green-200'].map((bg, i) => (
        <div key={i} className={`grid place-items-center rounded-sm ${bg}`}>
          <Leaf className="h-6 w-6 text-primary-500/60" />
        </div>
      ))}
    </div>
  );
}

function MiniMap({ spots }) {
  return (
    <svg viewBox="0 0 200 110" className="h-28 w-full rounded-sm bg-neutral-100" aria-hidden>
      <path
        d="M95 8c18 4 30 18 36 34 6 18 4 38-6 52-8 10-22 12-34 8-14-4-24-16-28-30-4-16 0-34 8-46 6-10 14-20 24-18z"
        fill="#E5E7EB"
        stroke="#9CA3AF"
        strokeWidth="1"
      />
      {spots.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.color} fillOpacity="0.35" stroke={s.color} strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function ComponentCard({ icon: Icon, code, title, color, preview, summary, to }) {
  return (
    <Card className="flex flex-col">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm text-white" style={{ background: color }}>
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-400">{code}</p>
            <h3 className="truncate font-semibold text-neutral-900">{title}</h3>
          </div>
        </div>
        {to ? <Badge variant="success">Active</Badge> : <Badge variant="neutral">Coming Soon</Badge>}
      </div>
      <div className={to ? '' : 'opacity-60'}>{preview}</div>
      <p className="mt-3 text-sm font-medium text-neutral-700">{summary}</p>
      <div className="mt-4">
        {to ? (
          <Button to={to} variant="secondary" size="sm" iconRight={ArrowRight}>
            View Details
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled title="Coming Soon">
            Coming Soon
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function MainDashboard() {
  const summary = productSummary('all');
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const miniData = [
    ...totalHistory.slice(-9).map((r) => ({ label: r.label, actual: r.volume })),
    ...totalForecast.slice(0, 3).map((r) => ({ label: r.label, forecast: r.volume })),
  ];
  miniData[8].forecast = miniData[8].actual; // connect the two lines

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Welcome, {currentUser.name}</h1>
        <p className="caption mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        <StatCard icon={TrendingUp} label="Export Change (YoY)" value="+12%" trend="up" trendLabel="vs last 12 months" iconClass="bg-blue-50 text-c1" />
        <StatCard icon={Leaf} label="Healthy Crowns" value="87%" trend="up" trendLabel="+2% this month" iconClass="bg-green-50 text-c2" />
        <StatCard icon={CloudRain} label="Drought Risk" value="Medium" trend="flat" trendLabel="3 districts watched" iconClass="bg-amber-50 text-c3" />
        <StatCard icon={Flame} label="Active Hotspots" value="3" trend="up" trendGood={false} trendLabel="+1 since last week" iconClass="bg-red-50 text-c4" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:gap-6">
        <ComponentCard
          icon={BarChart3}
          code="C1"
          title="Export Forecast"
          color="#2563EB"
          to="/c1/dashboard"
          summary={`Next 3 months: ${summary.next3Change >= 0 ? '↑' : '↓'} ${formatPercent(Math.abs(summary.next3Change), 0)} total volume`}
          preview={
            <ResponsiveContainer width="100%" height={112}>
              <LineChart data={miniData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <XAxis dataKey="label" hide />
                <Tooltip
                  content={<ChartTooltip format={formatMt} names={{ actual: 'Historical', forecast: 'Forecast' }} />}
                />
                <Line isAnimationActive={false} dataKey="actual" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line isAnimationActive={false} dataKey="forecast" stroke="#2563EB" strokeWidth={2} strokeDasharray="5 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          }
        />
        <ComponentCard icon={Image} code="C2" title="Crown Detection" color="#16A34A" summary="12 new detections" preview={<MiniImagePreview />} />
        <ComponentCard
          icon={CloudRain}
          code="C3"
          title="Drought Risk"
          color="#F59E0B"
          summary="3 zones at risk"
          preview={<MiniMap spots={[{ x: 90, y: 30, r: 12, color: '#F59E0B' }, { x: 110, y: 55, r: 9, color: '#F59E0B' }, { x: 80, y: 60, r: 7, color: '#F59E0B' }]} />}
        />
        <ComponentCard
          icon={Map}
          code="C4"
          title="Spatial Spread"
          color="#DC2626"
          summary="2 new hotspots"
          preview={<MiniMap spots={[{ x: 98, y: 96, r: 8, color: '#DC2626' }, { x: 118, y: 92, r: 6, color: '#DC2626' }]} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6">
        <Card
          header="Recent Alerts"
          actions={
            <Button to="/c1/alerts" variant="ghost" size="sm" iconRight={ArrowRight}>
              View all
            </Button>
          }
        >
          <ul className="divide-y divide-neutral-200">
            {alerts.slice(0, 3).map((a) => (
              <AlertItem key={a.id} alert={a} />
            ))}
          </ul>
        </Card>

        <Card header="Activity Timeline">
          <ol className="relative space-y-5 border-l border-neutral-200 pl-6">
            {activityTimeline.map((item) => {
              const Icon = timelineIcons[item.type];
              return (
                <li key={item.id} className="relative">
                  <span className="absolute -left-[37px] grid h-7 w-7 place-items-center rounded-full bg-primary-100 ring-4 ring-white">
                    <Icon className="h-3.5 w-3.5 text-primary-600" aria-hidden />
                  </span>
                  <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                  <p className="text-xs text-neutral-700 sm:text-sm">{item.detail}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">{item.time}</p>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </div>
  );
}
